import * as vscode from 'vscode';
const iconRegEx = /((?:"|').*(?:"|'))/g;
import { getIcon } from './mdicons';

const iconDecorationType = vscode.window.createTextEditorDecorationType({
});

let iconList = getIcon();	

export function showIconPreview() {
    const currentEditor = vscode.window.activeTextEditor;
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
        const icon = currentEditor.document.getText(new vscode.Range(startPos, endPos)).replace(/('|")/g, "");
        if (colorLineTextRaw.startsWith("icon:")){
            if (!iconList.includes(icon)){
                continue;
            }
            let iconPath = vscode.Uri.file(__dirname + "/../icons/md-icons/" + icon +  ".svg");
            const iconMarkdown = new vscode.MarkdownString(
                [`**MDIcon** `,
                '',
                `&nbsp;`,
                `![](${iconPath.path}|"height=50,width=50")`,
                ``
            ].join('\n')
                
                );
            const decorator = {
                range: new vscode.Range(startPos, endPos), 
                renderOptions: {
                    dark: {
                        before: {
                            contentIconPath: iconPath,
                            backgroundColor: "#ffffff",
                            margin: "2px 3px 0 3px",
                            height: "18px",
                            width: "18px",
                            borderRadius: "4px",
                        },
                    },
                },
                hoverMessage: iconMarkdown
            };
            iconDecoration.push(decorator);
        }
    }
    currentEditor.setDecorations(iconDecorationType, iconDecoration);
    
    
    
};