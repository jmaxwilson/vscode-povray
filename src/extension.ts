import * as os from 'os';
import * as path from "path";
import * as vscode from 'vscode';
import * as fs from 'fs';

// POV-Ray Extension Activation
export function activate(context: vscode.ExtensionContext) {

    registerTasks();
    registerCommands(context);

}

// Create a Render Taks Definiton that we can use to pass around info about the render task
interface RenderTaskDefinition extends vscode.TaskDefinition {
    type: string;
    filePath: string;
    outFilePath: string;
}

// The Shell Context will help us determine what shell command to build
interface ShellContext {
    platform: string;               // win32,linux,darwin
    isWindowsBash: boolean;
    isWindowsPowershell: boolean;
}

// Creates a task provider for POV-Ray files
export function registerTasks() {

    const taskType = "povray"; //This is the taskDefinitions type defined in package.json
    
    // create a task provider
    const povrayTaskProvider = {

        provideTasks(token?: vscode.CancellationToken) {

            /****************************************/
            /* POV-Ray Render Scene File Build Task */
            /****************************************/

            // Get information about the shell environment context
            let context = getShellContext();

            // Get information about the currently open file
            let fileInfo = getFileInfo(context);

            if (fileInfo.filePath === undefined || fileInfo.filePath === "")
            {
                // We don't have a file so bail with no tasks
                return [];
            }

            // Get the POV-Ray settings
            let settings = getPOVSettings();

            // build the output file path based on the settings and appropriate to the shell context
            let outFilePath = buildOutFilePath(settings, fileInfo, context);

            // Make sure that the output file directory exists, create it if is doesn't
            createDirIfMissing(outFilePath, context);

            // Build the povray executable to run in the shell based on the settings and appropriate to the shell context
            let povrayExe = buildShellPOVExe(settings, fileInfo, outFilePath, context);

            // Build the commandline render options to pass to the executable in the shell based on the settings and appropriate to the shell context
            let renderOptions = buildRenderOptions(settings, fileInfo, context);
            
            // Create the Shell Execution that runs the povray executable with the render options
            const execution = new vscode.ShellExecution(povrayExe + renderOptions, {cwd: fileInfo.fileDir});

            // Use the $povray problem matcher defined in the package.json problemMatchers
            const problemMatchers = ["$povray"];

            // Set up task definition with file information
            let taskDefinition: RenderTaskDefinition = {
                type: taskType,
                filePath: fileInfo.filePath,
                outFilePath: outFilePath
            };

            // define the build task
            const buildTask = new vscode.Task(
                taskDefinition, 
                vscode.TaskScope.Workspace, 
                "Render Scene", 
                "POV-Ray", 
                execution, 
                problemMatchers);

            // set the task as part of the Build task group    
            buildTask.group = vscode.TaskGroup.Build;
            // clear theterminal every time the tasl is run
            buildTask.presentationOptions.clear = true;
            // don't show a message indictating that the terminal will be reused for subsequent render tasks
            buildTask.presentationOptions.showReuseMessage = false;
            // reevaluate the vars every time
            buildTask.runOptions.reevaluateOnRerun = true;

            // return an array of tasks for this provider
            return [
                buildTask
            ];
        },

        // Legacy
        resolveTask(task: vscode.Task, token?: vscode.CancellationToken) {
            return task;
        }
    };

    // Set up a handler for when the task ends
    vscode.tasks.onDidEndTaskProcess((e) => {

        // If there is an exit code and it is 0 then we assume the render task was successful
        if (e.exitCode !== undefined && e.exitCode === 0) {
            
            // Get the task definition from the event
            let taskDefinition = e.execution.task.definition;
            
            // If we were rendering a .pov file rather than a .ini
            if (taskDefinition.filePath.endsWith(".pov")) {

                // Show an information notification to the user about the output file that was rendered
                vscode.window.showInformationMessage("Rendered: " + taskDefinition.outFilePath);

                const settings = getPOVSettings();
                // If the the user has indicated that the image that ws rendered should be opened
                if (settings.openImageAfterRender === true)
                {
                    // Default to opening the image in the active column
                    let column = vscode.ViewColumn.Active;

                    // If the user has indicated that the image should be opened in a new column
                    if (settings.openImageAfterRenderInNewColumn === true)
                    {
                        // Set the column to be the one beside the active column
                        column = vscode.ViewColumn.Beside;
                    }
                    
                    // Open the rendered image, but preserve the focus of the current document
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(taskDefinition.outFilePath), {viewColumn: column, preserveFocus: true});
                }
                
            }
        }
    });

    // Register the povray task provider with VS Code
    vscode.tasks.registerTaskProvider(taskType, povrayTaskProvider);
}

