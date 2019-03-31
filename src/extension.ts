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

function registerTasks() {

    const taskType = "povray"; //This is the taskDefinitions type defined in package.json
    
    // create a task provider
    const povrayTaskProvider = {

        provideTasks(token?: vscode.CancellationToken) {

            /****************************************/
            /* POV-Ray Render Scene File Build Task */
            /****************************************/

            // Get inormation about currently open file path 
            let filePath = "";
            let fileName = "";
            let fileExt = "";
            let fileDir = "";
            if (vscode.window.activeTextEditor !== undefined) {
                filePath = vscode.window.activeTextEditor.document.fileName;
                fileDir = path.dirname(filePath) + "/";
                fileName = path.basename(filePath);
                fileExt = path.extname(filePath);
            }

            if (filePath === "")
            {
                // We don't have a file so bail with no tasks
                return [];
            }
            
            // Get the POV-Ray settings
            let settings = getPOVSettings();

            // Build the output file path
            // Default to the exact same path as the source file, except with an image extension
            let outFilePath = fileDir + fileName.replace(".pov",".png");
            // If the user has deinfed an output path in the settings
            if (settings.outputPath.length > 0)
            {
                if (settings.outputPath.startsWith(".")) {
                    // the outputPath defined by the user appears to be relative
                    outFilePath = fileDir + settings.outputPath + fileName.replace(".pov",".png");    
                } else {
                    // Use the custom output path plus the file name of the source file wirg rge extention changed to the image extension
                outFilePath = settings.outputPath + fileName.replace(".pov",".png");
                }
                
            }
            // Normalize the outFileName to make sure that it works for Windows
            outFilePath = path.normalize(outFilePath);

            // Default to running an executable called povray (Linux, Mac, WSL Ubuntu Bash, Git Bash)
            let cmd = "povray";

            // If we are running on Windows but not Bash
            if (os.platform() === 'win32' && !isWindowsBash()) {

                // Change the povray executable to the windows pvengine instead
                cmd = "pvengine /EXIT /RENDER";
            }

            // Start building the render command that will be run in the shell
            let renderCmd = cmd + " ${fileBasename} -D";
            
            // if this is a .pov file, pass the default render width and height from the settings
            // as commandline arguments, otherwise we assume that the .ini file will include 
            // width and height instructions
            if (fileExt !== undefined && fileExt === ".pov") {
                renderCmd += " Width="+settings.defaultRenderWidth+" Height="+settings.defaultRenderHeight;
            }

            // If the user has set an output path for rendered files, 
            // add the output path as a commandline argument
            if (settings.outputPath.length > 0) {
                if (!isWindowsBash())
                {
                    renderCmd += " Output_File_Name="+outFilePath;
                } else {
                    // If the shell is WSL Bash then we need to make sure that the output path is translated into the correct WSL path
                    renderCmd += " Output_File_Name=$(wslpath \'"+outFilePath+"\')";
                }
            }

            // If the user has set library path, 
            // add the library path as a commandline argument
            if (settings.libraryPath.length > 0) {

                settings.libraryPath = path.normalize(settings.libraryPath);

                if (!isWindowsBash())
                {
                    renderCmd += " Library_Path="+settings.libraryPath;

                } else {

                    // If the shell is WSL Bash then we need to make sure that the library path is translated into the correct WSL path
                    renderCmd += " Library_Path=$(wslpath '"+settings.libraryPath+"')";
                }
            }

            // If the integrated terminal is Powershell running on Windows, we need to pipe the pvengine.exe through Out-Null
            // to make powershell wait for the rendering to complete and POv-Ray to close before continuing
            if (isWindowsPowershell()) {
                renderCmd += " | Out-Null";
            }
            
            // For the build task, execute povray as a shell command
            const execution = new vscode.ShellExecution(renderCmd);

            // Use the $povray problem matcher defined in the package.json problemMatchers
            const problemMatchers = ["$povray"];

            // Set up task definition with file information
            let taskDefinition: RenderTaskDefinition = {
                type: taskType,
                filePath: filePath,
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

function registerCommands(context: vscode.ExtensionContext) {

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

// Helper function to get the POV-Ray related settings
function getPOVSettings()
{
    const configuration = vscode.workspace.getConfiguration('povray');
    let settings = {
        outputPath:                         (<string>configuration.get("outputPath")).trim(),
        defaultRenderWidth:                 <string>configuration.get("defaultRenderWidth"),
        defaultRenderHeight:                <string>configuration.get("defaultRenderHeight"),
        libraryPath:                        (<string>configuration.get("libraryPath")).trim(),
        openImageAfterRender:               configuration.get("openImageAfterRender"),
        openImageAfterRenderInNewColumn:    configuration.get("openImageAfterRenderInNewColumn")
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

// Helper function for determining if the integrated terminal is WSL Bash
function isWindowsBash()
{
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

// Helper function for determining if the integrated terminal is Powershell on Windows
function isWindowsPowershell()
{
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