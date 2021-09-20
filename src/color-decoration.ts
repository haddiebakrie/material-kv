const colorRegEx = /\[\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*\]/g;
const hexColorRegEx = /get_color_from_hex\(((?:"|').*(?:"|'))\)/g;
import * as vscode from 'vscode';
import { convertToRGBA } from './kivy-to-rgba';
import { rgbaToHex } from './rgba-to-hex';


const colorDecorationType = vscode.window.createTextEditorDecorationType({
});


export function addColorBox() {
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
                
                currentEditor.setDecorations(colorDecorationType, colorDecoration);
            }
        }
    }
    while (match = hexColorRegEx.exec(allText)) {
        const startPos = currentEditor.document.positionAt(match.index);
        const endPos = currentEditor.document.positionAt(match.index + match[0].length);
        const colorLineNumber = startPos.line;
        const colorLineTextRaw = currentEditor.document.lineAt(colorLineNumber).text.replace(/\s/g, "");
        const colorValue = match[1].replace(/('|")/g, "");
        console.log(__dirname + "/../icons/md-icons/ab-testing.svg");
        if (colorValue) {
            const decorator = {
                range: new vscode.Range(startPos, endPos), 
                renderOptions: {
                    dark: {
                        before: {
                            contentText: "\u25FC",
                            color: "#" + colorValue,
                            margin: "0 3px 0 3px",
                        },
                    },
                },
                hoverMessage: colorValue

            };
            colorDecoration.push(decorator);
            
            currentEditor.setDecorations(colorDecorationType, colorDecoration);
        }
    
    
    }
}
