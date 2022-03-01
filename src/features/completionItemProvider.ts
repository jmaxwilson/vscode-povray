import * as vscode from 'vscode';
import * as fs from 'fs';
import { getPOVSettings } from '../extension';
import { EOL } from 'os';

export default class GlobalCompletionItemProvider implements vscode.CompletionItemProvider {
    protected _colors: vscode.CompletionItem[];
    protected _finishes: vscode.CompletionItem[];
    protected _textures: vscode.CompletionItem[];
    protected _pigments: vscode.CompletionItem[];
    protected _interiors: vscode.CompletionItem[];
    protected _color_maps: vscode.CompletionItem[];

    constructor() {
        this._colors = [];
        this._finishes = [];
        this._textures = [];
        this._pigments = [];
        this._interiors = [];
        this._color_maps = [];

        this.loadLibrary();
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        //if (!linePrefix.endsWith('color ') && !linePrefix.endsWith('finish ') && !linePrefix.endsWith('texture ') && !linePrefix.endsWith('interior ')) {
        //    return undefined;
        //}

        //return this._colors;

        if (linePrefix.endsWith('color ')) { return this._colors; }
        else if (linePrefix.endsWith('finish ')) { return this._finishes; }
        else if (linePrefix.endsWith('texture ')) { return this._textures; }
        else if (linePrefix.endsWith('interior ')) { return this._interiors; }
        else if (linePrefix.endsWith('color_map ')) { return this._color_maps; }
        else if (linePrefix.endsWith('pigment ')) { return this._pigments; }
        
        return undefined;
    }

    loadLibrary() {
        let settings = getPOVSettings();
        if (settings.libraryPath.length > 0) {
            // JAC: Not ready to load all INC files yet, start with targeted ones
            if (fs.existsSync(settings.libraryPath+'/colors.inc')) { this.loadFile(settings.libraryPath+'/colors.inc'); }
            if (fs.existsSync(settings.libraryPath+'/finish.inc')) { this.loadFile(settings.libraryPath+'/finish.inc'); }
            if (fs.existsSync(settings.libraryPath+'/metals.inc')) { this.loadFile(settings.libraryPath+'/metals.inc'); }
            if (fs.existsSync(settings.libraryPath+'/glass.inc')) { this.loadFile(settings.libraryPath+'/glass.inc'); }
            if (fs.existsSync(settings.libraryPath+'/golds.inc')) { this.loadFile(settings.libraryPath+'/golds.inc'); }
            if (fs.existsSync(settings.libraryPath+'/stones1.inc')) { this.loadFile(settings.libraryPath+'/stones1.inc'); }
            if (fs.existsSync(settings.libraryPath+'/stones2.inc')) { this.loadFile(settings.libraryPath+'/stones2.inc'); }
            if (fs.existsSync(settings.libraryPath+'/stars.inc')) { this.loadFile(settings.libraryPath+'/stars.inc'); }
            if (fs.existsSync(settings.libraryPath+'/textures.inc')) { this.loadFile(settings.libraryPath+'/textures.inc'); }
            if (fs.existsSync(settings.libraryPath+'/woods.inc')) { this.loadFile(settings.libraryPath+'/woods.inc'); }
            if (fs.existsSync(settings.libraryPath+'/woodmaps.inc')) { this.loadFile(settings.libraryPath+'/woodmaps.inc'); }
        }
    }

    loadFile(fileName: string) {
        const content = fs.readFileSync(fileName, 'utf8');
        let pieces = content.replace(/\r?\n|\r/g, " ").split(/\s+/);
        for (let i = 0; i<pieces.length; i++) {
            if (pieces[i] == '#declare' && (i+3) < pieces.length) {
                switch (pieces[i+3])
                {
                    case 'color':
                    case 'rgb':
                    case 'rgbf':
                        this._colors.push(new vscode.CompletionItem(pieces[i+1], vscode.CompletionItemKind.Constant));
                        break;
                    case 'finish':
                        this._finishes.push(new vscode.CompletionItem(pieces[i+1], vscode.CompletionItemKind.Constant));
                        break;
                    case 'texture':
                        this._textures.push(new vscode.CompletionItem(pieces[i+1], vscode.CompletionItemKind.Constant));
                        break;
                    case 'interior':
                        this._interiors.push(new vscode.CompletionItem(pieces[i+1], vscode.CompletionItemKind.Constant));
                        break;
                    case 'color_map':
                        this._color_maps.push(new vscode.CompletionItem(pieces[i+1], vscode.CompletionItemKind.Constant));
                        break;
                    case 'pigment':
                        this._pigments.push(new vscode.CompletionItem(pieces[i+1], vscode.CompletionItemKind.Constant));
                        break;
                }
                i += 3;
            }
        }
    }
}