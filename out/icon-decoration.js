"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showIconPreview = void 0;
const vscode = require("vscode");
const iconRegEx = /((?:"|').*(?:"|'))/g;
const mdicons_1 = require("./mdicons");
const iconDecorationType = vscode.window.createTextEditorDecorationType({});
let iconList = (0, mdicons_1.getIcon)();
function showIconPreview() {
    const currentEditor = vscode.window.activeTextEditor;
    const allText = currentEditor === null || currentEditor === void 0 ? void 0 : currentEditor.document.getText();
    if (!currentEditor) {
        return;
    }
    if (!allText) {
        return;
    }
    const iconDecoration = [];
    let match;
    while (match = iconRegEx.exec(allText)) {
        const startPos = currentEditor.document.positionAt(match.index);
        const endPos = currentEditor.document.positionAt(match.index + match[0].length);
        const colorLineNumber = startPos.line;
        const colorLineTextRaw = currentEditor.document.lineAt(colorLineNumber).text.replace(/\s/g, "");
        const icon = currentEditor.document.getText(new vscode.Range(startPos, endPos)).replace(/('|")/g, "");
        if (colorLineTextRaw.startsWith("icon:")) {
            if (!iconList.includes(icon)) {
                continue;
            }
            let iconPath = vscode.Uri.file(__dirname + "/../icons/md-icons/" + icon + ".svg");
            const iconMarkdown = new vscode.MarkdownString([`**MDIcon** `,
                '',
                `&nbsp;`,
                `![](${iconPath.path}|"height=50,width=50")`,
                ``
            ].join('\n'));
            const decorator = {
                range: new vscode.Range(startPos, endPos),
                renderOptions: {
                    dark: {
                        before: {
                            contentIconPath: iconPath,
                            backgroundColor: "#ffffff",
                            height: "14px",
                            width: "12px",
                        },
                        gutterIconPath: iconPath,
                    },
                },
                hoverMessage: iconMarkdown
            };
            iconDecoration.push(decorator);
        }
    }
    currentEditor.setDecorations(iconDecorationType, iconDecoration);
}
exports.showIconPreview = showIconPreview;
;
//# sourceMappingURL=icon-decoration.js.map