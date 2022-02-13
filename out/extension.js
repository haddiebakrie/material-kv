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
const mdicon_completion_provider_1 = require("./mdicon-completion-provider");
const refactor_1 = require("./refactor");
// this method is called when your extension is activated
function activate(context) {
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider(['kv', 'python'], new refactor_1.RefactorKivyWidget(), {}));
    console.log('Congratulations, your extension "material-kv" is now active!');
    let timeout = undefined;
    let currentEditor = vscode.window.activeTextEditor;
    let wsFolder = vscode.workspace.workspaceFolders;
    let sbi = vscode.window.createStatusBarItem();
    sbi.text = "Run Main.py";
    sbi.command = "material-kv.run-task";
    sbi.show();
    const runTask = vscode.commands.registerCommand('material-kv.run-task', function () {
        if (wsFolder) {
            // debugSession: interface vscode
            // vscode.debug.startDebugging(wsFolder[0], "Launch Program");
            let mkvConfig = vscode.workspace.getConfiguration("materialkv", null);
            mkvConfig.update("pthonPath", "python", vscode.ConfigurationTarget.Global);
            let a = vscode.workspace.getConfiguration('materialkv', null);
            a.update('pythonFile', "main.py");
            vscode.commands.executeCommand('workbench.action.debug.run');
        }
    });
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
    context.subscriptions.push(mdicon_completion_provider_1.mdIconProvider);
    context.subscriptions.push(refactor_1.extractToAdvance);
    context.subscriptions.push(refactor_1.extractTocurrent);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map