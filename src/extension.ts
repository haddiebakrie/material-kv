// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { clearTimeout } from 'timers';
import * as vscode from 'vscode';
import { addColorBox } from './color-decoration';
import { showIconPreview } from './icon-decoration';
import { showImagePreview } from './image-decorations';
import { getIcon } from './mdicons';

let iconList = getIcon();	

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "material-kv" is now active!');
	let timeout: NodeJS.Timer | undefined = undefined;
	let currentEditor = vscode.window.activeTextEditor;
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// The code you place here will be executed every time your command is executed
	// Display a message box to the user
		// Preview MDIcons
		
		const provider2 = vscode.languages.registerCompletionItemProvider(
			'kv',
			{
				provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
					// get all text until the `position` and check if it reads `icon:*`
					// and if so then complete with icon names.
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
			"\"", "\'"// triggered whenever a " or ' is typed
		);

	context.subscriptions.push(provider2);

		
		// const document = vscode.window.activeTextEditor?.document;
		// function getFileInDiretory() {	
		// 	// let fileName;
		// 	let fileNameList: string[] = [];

		// 	let lineWithFocus = vscode.window.activeTextEditor?.selection.active.line;
		// 	if (!lineWithFocus || !currentEditor || !document) {
		// 		return;
		// 	}
		// 	let lineText = currentEditor?.document.lineAt(lineWithFocus).text.trim();
		// 	if (lineText && lineText.startsWith('source:')) {
		// 		let currentWorkspace = vscode.workspace.getWorkspaceFolder(document.uri)?.uri;
		// 		if (currentWorkspace) {
		// 			let image = lineText.match(iconRegEx);
		// 			if (!image) {
		// 				return;
		// 			}
		// 			let fileName = image.toString().replace(/('|")/g, "");
		// 			const currentWorkspacePath = vscode.workspace.asRelativePath(currentWorkspace);
					
		// 			readdir(path.join(currentWorkspacePath,fileName), (err, files: string[]) => {
		// 				files.forEach((file) => {
		// 					const uri = vscode.Uri.file(file).path.toString();
		// 					// if (fileNames.includes(uri)) {
		// 						// 	return;
		// 						// }
		// 						fileNameList.push(uri);
		// 					});
		// 				});
		// 			}
		// 		}
		// 		return fileNameList;
		// 	}

		// 	const provider3 = vscode.languages.registerCompletionItemProvider(
		// 		'kv',
		// 		{
		// 			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
		// 		// get all text until the `position` and check if it reads `icon:*`
		// 		// and if so then complete with icon names.

				
		// 		// if (!lineText.endsWith('source:"') && (!lineText.endsWith('source:\'')) &&
		// 		// 		(!lineText.endsWith('source: "')) && (!lineText.endsWith('source: \''))
		// 		// 	) {
		// 		// 		return undefined;
		// 		// 	}
		// 		const completionList: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> = [];
		// 		// for (let i=0; i<fileNameList.length; i++){
		// 		// 	const label = fileNames[i].replace('/', '');
		// 		// 	if (!label) {
		// 			// 		continue;
		// 			// 	}
		// 			// console.log(fileNameList.length);
		// 			// 	const cl = new vscode.CompletionItem(label, vscode.CompletionItemKind.File);
					
					
		// 			// 	completionList.push(cl);
		// 			// }
		// 			// 	console.log(completionList);
		// 			// 	console.log(cl);
		// 			// 	// console.log(completionList);
		// 			const a = getFileInDiretory();
		// 			console.log(a?.length);
		// 			return completionList;
		// 	}
		// },
		// "\\", "/"// triggered whenever a " or ' is typed
		// );
			


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

		
		
		


		let disposable = vscode.commands.registerCommand('material-kv.decoratecolor', () => {
		context.subscriptions.push(disposable);
	}
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
