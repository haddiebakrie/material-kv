// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { clearTimeout } from 'timers';
import * as vscode from 'vscode';
import { addColorBox } from './color-decoration';
import { showIconPreview } from './icon-decoration';
import { showImagePreview } from './image-decorations';
import { getIcon } from './mdicons';
import {isKivyWidget} from './check-declaration';
import { getWidgetRuleAndChildren } from './check-declaration';

let iconList = getIcon();	

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "material-kv" is now active!');
	let timeout: NodeJS.Timer | undefined = undefined;
	let currentEditor = vscode.window.activeTextEditor;

	const extractToCurrent = vscode.commands.registerCommand('material-kv.extract-to-current', function () {
		if (!currentEditor) {
			return;
		}
		const currentLine = currentEditor.selection.active.line;
		const currentSelection = currentEditor.document.getText(
			new vscode.Range(
				currentEditor.selection.start,
				currentEditor.selection.end
			)
		);
		const currentLineText = currentEditor.document.lineAt(currentLine).text;
		console.log(getWidgetRuleAndChildren(currentLineText, currentLine));
		const widgetRule = getWidgetRuleAndChildren(currentLineText, currentLine);
		if (!widgetRule) {
			return;
		}
		let widgetEndNum = Number(widgetRule[1]);

		let range = new vscode.Range(currentEditor.document.positionAt(currentLine), currentEditor.document.positionAt(widgetEndNum));
		const select =new vscode.Selection(currentEditor.document.positionAt(currentLine), currentEditor.document.positionAt(widgetEndNum));
		
		currentEditor.edit((editBuilder: vscode.TextEditorEdit) => {
			editBuilder.replace(select, 'reversed');
		});
	});
	const provider2 = vscode.languages.registerCompletionItemProvider(
		'kv',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('icon:"') && (!linePrefix.endsWith('icon:\'')) &&
					(!linePrefix.endsWith('icon: "')) && (!linePrefix.endsWith('icon: \''))
				) {
					return undefined;
				}
				
				const completionList = [];

				for (let i=0; i<iconList.length; i++){
					const label = iconList[i];
					if (!label) {
						continue;
					}
					const cl = new vscode.CompletionItem(label, vscode.CompletionItemKind.Variable);
					completionList.push(cl);
				}
				return completionList;
			}
		},
		"\"", "\'"
	);

	context.subscriptions.push(provider2);

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

		context.subscriptions.push(extractToCurrent);
}

export function deactivate() {}