// Registers command handlers for POV-Ray files
export function registerCommands(context: vscode.ExtensionContext) {

    const renderCommand = 'povray.render';
    
    // Create a command handler for running the POV-Ray Render Build Task
    const renderCommandHandler = (uri:vscode.Uri) => {

        // Fetch all of the povray tasks
        vscode.tasks.fetchTasks({type: "povray"}).then((tasks) => {

            // Loop through the tasks and find the Render Scene Build Task
            tasks.forEach(task => {

                if (task.group === vscode.TaskGroup.Build && task.name === "Render Scene") {
                    // Execute the task
                    vscode.tasks.executeTask(task);
                }
            });
        });
    };

    // Register the render command handler and add it to the context subscriptions
    context.subscriptions.push(vscode.commands.registerCommand(renderCommand, renderCommandHandler));
    
}

// Gets the shell context for the current OS and VS Code configuration
export function getShellContext() : ShellContext {
    let shellContext: ShellContext = {
        platform: os.platform(),
        isWindowsBash: isWindowsBash(),
        isWindowsPowershell: isWindowsPowershell()
    };

    return shellContext;
}

// Gets information about the file in the active Text Editor
export function getFileInfo(context: ShellContext) {
    // Get inormation about currently open file path 
    let fileInfo = {
        filePath: "",
        fileName: "",
        fileExt: "",
        fileDir: ""
    };
    
    if (vscode.window.activeTextEditor !== undefined) {

        fileInfo.filePath = vscode.window.activeTextEditor.document.fileName;
        fileInfo.fileDir = getDirName(fileInfo.filePath, context) + "/";
        fileInfo.fileName = path.basename(fileInfo.filePath);
        fileInfo.fileExt = path.extname(fileInfo.filePath);
    }

    return fileInfo;
}

export function getOutputFileExtension(settings: any) {
    let outExt = ".png";
    switch (settings.outputFormat) {
        case "png - Portable Network Graphics": outExt = ".png"; break;
        case "jpg - JPEG (lossy)": outExt = ".jpg"; break;
        case "bmp - Bitmap": outExt = ".bmp"; break;
        case "tga - Targa-24 (compressed)": outExt = ".tga"; break;
        case "tga - Targa-24": outExt = ".tga"; break;
        case "exr - OpenEXR High Dynamic-Range": outExt = ".exr"; break;
        case "hdr - Radiance High Dynamic-Range": outExt = ".hdr"; break;
        case "ppm - Portable Pixmap": outExt = ".ppm"; break;
    }

    return outExt;
}

export function getOutputFormatOption(settings: any) {
    let formatOption = "";
    switch (settings.outputFormat) {
        case "png - Portable Network Graphics": formatOption = ""; break;
        case "jpg - JPEG (lossy)": formatOption = " Output_File_Type=J"; break;
        case "bmp - Bitmap": formatOption = " Output_File_Type=B"; break;
        case "tga - Targa-24 (compressed)": formatOption = " Output_File_Type=C"; break;
        case "tga - Targa-24": formatOption = " Output_File_Type=T"; break;
        case "exr - OpenEXR High Dynamic-Range": formatOption = " Output_File_Type=E"; break;
        case "hdr - Radiance High Dynamic-Range": formatOption = " Output_File_Type=H"; break;
        case "ppm - Portable Pixmap": formatOption = " Output_File_Type=P"; break;
    }

    return formatOption;
}

