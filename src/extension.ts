// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { relative } from 'path';
import path = require('path');
import { clearTimeout } from 'timers';
import { pathToFileURL } from 'url';
import * as vscode from 'vscode';

// variables declarations
const colorRegEx = /\[\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*\]/g;
const hexColorRegEx = /get_color_from_hex\(((?:"|').*(?:"|'))\)/g;
const iconRegEx = /((?:"|').*(?:"|'))/g;

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
		const colorDecorationType = vscode.window.createTextEditorDecorationType({
			// after: {
			// 	contentIconPath: __dirname + "/../icons/md-icons/abacus.svg",
				
			// },
			// gutterIconPath: __dirname + "/../icons/md-icons/abacus.svg",
		});
		
		const iconDecorationType = vscode.window.createTextEditorDecorationType({
			after: {
				// contentIconPath: __dirname + "/../icons/md-icons/abacus.svg",
				
			},
		});
        function addColorBox() {
			let currentEditor = vscode.window.activeTextEditor;
			const allText = currentEditor?.document.getText();
            if (!currentEditor) {
                return;
            }
			if (!allText){
				return;
			}
            const colorDecoration: vscode.DecorationOptions[] = [];
			let match;
			while (match = colorRegEx.exec(allText)) {
				const startPos = currentEditor.document.positionAt(match.index);
				const endPos = currentEditor.document.positionAt(match.index + match[0].length);
				const colorLineNumber = startPos.line;
				const colorLineTextRaw = currentEditor.document.lineAt(colorLineNumber).text.replace(/\s/g, "");
				const colorId = /\[.*\]/g;
				if (colorLineTextRaw.startsWith("md_bg_color") || colorLineTextRaw.startsWith("rgba") ||
					colorLineTextRaw.startsWith("text_color" || colorLineTextRaw.startsWith("color"))
				){

					let checkBrace = colorLineTextRaw.match(/\[/g)?.length;
					if (checkBrace && checkBrace>1){
						continue;
					}
					const colorValue = colorLineTextRaw.match(colorId);
					if (colorValue) {
						const colorRGBA = convertToRGBA(colorValue);
						const rgbaColor = rgbaToHex(colorRGBA);

						const decorator = {
							range: new vscode.Range(startPos, endPos), 
							renderOptions: {
								before: {
									contentText: "\u25FC",
									borderColor: "white",
									color: rgbaColor[0],
									fontStyle: "normal",
									margin: "0 3px 0 3px",
									width: "1",
								},
								gutterIconPath: __dirname + "/../icons/md-icons/ab-testing.svg",
								gutterIconSize: "50%",
							},
						};
						colorDecoration.push(decorator);
						
					}
				} else if (colorLineTextRaw.search("get_color_from_hex")) {
					console.log(colorLineTextRaw);
				}
				currentEditor.setDecorations(colorDecorationType, colorDecoration);
			}
		}


		// Preview MDIcons
		function showIconPreview() {
			const allText = currentEditor?.document.getText();
			if (!currentEditor) {
				return;
			}
			if (!allText){
				return;
			}

            const iconDecoration: vscode.DecorationOptions[] = [];
			let match;
			while (match = iconRegEx.exec(allText)) {
				const startPos = currentEditor.document.positionAt(match.index);
				const endPos = currentEditor.document.positionAt(match.index + match[0].length);
				const colorLineNumber = startPos.line;
				const colorLineTextRaw = currentEditor.document.lineAt(colorLineNumber).text.replace(/\s/g, "");
				const icon = currentEditor.document.getText(new vscode.Range(startPos, endPos));
				if (colorLineTextRaw.startsWith("icon:")){
					console.log(icon);
					let iconDir = __dirname + "/../icons/md-icons/ab-testing.svg";
					const decorator = {
						range: new vscode.Range(startPos, endPos), 
						renderOptions: {
							dark: {
								before: {
									// contentText: "g",
									// contentIconPath: __dirname + "/../icons/m-icons/ab-testing.svg",
									contentIconPath: iconDir
								},
							},
							// color: "blue",
							// borderColor: "white",
							// borderStyle: "solid",
							// borderWidth: "2px"
							// before: {
							// 	// contentText: "Hel",
							// 	borderColor: "white",
							// 	fontStyle: "normal",
							// 	margin: "0 3px 0 3px",
							// 	width: "1",
								// },
								// gutterIconSize: "50%",
							},
					};
					iconDecoration.push(decorator);
				}
			}
			currentEditor.setDecorations(iconDecorationType, iconDecoration);

			
		}

		const document = vscode.window.activeTextEditor?.document;
		function suggestFileInDirectory() {	
			if (document) {
				let currentWorkspace = vscode.workspace.getWorkspaceFolder(document.uri)?.uri;
			}
		}
		
		function triggerUpdateDecorations() {
			if (timeout) {
				clearTimeout(timeout);
				timeout = undefined;
			}
			timeout = setTimeout(addColorBox, 500);
			// timeout = setTimeout(suggestFileInDirectory, 500);
			timeout = setTimeout(showIconPreview, 500);
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

		function convertToRGBA(colorValue: any[]) {
			const ccolor = colorValue[0];
			var colorList = JSON.parse(ccolor);
			var redValue = (colorList[0] <= 1) ? Math.round(colorList[0]*255) : 255;
			var greenValue = (colorList[1] <= 1) ? Math.round(colorList[1]*255) : 255;
			var blueValue = (colorList[2] <= 1) ? Math.round(colorList[2]*255) : 255;
			var alphaValue = (colorList[3] <= 1) ? Math.round(colorList[3]*255) : 255;

			return [redValue, greenValue, blueValue, alphaValue];			
		}
		
		function rgbaToHex(rgba: any[]) {
			var rhex = rgba[0].toString().length === 1 ? rgba[0]="0"+rgba[0] : rgba[0].toString(16);
			var ghex = rgba[1].toString().length === 1 ? rgba[1]="0"+rgba[1] : rgba[1].toString(16);
			var bhex = rgba[2].toString().length === 1 ? rgba[2]="0"+rgba[2] : rgba[2].toString(16);
			var ahex = rgba[3].toString().length === 1 ? rgba[3]="0"+rgba[3] : rgba[3].toString(16);

			var hexValue = "#" + rhex+ghex+bhex+ahex;

			return [hexValue];
		}


		let disposable = vscode.commands.registerCommand('material-kv.decoratecolor', () => {
		context.subscriptions.push(disposable);
	}
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
