
import * as vscode from 'vscode';


export function isKivyWidget(lineText: string) {
    const rawLineText = lineText.trim();
    const firstChar = rawLineText[0];
    const firstCharUpper = firstChar.toUpperCase();
    if (!rawLineText.endsWith(':') || !(firstChar===firstCharUpper)){
        vscode.window.showInformationMessage('The current selection is not a Widget, Make sure your Wiget is in Camel case e.g \'MyWidget\'.');
        return false;
    }
    // const widgetName = selection;
    return true;
}

export function getWidgetRuleAndChildren(document: vscode.TextDocument, lineText: string, lineNumber: number){
    if (!document) {
        return;
    }

    if (!isKivyWidget(lineText)){
        return;
    }

    const tabLength = getTabLength(lineText);

    const widgetRule = [];
    for (let i=lineNumber+1; i<document.lineCount; i++){
        const currentLineText = document.lineAt(i).text;
        const currentTabLength = getTabLength(currentLineText);
        if (currentLineText.trim()==="") {
            continue;
        }
        if (tabLength>=currentTabLength){
            break;
        } else {
            widgetRule.push(currentLineText);
        }
    }

    console.log(widgetRule, lineNumber);

    return widgetRule;
}

export function getTabLength(text: string) {
    const rawLineText = text.trim();
    const tabLength = text.length - rawLineText.length;

    return tabLength;
}