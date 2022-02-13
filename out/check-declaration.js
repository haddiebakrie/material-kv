"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTabLength = exports.getWidgetRuleAndChildren = exports.isKivyWidget = void 0;
const vscode = require("vscode");
function isKivyWidget(lineText) {
    const rawLineText = lineText.trim();
    const firstChar = rawLineText[0];
    const firstCharUpper = firstChar.toUpperCase();
    if (!rawLineText.endsWith(':') || !(firstChar === firstCharUpper)) {
        vscode.window.showInformationMessage('The current selection is not a Widget, Make sure your Wiget is in Camel case e.g \'MyWidget\'.');
        return false;
    }
    // const widgetName = selection;
    return true;
}
exports.isKivyWidget = isKivyWidget;
function getWidgetRuleAndChildren(document, lineText, lineNumber) {
    if (!document) {
        return;
    }
    if (!isKivyWidget(lineText)) {
        return;
    }
    const tabLength = getTabLength(lineText);
    const widgetRule = [];
    for (let i = lineNumber + 1; i < document.lineCount; i++) {
        const currentLineText = document.lineAt(i).text;
        const currentTabLength = getTabLength(currentLineText);
        if (currentLineText.trim() === "") {
            widgetRule.push(currentLineText);
            continue
        }
        if (tabLength >= currentTabLength) {
            break;
        }
        else {
            widgetRule.push(currentLineText);
        }
    }
    return widgetRule;
}
exports.getWidgetRuleAndChildren = getWidgetRuleAndChildren;
function getTabLength(text) {
    const rawLineText = text.trim();
    const tabLength = text.length - rawLineText.length;
    return tabLength;
}
exports.getTabLength = getTabLength;
//# sourceMappingURL=check-declaration.js.map