"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const timers_1 = require("timers");
const vscode = require("vscode");
const color_decoration_1 = require("./color-decoration");
const icon_decoration_1 = require("./icon-decoration");
const image_decorations_1 = require("./image-decorations");
const mdicons_1 = require("./mdicons");
const check_declaration_1 = require("./check-declaration");
let iconList = (0, mdicons_1.getIcon)();
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Congratulations, your extension "material-kv" is now active!');
    let timeout = undefined;
    let currentEditor = vscode.window.activeTextEditor;
    const extractToCurrent = vscode.commands.registerCommand('material-kv.extract-to-current', function () {
        if (!currentEditor) {
            return;
        }
        const currentLine = currentEditor.selection.active.line;
        const currentSelection = currentEditor.document.getText(new vscode.Range(currentEditor.selection.start, currentEditor.selection.end));
        const currentLineText = currentEditor.document.lineAt(currentLine).text;
        console.log((0, check_declaration_1.getWidgetRuleAndChildren)(currentLineText, currentLine));
        const widgetRule = (0, check_declaration_1.getWidgetRuleAndChildren)(currentLineText, currentLine);
        if (!widgetRule) {
            return;
        }
        let widgetEndNum = Number(widgetRule[1]);
        let range = new vscode.Range(currentEditor.document.positionAt(currentLine), currentEditor.document.positionAt(widgetEndNum));
        const select = new vscode.Selection(currentEditor.document.positionAt(currentLine), currentEditor.document.positionAt(widgetEndNum));
        currentEditor.edit((editBuilder) => {
            editBuilder.replace(select, 'reversed');
        });
    });
    const provider2 = vscode.languages.registerCompletionItemProvider('kv', {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.endsWith('icon:"') && (!linePrefix.endsWith('icon:\'')) &&
                (!linePrefix.endsWith('icon: "')) && (!linePrefix.endsWith('icon: \''))) {
                return undefined;
            }
            const completionList = [];
            for (let i = 0; i < iconList.length; i++) {
                const label = iconList[i];
                if (!label) {
                    continue;
                }
                const cl = new vscode.CompletionItem(label, vscode.CompletionItemKind.Variable);
                completionList.push(cl);
            }
            return completionList;
        }
    }, "\"", "\'");
    context.subscriptions.push(provider2);
    function triggerUpdateDecorations() {
        if (timeout) {
            (0, timers_1.clearTimeout)(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(color_decoration_1.addColorBox, 500);
        timeout = setTimeout(icon_decoration_1.showIconPreview, 500);
        timeout = setTimeout(image_decorations_1.showImagePreview, 500);
    }
    if (currentEditor) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(editor => {
        currentEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (currentEditor && event.document === currentEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    context.subscriptions.push(extractToCurrent);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map