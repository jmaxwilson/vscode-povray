"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const vscode = require("vscode");
// Extension Activation
function activate(context) {
    registerTasks();
    registerCommands(context);
}
exports.activate = activate;
function registerTasks() {
    const taskType = "povray"; //This is the taskDefinitions type defined in package.json
    // create a task provider
    const povrayTaskProvider = {
        provideTasks(token) {
            /****************************************/
            /* POV-Ray Render Scene File Build Task */
            /****************************************/
            // Get the currently open file name and extension
            let fileName = undefined;
            let fileExt = undefined;
            if (vscode.window.activeTextEditor !== undefined) {
                fileName = vscode.window.activeTextEditor.document.fileName;
                fileExt = path.extname(fileName);
            }
            // Get the POV-Ray settings
            const settings = vscode.workspace.getConfiguration('povray');
            let outputPath = settings.get("outputPath").trim();
            const renderWidth = settings.get("defaultRenderWidth");
            const renderHeight = settings.get("defaultRenderHeight");
            // Default to running an executable called povray (Linux, Mac, WSL Ubuntu Bash, Git Bash)
            let cmd = "povray";
            // Make sure that if the user has specified an output path that it ends wth a slash
            // because POV-Ray won't think it is a folder unless it ends with a slash
            if (outputPath.length > 0 && !outputPath.endsWith('/') && !outputPath.endsWith('\\')) {
                outputPath += "/";
            }
            // If we are running on Windows
            if (os.platform() === 'win32') {
                // Find out which shell VS Code is using for Windows
                const terminalSettings = vscode.workspace.getConfiguration("terminal");
                const shell = terminalSettings.get("integrated.shell.windows");
                // If the windows shell is not set to use WSL Bash or Git Bash
                if (shell !== undefined && shell.indexOf("bash") === -1) {
                    // Change the povray executable to the windows pvengine instead
                    cmd = "pvengine /EXIT /RENDER";
                    // Normalize the outpath to make sure that it works for Windows
                    if (outputPath.length > 0) {
                        outputPath = path.normalize(outputPath);
                    }
                }
            }
            // Start building the render command that will be run in the shell
            let renderCmd = cmd + " ${fileBasename} -D";
            // if this is a .pov file pass the default render width and height from the settings
            // as commandline arguments, otherwise we assume that the .ini file will include 
            // width and height instructions
            if (fileExt !== undefined && fileExt === ".pov") {
                renderCmd += " Width=" + renderWidth + " Height=" + renderHeight;
            }
            // If the user has set an output path for rendered files, 
            // add the output path as a commandline argument
            if (outputPath.length > 0) {
                renderCmd += " Output_File_Name=" + outputPath;
            }
            // For the build task, execute povray as a shell command
            const execution = new vscode.ShellExecution(renderCmd);
            // Use the $povray problem matcher defined in the package.json problemMatchers
            const problemMatchers = ["$povray"];
            // define the build task
            const buildTask = new vscode.Task({ type: taskType }, vscode.TaskScope.Workspace, "Render Scene", "POV-Ray", execution, problemMatchers);
            // set the task as part of the Build task group    
            buildTask.group = vscode.TaskGroup.Build;
            buildTask.presentationOptions.clear = true;
            buildTask.presentationOptions.showReuseMessage = false;
            buildTask.runOptions.reevaluateOnRerun = true;
            // return an array of tasks for this provider
            return [
                buildTask
            ];
        },
        resolveTask(task, token) {
            return task;
        }
    };
    // Register the povray task provider with VS Code
    vscode.tasks.registerTaskProvider(taskType, povrayTaskProvider);
}
function registerCommands(context) {
    const renderCommand = 'povray.render';
    // Create a command handler for 
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
//# sourceMappingURL=extension.js.map