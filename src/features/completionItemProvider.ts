import * as vscode from 'vscode';
import * as fs from 'fs';
import { getPOVSettings } from '../extension';
import { EOL } from 'os';

export default class GlobalCompletionItemProvider implements vscode.CompletionItemProvider {
    protected _colors: vscode.CompletionItem[];

    constructor() {
        this._colors = [];
        this.loadDefaultColors();
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        if (!linePrefix.endsWith('color ') || this._colors.length == 0) {
            return undefined;
        }

        return this._colors;
    }

    loadDefaultColors() {
        let settings = getPOVSettings();

        if (settings.libraryPath.length > 0 && fs.existsSync(settings.libraryPath+'/colors.inc')) {
            const content = fs.readFileSync(settings.libraryPath+'/colors.inc', 'utf8');
            let lines = content.split(EOL);
            lines.forEach((value) => {
                let pieces = value.split(' ');
                for (let i = 0; i<pieces.length; i++) {
                    if (pieces[i] == '#declare' && (i+1) < pieces.length) {
                        this._colors.push(new vscode.CompletionItem(pieces[i+1], vscode.CompletionItemKind.Constant));
                    }
                }
            });
        }
    }
}