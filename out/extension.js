"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const vscode = require("vscode");
// POV-Ray Extension Activation
function activate(context) {
    registerTasks();
    registerCommands(context);
}
exports.activate = activate;
// Creates a task provider for POV-Ray files
function registerTasks() {
    const taskType = "povray"; //This is the taskDefinitions type defined in package.json
    // create a task provider
    const povrayTaskProvider = {
        provideTasks(token) {
            /****************************************/
            /* POV-Ray Render Scene File Build Task */
            /****************************************/
            // Get information about the shell environment context
            let context = getShellContext();
            // Get information about the currently open file
            let fileInfo = getFileInfo(context);
            if (fileInfo.filePath === undefined || fileInfo.filePath === "") {
                // We don't have a file so bail with no tasks
                return [];
            }
            // Get the POV-Ray settings
            let settings = getPOVSettings();
            // build the output file path based on the settings and appropriate to the shell context
            let outFilePath = buildOutFilePath(settings, fileInfo, context);
            // Build the povray executable to run in the shell based on the settings and appropriate to the shell context
            let povrayExe = buildShellPOVExe(settings, fileInfo, outFilePath, context);
            // Build the commandline render options to pass to the executable in the shell based on the settings and appropriate to the shell context
            let renderOptions = buildRenderOptions(settings, fileInfo, outFilePath, context);
            // Create the Shell Execution that runs the povray executable with the render options
            const execution = new vscode.ShellExecution(povrayExe + renderOptions);
            // Use the $povray problem matcher defined in the package.json problemMatchers
            const problemMatchers = ["$povray"];
            // Set up task definition with file information
            let taskDefinition = {
                type: taskType,
                filePath: fileInfo.filePath,
                outFilePath: outFilePath
            };
            // define the build task
            const buildTask = new vscode.Task(taskDefinition, vscode.TaskScope.Workspace, "Render Scene", "POV-Ray", execution, problemMatchers);
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
        resolveTask(task, token) {
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
                if (settings.openImageAfterRender === true) {
                    // Default to opening the image in the active column
                    let column = vscode.ViewColumn.Active;
                    // If the user has indicated that the image should be opened in a new column
                    if (settings.openImageAfterRenderInNewColumn === true) {
                        // Set the column to be the one beside the active column
                        column = vscode.ViewColumn.Beside;
                    }
                    // Open the rendered image, but preserve the focus of the current document
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(taskDefinition.outFilePath), { viewColumn: column, preserveFocus: true });
                }
            }
        }
    });
    // Register the povray task provider with VS Code
    vscode.tasks.registerTaskProvider(taskType, povrayTaskProvider);
}
exports.registerTasks = registerTasks;
// Registers command handlers for POV-Ray files
function registerCommands(context) {
    const renderCommand = 'povray.render';
    // Create a command handler for running the POV-Ray Render Build Task
    const renderCommandHandler = (uri) => {
        // Fetch all of the povray tasks
        vscode.tasks.fetchTasks({ type: "povray" }).then((tasks) => {
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
exports.registerCommands = registerCommands;
// Gets the shell context for the current OS and VS Code configuration
function getShellContext() {
    let shellContext = {
        platform: os.platform(),
        isWindowsBash: isWindowsBash(),
        isWindowsPowershell: isWindowsPowershell()
    };
    return shellContext;
}
exports.getShellContext = getShellContext;
// Gets information about the file in the active Text Editor
function getFileInfo(context) {
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
exports.getFileInfo = getFileInfo;
// Builds an output file path for rendering based on the file info, settings, and shell context
// Specifically checks for whether the user has configured an output path
function buildOutFilePath(settings, fileInfo, context) {
    // Build the output file path
    // Default to the exact same path as the source file, except with an image extension
    let outFilePath = fileInfo.fileDir + fileInfo.fileName.replace(".pov", ".png");
    // If the user has deinfed an output path in the settings
    if (settings.outputPath.length > 0) {
        if (settings.outputPath.startsWith(".")) {
            // the outputPath defined by the user appears to be relative
            outFilePath = fileInfo.fileDir + settings.outputPath + fileInfo.fileName.replace(".pov", ".png");
        }
        else {
            // Use the custom output path plus the file name of the source file wirg rge extention changed to the image extension
            outFilePath = settings.outputPath + fileInfo.fileName.replace(".pov", ".png");
        }
    }
    // Normalize the outFileName to make sure that it works for Windows
    outFilePath = normalizePath(outFilePath, context);
    return outFilePath;
}
exports.buildOutFilePath = buildOutFilePath;
// Builds the command to call in the shell in order to run POV-Ray
// depending on the OS, Shell, and whether the user has selected to
// use docker to run POV-Ray
function buildShellPOVExe(settings, fileInfo, outFilePath, context) {
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
            dockerSource = dockerSource.replace("c:", "/c").replace(/\\/g, "/");
            dockerOutput = dockerOutput.replace("c:", "/c").replace(/\\/g, "/");
        }
        // mount the source and output directories
        exe += " run -v " + dockerSource + ":/source -v " + dockerOutput + ":/output " + settings.useDockerImage;
    }
    return exe;
}
exports.buildShellPOVExe = buildShellPOVExe;
// Builds a string of commandline arguments to pass to the POV-Ray executable
// to indicate which file to render, the output path, the width and height, etc.
// based on the settings, file to render, output path provided, and the shell context
function buildRenderOptions(settings, fileInfo, outFilePath, context) {
    // Start building the render command that will be run in the shell
    let renderOptions = " ${fileBasename} -D";
    // if this is a .pov file, pass the default render width and height from the settings
    // as commandline arguments, otherwise we assume that the .ini file will include 
    // width and height instructions
    if (fileInfo.fileExt !== undefined && fileInfo.fileExt === ".pov") {
        renderOptions += " Width=" + settings.defaultRenderWidth + " Height=" + settings.defaultRenderHeight;
    }
    // If the user has set an output path for rendered files, 
    // add the output path as a commandline argument
    if (settings.outputPath.length > 0) {
        // if we are running povray using Docker
        if (settings.useDockerToRunPovray) {
            // We have already mounted the output directory
            // so we always output within the docker container to /output
            renderOptions += " Output_File_Name=/output/";
        }
        else { // We aren't running povray using Docker
            // If we are running povray in WSL Bash
            if (context.isWindowsBash) {
                // If the shell is WSL Bash then we need to make sure that
                // the output path is translated into the correct WSL path
                renderOptions += " Output_File_Name=$(wslpath \'" + outFilePath + "\')";
            }
            else {
                // Otherwise the output directory is straight forward
                renderOptions += " Output_File_Name=" + outFilePath;
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
            renderOptions += " Library_Path=$(wslpath '" + settings.libraryPath + "')";
        }
        else {
            renderOptions += " Library_Path=" + settings.libraryPath;
        }
    }
    // If the integrated terminal is Powershell running on Windows, we need to pipe the pvengine.exe through Out-Null
    // to make powershell wait for the rendering to complete and POv-Ray to close before continuing
    if (context.isWindowsPowershell && !settings.useDockerToRunPovray) {
        renderOptions += " | Out-Null";
    }
    return renderOptions;
}
exports.buildRenderOptions = buildRenderOptions;
// Helper function to get the POV-Ray related settings
function getPOVSettings() {
    const configuration = vscode.workspace.getConfiguration('povray');
    let settings = {
        outputPath: configuration.get("render.outputPath").trim(),
        defaultRenderWidth: configuration.get("render.defaultWidth"),
        defaultRenderHeight: configuration.get("render.defaultHeight"),
        libraryPath: configuration.get("libraryPath").trim(),
        openImageAfterRender: configuration.get("render.openImageAfterRender"),
        openImageAfterRenderInNewColumn: configuration.get("render.openImageAfterRenderInNewColumn"),
        useDockerToRunPovray: configuration.get("docker.enableDocker"),
        useDockerImage: configuration.get("docker.image"),
        // DEPRECATED
        deprecated_OutputPath: configuration.get("outputPath").trim(),
        deprecated_DefaultRenderWidth: configuration.get("defaultRenderWidth"),
        deprecated_DefaultRenderHeight: configuration.get("defaultRenderHeight"),
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
exports.getPOVSettings = getPOVSettings;
// Helper function for determining if the integrated terminal is WSL Bash
function isWindowsBash() {
    let isWindowsBash = false;
    if (os.platform() === 'win32') {
        // Find out which shell VS Code is using for Windows
        const terminalSettings = vscode.workspace.getConfiguration("terminal");
        const shell = terminalSettings.get("integrated.shell.windows");
        // If the windows shell is set to use WSL Bash or Git Bash
        if (shell !== undefined && shell.indexOf("bash") !== -1) {
            isWindowsBash = true;
        }
    }
    return isWindowsBash;
}
exports.isWindowsBash = isWindowsBash;
// Helper function for determining if the integrated terminal is Powershell on Windows
function isWindowsPowershell() {
    let isWindowsPowershell = false;
    if (os.platform() === 'win32') {
        // Find out which shell VS Code is using for Windows
        const terminalSettings = vscode.workspace.getConfiguration("terminal");
        const shell = terminalSettings.get("integrated.shell.windows");
        // If the windows shell is set to use powershell
        if (shell !== undefined && shell.indexOf("powershell") !== -1) {
            isWindowsPowershell = true;
        }
    }
    return isWindowsPowershell;
}
exports.isWindowsPowershell = isWindowsPowershell;
// For unit testing to work cross platform, we need to be able
// to normalize paths for a specified shell context (os, shell)
// regardless of the OS we are actually running on.
function normalizePath(filepath, context) {
    if (context.platform === "win32") {
        filepath = path.win32.normalize(filepath);
    }
    else {
        filepath = path.posix.normalize(filepath);
    }
    return filepath;
}
exports.normalizePath = normalizePath;
// For unit testing to work cross platform, we need to be able
// to get the directory name for a specified context (os, shell)
// regardless of the OS we are actually running on.
function getDirName(filepath, context) {
    let dirname = filepath;
    if (context.platform === "win32") {
        dirname = path.win32.dirname(filepath);
    }
    else {
        dirname = path.posix.dirname(filepath);
    }
    return dirname;
}
exports.getDirName = getDirName;
//# sourceMappingURL=extension.js.map