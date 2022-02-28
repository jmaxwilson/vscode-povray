"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const extension_1 = require("../extension");
const os_1 = require("os");
class GlobalCompletionItemProvider {
    constructor() {
        this._colors = [];
        this.loadDefaultColors();
    }
    provideCompletionItems(document, position) {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        if (!linePrefix.endsWith('color ') || this._colors.length == 0) {
            return undefined;
        }
        return this._colors;
    }
    loadDefaultColors() {
        let settings = extension_1.getPOVSettings();
        if (settings.libraryPath.length > 0 && fs.existsSync(settings.libraryPath + '/colors.inc')) {
            const content = fs.readFileSync(settings.libraryPath + '/colors.inc', 'utf8');
            let lines = content.split(os_1.EOL);
            lines.forEach((value) => {
                let pieces = value.split(' ');
                for (let i = 0; i < pieces.length; i++) {
                    if (pieces[i] == '#declare' && (i + 1) < pieces.length) {
                        this._colors.push(new vscode.CompletionItem(pieces[i + 1], vscode.CompletionItemKind.Constant));
                    }
                }
            });
        }
    }
}
exports.default = GlobalCompletionItemProvider;
//# sourceMappingURL=completionItemProvider.js.map