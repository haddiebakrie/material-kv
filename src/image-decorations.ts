import { readFile, readv } from 'fs';
import * as vscode from 'vscode';
const imageRegEx = /((?:"|').*(?:"|'))/g;


const imageDecorationType = vscode.window.createTextEditorDecorationType({

});


export function showImagePreview() {
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
        return;
    }

    const allText = currentEditor.document.getText();
         
    const imageDecoration: vscode.DecorationOptions[] = [];
    let match;
    while (match = imageRegEx.exec(allText)) {
        const startPos = currentEditor.document.positionAt(match.index);
        const endPos = currentEditor.document.positionAt(match.index + match[0].length);
        const colorLineNumber = startPos.line;
        const colorLineTextRaw = currentEditor.document.lineAt(colorLineNumber).text.replace(/\s/g, "");
        const image = currentEditor.document.getText(new vscode.Range(startPos, endPos)).replace(/('|")/g, "");
        if (colorLineTextRaw.startsWith("source:") || colorLineTextRaw.startsWith("image:")){
            const imagePath = vscode.workspace.getWorkspaceFolder(currentEditor.document.uri)?.uri.path + "/" + image;
            const imageMarkdown = new vscode.MarkdownString(
                [`**Image**`,
                '',
                `&nbsp;`,
                `![](${imagePath}|"height=80,width=80")`
            ].join('\n')
                
                );
            const decorator = {
                range: new vscode.Range(startPos, endPos), 
                renderOptions: {
                    dark: {
                        before: {
                            contentIconPath: vscode.Uri.file(__dirname + "/../icons/md-icons/image.svg"),
                            backgroundColor: "#ffffff",
                            height: "12px",
                            width: "12px",
                        },
                    },
                },
                hoverMessage: imageMarkdown
            };
            imageDecoration.push(decorator);
        }
    }
    currentEditor.setDecorations(imageDecorationType, imageDecoration);

    
}