// Builds an output file path for rendering based on the file info, settings, and shell context
// Specifically checks for whether the user has configured an output path
export function buildOutFilePath(settings: any, fileInfo: any, context: ShellContext) {

    let outExt = getOutputFileExtension(settings);
    // Build the output file path
    // Default to the exact same path as the source file, except with an image extension
    let outFilePath = fileInfo.fileDir + fileInfo.fileName.replace(".pov", outExt).replace(".ini", outExt); 
    // If the user has deinfed an output path in the settings
    if (settings.outputPath.length > 0)
    {
        if (settings.outputPath.startsWith(".")) {
            // the outputPath defined by the user appears to be relative
            outFilePath = fileInfo.fileDir + settings.outputPath + fileInfo.fileName.replace(".pov", outExt).replace(".ini", outExt);    
        } else {
            // Use the custom output path plus the file name of the source file wirg rge extention changed to the image extension
            outFilePath = settings.outputPath + fileInfo.fileName.replace(".pov", outExt).replace(".ini", outExt);
        }
        
    }
    // Normalize the outFileName to make sure that it works for Windows
    outFilePath = normalizePath(outFilePath, context);

    return outFilePath;
}

// Creates the directory for the specified path if it doesn't already exist
export function createDirIfMissing(filePath: string, context: ShellContext) {

    let outDir = normalizePath(getDirName(filePath, context), context);

    if (!fs.existsSync(outDir)) {

        fs.mkdirSync(outDir);
    }
} 

// Builds the command to call in the shell in order to run POV-Ray
// depending on the OS, Shell, and whether the user has selected to
// use docker to run POV-Ray
export function buildShellPOVExe(settings: any, fileInfo: any, outFilePath: any, context: ShellContext) {
    // Default to running an executable called povray (Linux, Mac, WSL Ubuntu Bash, Git Bash)
    let exe = "povray";

    // If we are running on Windows but not Bash
    if (context.platform === 'win32' && !context.isWindowsBash) {

        // Change the povray executable to the windows pvengine instead
        exe = "pvengine /EXIT /RENDER";
    }

    // If we are running povray via Docker
    if (settings.useDockerToRunPovray === true) {
        exe = "docker";

        // Get the source and output directories to mount into the docker image
        let dockerSource = normalizePath(fileInfo.fileDir, context);
        let dockerOutput = normalizePath(getDirName(outFilePath, context), context);

        // If the integrated terminal is WSL Bash
        if (context.isWindowsBash) {
            // Running Windows Docker from WSL Bash requires some extra setup

            // We have to tell the docker client to connect to Windows Docker over TCP
            exe += " --host tcp://127.0.0.1:2375";

            // For the paths to be understod by both WSL Bash AND Docker for Windows,
            // you have to have a symlink called /c that points to /mnt/c
            dockerSource = dockerSource.replace("c:","/c").replace(/\\/g, "/");
            dockerOutput = dockerOutput.replace("c:","/c").replace(/\\/g, "/");
        }

        // mount the source and output directories
        if (context.isWindowsPowershell) {

            // If the shell is Powershell, use single quotes around paths to make sure spaces in paths work correctly
            exe += " run -v \'"+dockerSource+":/source\' -v \'"+dockerOutput+":/output\' "+settings.useDockerImage;

        } else {
            // otherwise use double quotes around paths to make sure that spaces work correctly
            exe += " run -v \""+dockerSource+":/source\" -v \""+dockerOutput+":/output\" "+settings.useDockerImage;
        }
    }

    return exe;
}

// Builds a string of commandline arguments to pass to the POV-Ray executable
// to indicate which file to render, the output path, the width and height, etc.
// based on the settings, file to render, output path provided, and the shell context
export function buildRenderOptions(settings: any, fileInfo: any, context: ShellContext) {

    // Start building the render command that will be run in the shell
    let renderOptions = getInputFileOption(settings, fileInfo, context) ;
    
    renderOptions += getDisplayRenderOption(settings);

    renderOptions += getDimensionOptions(settings, fileInfo);

    renderOptions += getOutputPathOption(settings, context);

    renderOptions += getLibraryPathOption(settings, context);

    renderOptions += getOutputFormatOption(settings);

    renderOptions += getCustomCommandlineOptions(settings);

    // If the integrated terminal is Powershell running on Windows, we need to pipe the pvengine.exe through Out-Null
    // to make powershell wait for the rendering to complete and POv-Ray to close before continuing
    if (context.isWindowsPowershell && !settings.useDockerToRunPovray) {
        renderOptions += " | Out-Null";
    }

    return renderOptions;
}

