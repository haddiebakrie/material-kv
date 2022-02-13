import * as vscode from 'vscode';
import { getTabLength, getWidgetRuleAndChildren, isKivyWidget } from './check-declaration';
import { getKivyRegion, isKivyLang } from './mark-embed-kv';
import { writeToCurrentFile, writeToFile } from './write-to-file';

export class RefactorKivyWidget implements vscode.CodeActionProvider {

	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
		if (!this.isAWidget(document, range)) {
			return;
		}

		// Marking a single fix as `preferred` means that users can apply it with a
		// single keyboard shortcut using the `Auto Fix` command.
		
		const newFileAction = this.extractNewFile();
		const currentFileAction = this.extractCurrent();
		currentFileAction.isPreferred = true;

		return [
			currentFileAction,
            newFileAction
		];
	}

	private isAWidget(document: vscode.TextDocument, range: vscode.Range) {
		const start = range.start;
		const line = document.lineAt(start.line);
		const text = line.text;
		const rawLineText = text.trim();
		const firstChar = rawLineText[0];
		const firstCharUpper = firstChar.toUpperCase();

		let rule : string[] | undefined;

		// Check if widget has rules or children.
		if (rawLineText.endsWith(":") && firstChar !== "<" && firstChar===firstCharUpper && (isKivyLang(document, line.lineNumber) || document.languageId==="kv")) {
			rule = getWidgetRuleAndChildren(document, text, line.lineNumber);
			console.log(getKivyRegion(document));
		}

		if (!rule){
			return;
		}

        console.log(rule.length);

		return rule.length >= 1;
	}

	private extractNewFile() : vscode.CodeAction {
		const action = new vscode.CodeAction('Extract to New File (advance)', vscode.CodeActionKind.RefactorExtract);
		action.command = {command: "material-kv.extract-to-advance", "title":"Extract Selected widget to a New File, this file will be created in a uix folder."};
		return action;
	};

    private extractCurrent() : vscode.CodeAction {
		const action = new vscode.CodeAction('Extract to Current File', vscode.CodeActionKind.RefactorExtract);
		action.command = {command: "material-kv.extract-to-current", "title":"Extract Selected widget to Current File."};
		return action;
	}
}

export const extractToAdvance = vscode.commands.registerCommand('material-kv.extract-to-advance', function () {
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
        return;
    }
    const currentLine = currentEditor.selection.active.line;
    const currentLineText = currentEditor.document.lineAt(currentLine).text;
    const widgetRule = getWidgetRuleAndChildren(currentEditor.document, currentLineText, currentLine);
    if (!widgetRule) {
        return;
    }
    let startLine = currentEditor.document.lineAt(currentLine).lineNumber;
    let startPos = new vscode.Position(startLine, 0);

    let endLine = currentEditor.document.lineAt(currentLine+widgetRule.length).lineNumber;
    let endChar = currentEditor.document.lineAt(currentLine+widgetRule.length).range.end.character;
    let endPos = new vscode.Position(endLine, endChar);

    let range = new vscode.Range(startPos, endPos);
    let widgetDec = currentEditor.document.getText(range);

    let rootTabLen = getTabLength(currentLineText);

    const widgetDecList = widgetDec.split("\n");

    let widgetName = vscode.window.showInputBox({
        prompt: "Enter a name for the widget",
        validateInput: (s) => isKivyWidget(s+":") ? undefined : "Enter a valid widget name",
        value: "NewWidget",
    }).then(
        (e) => writeToFile(currentEditor, range, e+":", widgetDecList, rootTabLen)
        );
    if (!widgetName) {
        return;
    };
}
);


export const extractTocurrent = vscode.commands.registerCommand('material-kv.extract-to-current', function () {
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
        return;
    }

    const currentLine = currentEditor.selection.active.line;
    const currentLineText = currentEditor.document.lineAt(currentLine).text;
    const widgetRule = getWidgetRuleAndChildren(currentEditor.document, currentLineText, currentLine);
    if (!widgetRule) {
        return;
    }
    let startLine = currentEditor.document.lineAt(currentLine).lineNumber;
    let startPos = new vscode.Position(startLine, 0);

    let endLine = currentEditor.document.lineAt(currentLine+widgetRule.length).lineNumber;
    let endChar = currentEditor.document.lineAt(currentLine+widgetRule.length).range.end.character;
    let endPos = new vscode.Position(endLine, endChar);

    let range = new vscode.Range(startPos, endPos);
    let widgetDec = currentEditor.document.getText(range);

    let rootTabLen = getTabLength(currentLineText);

    const widgetDecList = widgetDec.split("\n");

    let widgetName = vscode.window.showInputBox({
        prompt: "Enter a name for the widget",
        validateInput: (s) => isKivyWidget(s+":") ? undefined : "Enter a valid widget name",
        value: "NewWidget",
    }).then(
        (e) => writeToCurrentFile(currentEditor, range, e+":", widgetDecList, rootTabLen)
    );
    if (!widgetName) {
        return;
    };
}
);
