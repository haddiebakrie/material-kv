// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { clearTimeout } from 'timers';
import * as vscode from 'vscode';
import { addColorBox } from './color-decoration';
import { showIconPreview } from './icon-decoration';
import { showImagePreview } from './image-decorations';
import { mdIconProvider } from './mdicon-completion-provider';
import {extractToAdvance, extractTocurrent, RefactorKivyWidget} from './refactor';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(['kv', 'python'], new RefactorKivyWidget(), {
		}));
	console.log('Congratulations, your extension "material-kv" is now active!');
	let timeout: NodeJS.Timer | undefined = undefined;
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
			vscode.commands.executeCommand('workbench.action.debug.rmmmmmmmun');			

		}
	});

		
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(addColorBox, 500);
		timeout = setTimeout(showIconPreview, 500);
		timeout = setTimeout(showImagePreview, 500);
	}

	if (currentEditor){
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
	
	context.subscriptions.push(mdIconProvider);
	context.subscriptions.push(extractToAdvance);
	context.subscriptions.push(extractTocurrent);
}

export function deactivate() {}