export function getInputFileOption(settings: any, fileInfo: any, context: ShellContext) {

    let fileInputOption = "${fileBasename}";

    // Handle the cases where the input file name contains spaces
    if (fileInfo.fileName.indexOf(" ") !== -1) {

        if (context.platform === "linux" || context.platform === "darwin" || context.isWindowsBash) {
            // For Mac, Linux, and WSL Bash we have to put some weird quoting aroun the filename
            // and escape the space
            // "'"File\ Name.pov"'""
            fileInputOption = '"\'"'+fileInfo.fileName.replace(/ /g, "\\ ")+'"\'"';
        }
        else {
            //Windows but NOT WSL Bash
            if (settings.useDockerToRunPovray) {
                // Docker on Windows

                if (context.isWindowsPowershell) {

                    fileInputOption = "'''${fileBasename}'''";

                } else {
                    // Docker on CMD.exe
                    // '"File\ Name.pov"'
                    fileInputOption = "'\""+fileInfo.fileName+"\"'";
                }
            } else {
                // Not using Docker
                if (context.isWindowsPowershell) {
                    
                    fileInputOption = "'"+fileInfo.fileName+"'";

                } else {
                    // CMD.exe
                    // "File Name.pov"
                    fileInputOption = '"${fileBasename}"';
                }
            }
        }
    }

    return " "+fileInputOption;
}

export function getDisplayRenderOption(settings: any) {
    
    let displayRenderOption = " -D";

    if (settings.displayImageDuringRender === true) {
        displayRenderOption = "";
    }

    return displayRenderOption;
}

export function getDimensionOptions(settings: any, fileInfo: any) {

    let dimensionOptions = "";

    // if this is a .pov file, pass the default render width and height from the settings
    // as commandline arguments, otherwise we assume that the .ini file will include 
    // width and height instructions
    if (fileInfo.fileExt !== undefined && fileInfo.fileExt === ".pov") {
        dimensionOptions = " Width="+settings.defaultRenderWidth+" Height="+settings.defaultRenderHeight;
    }

    return dimensionOptions;
}

export function getOutputPathOption(settings: any, context: ShellContext) {

    let outputPathOption = "";

    // If the user has set an output path for rendered files, 
    // add the output path as a commandline argument
    if (settings.outputPath.length > 0) {

        // if we are running povray using Docker
        if (settings.useDockerToRunPovray) {

            // We have already mounted the output directory
            // so we always output within the docker container to /output
            outputPathOption = " Output_File_Name=/output/";

        } else { // We aren't running povray using Docker

            // Use the actual path specified in the settings rather than the 
            // calculated full path so that we avoid unnecessary problems with
            // output filenames that include spaces. 
            // (Output file names with spaces fail when the shell is Powershell. 
            // See: https://github.com/jmaxwilson/vscode-povray/issues/10 )
            let outFilePath = settings.outputPath; 

            if (context.isWindowsBash && outFilePath.indexOf(" ") === -1)
            {
                // If the shell is WSL Bash then we need to make sure that
                // the output path is translated into the correct WSL path
                // wslpath strips the final slash, but POV-Ray needs
                // a slash at the end to know that it is a path and not a filename
                // so we include a slash after the call to wslpath
                outFilePath = "$(wslpath \'"+outFilePath+"\')/";

            } else if (outFilePath.indexOf(" ") !== -1) {

                // If the outFilePath has any spaces then we need to do some weird quoting
                // to get POV-Ray to parse it right depending on the OS & Shell

                if (context.platform === "linux" || context.platform === "darwin") {
                    // Linux, Mac 
                    // "'"/directory/path\ 1/file\ 1.png"'"  
                    outFilePath = '"\'"'+outFilePath.replace(/ /g, "\\ ").replace(/\\\\/g, "\\")+'"\'"'; 
                }
                else {
                    if (context.isWindowsBash) {
                        // WSL Bash
                        // in addition to translating the path using wslpath, we pass the path 
                        // through sed to escape the spaces and surround it with quotes.
                        // Because wslpath strips the trailing slash, we add a slash at the end
                        // so that POV-Ray will recognize it as a path and not a file
                        // "'"$(wslpath '\directory\path 1\file 1.png' | sed 's/ /\\ /g')"'"
                        outFilePath = "\"'\"$(wslpath \'"+outFilePath+"\' | sed \'s/ /\\\\ /g\')/\"'\"";

                    } else if (context.isWindowsPowershell) {
                        // Powershell
                        // Add triple quotes around path
                        outFilePath = "'"+outFilePath+"'"; // Powershell 

                    } else if (!context.isWindowsBash) {
                        // cmd.exe:
                        // Add quotes around path 
                        // "\directory\path 1/file 1.png"
                        outFilePath = '"'+outFilePath+'"'; 
                    }
                }
            }

            outputPathOption = " Output_File_Name="+outFilePath;
        }
    }

    return outputPathOption;
}

