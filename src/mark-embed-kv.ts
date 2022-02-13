import { match } from 'assert';
import * as vscode from 'vscode';

const kivyEmbedRegEx = /w*(Builder\.load_string\((\w*("""|'''))|KV\s*=\s*(\w*("""|''')))[^]*(w*("""|'''))(\))?/g;

export function getKivyRegion(document: vscode.TextDocument) {

    const text = document.getText();
    let match;

    let lineRange = {'start':0, 'end':0};

    if (document.languageId==="kv") {
        lineRange = {'start':0, 'end':document.lineCount};
    } else {
        while (match = kivyEmbedRegEx.exec(text)) {
    
            let startLine = document.positionAt(match.index).line;
            let endLine = document.positionAt(match.index + match[0].length).line;
    
            lineRange["start"] = startLine;
            lineRange["end"] = endLine;
            console.log(lineRange);
        }
    }


    return lineRange;

}

export function isKivyLang(document: vscode.TextDocument, line: number) {

    let lineRange = getKivyRegion(document);
    
    return line >= lineRange.start && line <= lineRange.end;


}