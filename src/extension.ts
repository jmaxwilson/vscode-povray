import * as os from 'os';
import * as path from "path";
import * as vscode from 'vscode';

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

export function registerTasks() {

    const taskType = "povray"; //This is the taskDefinitions type defined in package.json
    
    // create a task provider
    const povrayTaskProvider = {

        provideTasks(token?: vscode.CancellationToken) {

            /****************************************/
            /* POV-Ray Render Scene File Build Task */
            /****************************************/

            // Get information about the environment context
            let context = getContext();

            // Get information about the currently open file
            let fileInfo = getFileInfo();

            if (fileInfo.filePath === undefined || fileInfo.filePath === "")
            {
                // We don't have a file so bail with no tasks
                return [];
            }

            // Get the POV-Ray settings
            let settings = getPOVSettings();

            // build the output file path
            let outFilePath = buildOutFilePath(settings, fileInfo, context);

            // Build the povray executable to run in the shell
            let povrayExe = buildShellPOVExe(settings, fileInfo, outFilePath, context);

            // Build the commandline render options to pass to the executable in the shell
            let renderOptions = buildRenderOptions(settings, fileInfo, outFilePath, context);
            
            // Create the Shell Execution that runs the povray executable with the render options
            const execution = new vscode.ShellExecution(povrayExe + renderOptions);

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

                // Show an infotmation notification to the user about the output file that was rendered
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

export function getContext() {
    let context = {
        platform: os.platform(),
        isWindowsBash: isWindowsBash(),
        isWindowsPowershell: isWindowsPowershell()
    };

    return context;
}

export function getFileInfo() {
    // Get inormation about currently open file path 
    let fileInfo = {
        filePath: "",
        fileName: "",
        fileExt: "",
        fileDir: ""
    };
    
    if (vscode.window.activeTextEditor !== undefined) {

        fileInfo.filePath = vscode.window.activeTextEditor.document.fileName;
        fileInfo.fileDir = path.dirname(fileInfo.filePath) + "/";
        fileInfo.fileName = path.basename(fileInfo.filePath);
        fileInfo.fileExt = path.extname(fileInfo.filePath);
    }

    return fileInfo;
}

export function buildOutFilePath(settings: any, fileInfo: any, context: any) {
    // Build the output file path
    // Default to the exact same path as the source file, except with an image extension
    let outFilePath = fileInfo.fileDir + fileInfo.fileName.replace(".pov",".png");
    // If the user has deinfed an output path in the settings
    if (settings.outputPath.length > 0)
    {
        if (settings.outputPath.startsWith(".")) {
            // the outputPath defined by the user appears to be relative
            outFilePath = fileInfo.fileDir + normalizePath(settings.outputPath, context) + fileInfo.fileName.replace(".pov",".png");    
        } else {
            // Use the custom output path plus the file name of the source file wirg rge extention changed to the image extension
            outFilePath = settings.outputPath + fileInfo.fileName.replace(".pov",".png");
        }
        
    }
    // Normalize the outFileName to make sure that it works for Windows
    outFilePath = normalizePath(outFilePath, context);

    return outFilePath;
}

export function buildShellPOVExe(settings: any, fileInfo: any, outFilePath: any, context: any) {
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
        let dockerOutput = normalizePath(path.dirname(outFilePath), context);

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

        if (context.platform !== "win32") {
            dockerSource = dockerSource.replace(/\\/g, "/");
            dockerOutput = dockerOutput.replace(/\\/g, "/");
        }

        // mount the source and output directories
        exe += " run -v "+dockerSource+":/source -v "+dockerOutput+":/output "+settings.useDockerImage;
    }

    return exe;
}

export function buildRenderOptions(settings: any, fileInfo: any, outFilePath: string, context: any) {
    // Start building the render command that will be run in the shell
    let renderOptions = " ${fileBasename} -D";
    
    // if this is a .pov file, pass the default render width and height from the settings
    // as commandline arguments, otherwise we assume that the .ini file will include 
    // width and height instructions
    if (fileInfo.fileExt !== undefined && fileInfo.fileExt === ".pov") {
        renderOptions += " Width="+settings.defaultRenderWidth+" Height="+settings.defaultRenderHeight;
    }

    // If the user has set an output path for rendered files, 
    // add the output path as a commandline argument
    if (settings.outputPath.length > 0) {

        // if we are running povray using Docker
        if (settings.useDockerToRunPovray) {

            // We have already mounted the output directory
            // so we always output within the docker container to /output
            renderOptions += " Output_File_Name=/output/";

        } else { // We aren't running povray using Docker
            
            // If we are running povray in WSL Bash
            if (context.isWindowsBash)
            {
                // If the shell is WSL Bash then we need to make sure that
                // the output path is translated into the correct WSL path
                renderOptions += " Output_File_Name=$(wslpath \'"+outFilePath+"\')";
            } else {

                // Otherwise the output directory is straight forward
                renderOptions += " Output_File_Name="+outFilePath;
            }
        }
    }

    // If the user has set library path, 
    // add the library path as a commandline argument
    // We ignore the Library Path if we are using docker
    if (settings.libraryPath.length > 0 && !settings.useDockerToRunPovray) {

        settings.libraryPath = normalizePath(settings.libraryPath, context);

        if (context.isWindowsBash) {
            // If the shell is WSL Bash then we need to make sure that
            // the library path is translated into the correct WSL path
            renderOptions += " Library_Path=$(wslpath '"+settings.libraryPath+"')";

        } else {

            renderOptions += " Library_Path="+settings.libraryPath;
        }
    }

    // If the integrated terminal is Powershell running on Windows, we need to pipe the pvengine.exe through Out-Null
    // to make powershell wait for the rendering to complete and POv-Ray to close before continuing
    if (context.isWindowsPowershell && !settings.useDockerToRunPovray) {
        renderOptions += " | Out-Null";
    }

    if (context.platform !== "win32") {
        renderOptions = renderOptions.replace(/\\/g, "/");
    }

    return renderOptions;
} 

// Helper export function to get the POV-Ray related settings
export function getPOVSettings() {
    const configuration = vscode.workspace.getConfiguration('povray');
    let settings = {
        outputPath:                         (<string>configuration.get("render.outputPath")).trim(),
        defaultRenderWidth:                 <string>configuration.get("render.defaultWidth"),
        defaultRenderHeight:                <string>configuration.get("render.defaultHeight"),
        libraryPath:                        (<string>configuration.get("libraryPath")).trim(),
        openImageAfterRender:               configuration.get("render.openImageAfterRender"),
        openImageAfterRenderInNewColumn:    configuration.get("render.openImageAfterRenderInNewColumn"),
        useDockerToRunPovray:               configuration.get("docker.enableDocker"),
        useDockerImage:                     configuration.get("docker.image")
    };

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

// Helper export function for determining if the integrated terminal is WSL Bash
export function isWindowsBash() {
    let isWindowsBash = false;

    if (os.platform() === 'win32') {

        // Find out which shell VS Code is using for Windows
        const terminalSettings = vscode.workspace.getConfiguration("terminal");
        const shell = <string>terminalSettings.get("integrated.shell.windows");

        // If the windows shell is set to use WSL Bash or Git Bash
        if (shell !== undefined && shell.indexOf("bash") !== -1) {
            isWindowsBash = true;
        }
    }

    return isWindowsBash;

}

// Helper export function for determining if the integrated terminal is Powershell on Windows
export function isWindowsPowershell() {
    let isWindowsPowershell = false;

    if (os.platform() === 'win32') {

        // Find out which shell VS Code is using for Windows
        const terminalSettings = vscode.workspace.getConfiguration("terminal");
        const shell = <string>terminalSettings.get("integrated.shell.windows");

        // If the windows shell is set to use powershell
        if (shell !== undefined && shell.indexOf("powershell") !== -1) {
            isWindowsPowershell = true;
        }
    }

    return isWindowsPowershell;

}

export function normalizePath(filepath: string, context: any) {
    if (context.platform === "win32") {
        filepath = filepath.replace(/\//g, "\\");
    } else {
        filepath = filepath.replace(/\\/g, "/");
    }

    return filepath;
}