export function getLibraryPathOption(settings: any, context: ShellContext) {

    let libraryOption = "";

    // If the user has set library path, 
    // add the library path as a commandline argument
    // We ignore the Library Path if we are using docker
    if (settings.libraryPath.length > 0 && !settings.useDockerToRunPovray) {

        settings.libraryPath = normalizePath(settings.libraryPath, context);

        if (context.isWindowsBash) {
            // If the shell is WSL Bash then we need to make sure that
            // the library path is translated into the correct WSL path
            libraryOption = " Library_Path=$(wslpath '"+settings.libraryPath+"')";

        } else {

            libraryOption = " Library_Path="+settings.libraryPath;
        }
    }

    return libraryOption;
}

export function getCustomCommandlineOptions(settings: any) {
    
    let CustomOptions = "";

    if (settings.customCommandlineOptions.length > 0) {
        CustomOptions = " " + settings.customCommandlineOptions.trim();
    }

    return CustomOptions;
}

// Helper function to get the POV-Ray related settings
export function getPOVSettings() {
    const configuration = vscode.workspace.getConfiguration('povray');
    let settings = {
        outputPath:                         (<string>configuration.get("render.outputPath")).trim(),
        outputFormat:                       (<string>configuration.get("render.outputImageFormat")),
        defaultRenderWidth:                 <string>configuration.get("render.defaultWidth"),
        defaultRenderHeight:                <string>configuration.get("render.defaultHeight"),
        libraryPath:                        (<string>configuration.get("libraryPath")).trim(),
        customCommandlineOptions:           configuration.get("render.customCommandlineOptions"),
        displayImageDuringRender:           configuration.get("render.displayImageDuringRender"),
        openImageAfterRender:               configuration.get("render.openImageAfterRender"),
        openImageAfterRenderInNewColumn:    configuration.get("render.openImageAfterRenderInNewColumn"),
        useDockerToRunPovray:               configuration.get("docker.enableDocker"),
        useDockerImage:                     configuration.get("docker.image"),

        // DEPRECATED
        deprecated_OutputPath:                      (<string>configuration.get("outputPath")).trim(),
        deprecated_DefaultRenderWidth:              <string>configuration.get("defaultRenderWidth"),
        deprecated_DefaultRenderHeight:             <string>configuration.get("defaultRenderHeight"),
    };

    // Handle deprecated settings
    // TODO: Remove deprecated settings completely after 2019-05-01
    // Deprecated Output Path
    let current = configuration.inspect("render.outputPath");
    let deprecated = configuration.inspect("outputPath");  
    if (current !== undefined && deprecated !== undefined) {
        // If they have set a custom output path in the deprecated setting
        // AND the new output path setting has not been changed from its default
        if (settings.deprecated_OutputPath !== deprecated.defaultValue &&
            settings.outputPath === current.defaultValue) { 

            // Keep using the deprecated value
            settings.outputPath = settings.deprecated_OutputPath;
            // Notify the user that they are using a deprecated setting
            vscode.window.showWarningMessage("POV-Ray: the Output Path (povray.outputPath) setting has been deprecated.\nPlease use Render > Output Path (povray.render.outputPath) instead.");
        }
    }

    // Deprecated Default Width
    current = configuration.inspect("render.defaultWidth");
    deprecated = configuration.inspect("defaultRenderWidth");
    // If they have set a custom default width in the deprecated setting
    // AND the new default width setting has not been changed from its default
    if (current !== undefined && deprecated !== undefined) {
        if (settings.deprecated_DefaultRenderWidth !== deprecated.defaultValue &&
            settings.defaultRenderWidth === current.defaultValue) {

            // Keep using the deprecated value
            settings.defaultRenderWidth = settings.deprecated_DefaultRenderWidth;
            // Notify the user that they are using a deprecated setting
            vscode.window.showWarningMessage("POV-Ray: the Default Render Width (povray.defaultRenderWidth) setting has been deprecated.\nPlease use Render > Default Width (povray.render.defaultWidth) instead.");
        }
    }

    // Deprecated Default Height
    current = configuration.inspect("render.defaultHeight");
    deprecated = configuration.inspect("defaultRenderHeight");
    // If they have set a custom default height in the deprecated setting
    // AND the new default height setting has not been changed from its default
    if (current !== undefined && deprecated !== undefined) {
        if (settings.deprecated_DefaultRenderHeight !== deprecated.defaultValue &&
        settings.defaultRenderHeight === current.defaultValue) {

            // Keep using the deprecated value
            settings.defaultRenderHeight = settings.deprecated_DefaultRenderHeight;
            // Notify the user that they are using a deprecated setting
            vscode.window.showWarningMessage("POV-Ray: the Default Render Height (povray.defaultRenderHeight) setting has been deprecated.\nPlease use Render > Default Height (povray.render.defaultHeight) instead.");
        }
    }

    // Make sure that if the user has specified an outputPath it ends wth a slash
    // because POV-Ray on Windows wont recognize it is a folder unless it ends with a slash
    if (settings.outputPath.length > 0 
        && !settings.outputPath.endsWith('/') 
        && !settings.outputPath.endsWith('\\')) {

        settings.outputPath += "/";
    }

    // Make sure that if the user has specified a library path it ends wth a slash
    // because POV-Ray on Windows wont recognize it is a folder unless it ends with a slash
    if (settings.libraryPath.length > 0 
        && !settings.libraryPath.endsWith('/') 
        && !settings.libraryPath.endsWith('\\')) {

        settings.libraryPath += "/";
    }

    return settings;
}

