"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColorBox = void 0;
const colorRegEx = /\[\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*[,]\s*(\d[.]\d*|\d)\s*\]/g;
const hexColorRegEx = /get_color_from_hex\(((?:"|').*(?:"|'))\)/g;
const vscode = require("vscode");
const kivy_to_rgba_1 = require("./kivy-to-rgba");
const rgba_to_hex_1 = require("./rgba-to-hex");
const colorDecorationType = vscode.window.createTextEditorDecorationType({});
function addColorBox() {
    var _a;
    let currentEditor = vscode.window.activeTextEditor;
    const allText = currentEditor === null || currentEditor === void 0 ? void 0 : currentEditor.document.getText();
    if (!currentEditor) {
        return;
    }
    if (!allText) {
        return;
    }
    const colorDecoration = [];
    let match;
    while ((match = colorRegEx.exec(allText))) {
        const startPos = currentEditor.document.positionAt(match.index);
        const endPos = currentEditor.document.positionAt(match.index + match[0].length);
        const colorLineNumber = startPos.line;
        const colorLineTextRaw = currentEditor.document.lineAt(colorLineNumber).text.replace(/\s/g, "");
        const colorId = /\[.*\]/g;
        if (colorLineTextRaw.startsWith("md_bg_color") || colorLineTextRaw.startsWith("rgba") ||
            colorLineTextRaw.startsWith("text_color" || colorLineTextRaw.startsWith("color"))) {
            let checkBrace = (_a = colorLineTextRaw.match(/\[/g)) === null || _a === void 0 ? void 0 : _a.length;
            if (checkBrace && checkBrace > 1) {
                continue;
            }
            const colorValue = colorLineTextRaw.match(colorId);
            if (colorValue) {
                const colorRGBA = (0, kivy_to_rgba_1.convertToRGBA)(colorValue);
                const rgbaColor = (0, rgba_to_hex_1.rgbaToHex)(colorRGBA);
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
                    },
                };
                colorDecoration.push(decorator);
            }
        }
    }
    while (match = hexColorRegEx.exec(allText)) {
        const startPos = currentEditor.document.positionAt(match.index);
        const endPos = currentEditor.document.positionAt(match.index + match[0].length);
        const colorLineNumber = startPos.line;
        const colorLineTextRaw = currentEditor.document.lineAt(colorLineNumber).text.replace(/\s/g, "");
        const colorValue = match[1].replace(/('|")/g, "");
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
        }
    }
    currentEditor.setDecorations(colorDecorationType, colorDecoration);
    currentEditor.setDecorations(colorDecorationType, colorDecoration);
}
exports.addColorBox = addColorBox;
//# sourceMappingURL=color-decoration.js.map