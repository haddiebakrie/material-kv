"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showImagePreview = void 0;
const vscode = require("vscode");
const imageRegEx = /((?:"|').*(?:"|'))/g;
const imageDecorationType = vscode.window.createTextEditorDecorationType({});
function showImagePreview() {
    var _a;
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
        return;
    }
    const allText = currentEditor.document.getText();
    const imageDecoration = [];
    let match;
    while (match = imageRegEx.exec(allText)) {
        const startPos = currentEditor.document.positionAt(match.index);
        const endPos = currentEditor.document.positionAt(match.index + match[0].length);
        const colorLineNumber = startPos.line;
        const colorLineTextRaw = currentEditor.document.lineAt(colorLineNumber).text.replace(/\s/g, "");
        const image = currentEditor.document.getText(new vscode.Range(startPos, endPos)).replace(/('|")/g, "");
        if (colorLineTextRaw.startsWith("source:") || colorLineTextRaw.startsWith("image:")) {
            const imagePath = ((_a = vscode.workspace.getWorkspaceFolder(currentEditor.document.uri)) === null || _a === void 0 ? void 0 : _a.uri.path) + "/" + image;
            const imageMarkdown = new vscode.MarkdownString([`**Image**`,
                '',
                `&nbsp;`,
                `![](${imagePath}|"height=80,width=80")`
            ].join('\n'));
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
exports.showImagePreview = showImagePreview;
//# sourceMappingURL=image-decorations.js.map