// Helper function for determining if the integrated terminal is WSL Bash
export function isWindowsBash() {
    let isWindowsBash = false;

    if (os.platform() === 'win32') {

        // Find out which shell VS Code is using for Windows
        const terminalSettings = vscode.workspace.getConfiguration("terminal");
        const shell = <string>terminalSettings.get("integrated.shell.windows");

        // If the windows shell is set to use WSL Bash or Git Bash
        if (shell !== undefined && shell.indexOf("bash") !== -1 || shell.indexOf("wsl") !== -1) {
            isWindowsBash = true;
        }
    }

    return isWindowsBash;

}

// Helper function for determining if the integrated terminal is Powershell on Windows
export function isWindowsPowershell() {
    let isWindowsPowershell = false;

    if (os.platform() === 'win32') {

        // Find out which shell VS Code is using for Windows
        const terminalSettings = vscode.workspace.getConfiguration("terminal");
        const shell = <string>terminalSettings.get("integrated.shell.windows");

        // If the windows shell is set to use powershell
        if (shell !== undefined && (shell.indexOf("powershell") !== -1 || shell.indexOf("pwsh") !== -1)) {
            isWindowsPowershell = true;
        }
    }

    return isWindowsPowershell;

}

// For unit testing to work cross platform, we need to be able
// to normalize paths for a specified shell context (os, shell)
// regardless of the OS we are actually running on.
export function normalizePath(filepath: string, context: ShellContext) {
    if (context.platform === "win32") {
        filepath = path.win32.normalize(filepath);
    } else {
        filepath = path.posix.normalize(filepath);
    }

    return filepath;
}

// For unit testing to work cross platform, we need to be able
// to get the directory name for a specified context (os, shell)
// regardless of the OS we are actually running on.
export function getDirName(filepath: string, context: ShellContext) {
    let dirname = filepath;
    if (context.platform === "win32") {
        dirname = path.win32.dirname(filepath);
    } else {
        dirname = path.posix.dirname(filepath);
    }

    return dirname;
}