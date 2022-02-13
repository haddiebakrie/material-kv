import * as vscode from 'vscode';
import { getIcon } from './mdicons';

let iconList = getIcon();	


export const mdIconProvider = vscode.languages.registerCompletionItemProvider(
    'kv',
    {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.endsWith('icon:"') && (!linePrefix.endsWith('icon:\'')) &&
                (!linePrefix.endsWith('icon: "')) && (!linePrefix.endsWith('icon: \''))
            ) {
                return undefined;
            }
            
            const completionList = [];

            for (let i=0; i<iconList.length; i++){
                const label = iconList[i];
                if (!label) {
                    continue;
                }
                const cl = new vscode.CompletionItem(label, vscode.CompletionItemKind.Variable);
                completionList.push(cl);
            }
            return completionList;
        }
    },
    "\"", "\'"
);
