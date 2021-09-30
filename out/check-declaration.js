"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWidgetRuleAndChildren = exports.isKivyWidget = void 0;
const vscode = require("vscode");
const currentEditor = vscode.window.activeTextEditor;
function isKivyWidget(lineText, selection) {
    const rawLineText = lineText.trim();
    const firstChar = rawLineText[0];
    const firstCharUpper = firstChar.toUpperCase();
    if (!rawLineText.endsWith(':') || !(firstChar === firstCharUpper)) {
        vscode.window.showErrorMessage('The current selection is not a Widget, Make sure your Wiget is in Camel case e.g \'MyWidget\'.');
        return false;
    }
    // const widgetName = selection;
    return true;
}
exports.isKivyWidget = isKivyWidget;
function getWidgetRuleAndChildren(lineText, lineNumber) {
    if (!currentEditor) {
        return;
    }
    const tabLength = getTabLength(lineText);
    const widgetRule = [];
    let widgetRuleLastLine = lineNumber;
    for (let i = lineNumber + 1; i < currentEditor.document.lineCount; i++) {
        const currentLineText = currentEditor.document.lineAt(i).text;
        const currentTabLength = getTabLength(currentLineText);
        console.log(currentTabLength);
        if (tabLength >= currentTabLength) {
            console.log(currentLineText);
            break;
        }
        else {
            widgetRuleLastLine++;
            widgetRule.push(currentLineText);
        }
    }
    console.log(tabLength);
    return [widgetRule, currentEditor.document.lineAt(widgetRuleLastLine).lineNumber];
}
exports.getWidgetRuleAndChildren = getWidgetRuleAndChildren;
function getTabLength(text) {
    const rawLineText = text.trim();
    const tabLength = text.length - rawLineText.length;
    return tabLength;
}
//# sourceMappingURL=check-declaration.js.map