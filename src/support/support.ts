import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from "path";
import { ShellContext } from '../extension'

// Class for stateless methods, cleans up/simplifies extension.ts
export default class Support {
    constructor() { }

    // Helper function to get the POV-Ray related settings
    public static getPOVSettings() {
        const configuration = vscode.workspace.getConfiguration('povray');
        let settings = {
            outputPath:                         (<string>configuration.get("render.outputPath")).trim(),
            outputFormat:                       (<string>configuration.get("render.outputImageFormat")),
            pvenginePath:                       (<string>configuration.get("render.pvenginePath")).trim(),
            win32Terminal:                      <string>configuration.get("render.win32Terminal"),
            defaultRenderWidth:                 <string>configuration.get("render.defaultWidth"),
            defaultRenderHeight:                <string>configuration.get("render.defaultHeight"),
            libraryPath:                        (<string>configuration.get("render.libraryPath")).trim(),
            customCommandlineOptions:           configuration.get("render.customCommandlineOptions"),
            displayImageDuringRender:           configuration.get("render.displayImageDuringRender"),
            openImageAfterRender:               configuration.get("render.openImageAfterRender"),
            openImageAfterRenderInNewColumn:    configuration.get("render.openImageAfterRenderInNewColumn"),
            quotingChar:                        "\"",
        };
    
        if (settings.win32Terminal == "Powershell (vscode default)") { settings.quotingChar = "'"; }
        //vscode.window.showWarningMessage("POV-Ray: the Output Path (povray.outputPath) setting has been deprecated.\nPlease use Render > Output Path (povray.render.outputPath) instead.");
    
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
    
    // For unit testing to work cross platform, we need to be able
    // to normalize paths for a specified shell context (os, shell)
    // regardless of the OS we are actually running on.
    public static normalizePath(filepath: string, context: ShellContext) {
        if (context.platform === "win32") {
            filepath = path.win32.normalize(filepath);
        } else {
            filepath = path.posix.normalize(filepath);
        }

        return filepath;
    }

    public static wrapPathSpaces(filepath: string, settings: any) {
        if (filepath.indexOf(" ") !== -1) {
            filepath = settings.quotingChar + filepath + settings.quotingChar;
        }
        return filepath;
    }

    // Creates the directory for the specified path if it doesn't already exist
    public static createDirIfMissing(filePath: string, context: ShellContext) {

        let outDir = Support.normalizePath(Support.getDirName(filePath, context), context);

        if (!fs.existsSync(outDir)) {

            fs.mkdirSync(outDir);
        }
    }

    // For unit testing to work cross platform, we need to be able
    // to get the directory name for a specified context (os, shell)
    // regardless of the OS we are actually running on.
    public static getDirName(filepath: string, context: ShellContext) {
        let dirname = filepath;
        if (context.platform === "win32") {
            dirname = path.win32.dirname(filepath);
        } else {
            dirname = path.posix.dirname(filepath);
        }

        return dirname;
    }
}