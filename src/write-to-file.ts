import * as vscode from 'vscode';
import { getKivyImport, getKivyMDImport } from './get-import';
import { getKivyRegion } from './mark-embed-kv';


export function writeToFile(currentEditor: vscode.TextEditor | undefined, range: vscode.Range, name: string | undefined, contentText: string[], rootTabLen: number) {
    const wsedit = new vscode.WorkspaceEdit();
    if (!vscode.workspace.workspaceFolders){
        return;
    }
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    if (!name) {
        return;
    }

    if (!contentText) {
        return;
    }

    for (let i=0; i<contentText.length; i++) {
        contentText[i] = contentText[i].slice(rootTabLen);
    }

    
    console.log(contentText);
    let newcontentText = createWidgetTemp(contentText, name);

    const fileName = name.toLowerCase().replace(":", "");
    const filePath = vscode.Uri.file(wsPath + '/uix/' + fileName + '.py');
    wsedit.createFile(filePath, { ignoreIfExists: true });
    for (let i = 0; i<newcontentText.length; i++) {
        const fileLine = new vscode.Position(i, 0);
        wsedit.insert(filePath, fileLine, newcontentText[i]);
    }
    vscode.workspace.applyEdit(wsedit);

    currentEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.replace(range, name.padStart(rootTabLen+name.length));
        
        let kvStartPos = new vscode.Position(getKivyRegion(currentEditor.document).start, 0);
        const kvStartRange = new vscode.Range(kvStartPos, kvStartPos);

        editBuilder.replace(kvStartRange, "\n#:include " + fileName + ".kv");
        
    });

    vscode.window.showInformationMessage('Created 0 widget \''+name+'\' in : uix/'+ fileName + '.py');
}


export function writeToCurrentFile(currentEditor: vscode.TextEditor | undefined, range: vscode.Range, name: string | undefined, contentText: string[], rootTabLen: number) {
    if (!currentEditor) {
        return;
    }
    
    const wsedit = new vscode.WorkspaceEdit();
    if (!vscode.workspace.workspaceFolders){
        return;
    }
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    if (!name) {
        return;
    }

    if (!contentText) {
        return;
    }

    for (let i=0; i<contentText.length; i++) {
        contentText[i] = contentText[i].slice(rootTabLen);
    }
    
    let newcontentText = createWidgetInFileTemp(contentText, name);

    let kivyRegion = getKivyRegion(currentEditor.document);
    let lastKvLine = kivyRegion.end;

    console.log(lastKvLine);

    for (let i = 0; i<newcontentText.length; i++) {
        let fileLine = new vscode.Position(lastKvLine+1, 0);
        wsedit.insert(currentEditor.document.uri, fileLine, newcontentText[i]);
    }

    let _kvLastPos = new vscode.Position(getKivyRegion(currentEditor.document).end, 0);
    const _kvLastRange = new vscode.Range(_kvLastPos, _kvLastPos);

    
    vscode.workspace.applyEdit(wsedit);
    
    currentEditor.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.replace(range, name.padStart(rootTabLen+name.length));
        editBuilder.replace(_kvLastRange, "\n");
        for (let i = 0; i<newcontentText.length; i++) {
            let kvLastPos = new vscode.Position(getKivyRegion(currentEditor.document).end, 0);
            const kvLastRange = new vscode.Range(kvLastPos, kvLastPos);
            editBuilder.replace(kvLastRange, newcontentText[i]+"\n");
        }

    });
}

function createWidgetTemp(widgetRule: string[], widgetName: string) {
    let classNamea = widgetRule[0].replace(/\s/g, "");
    let className = classNamea.replace(":", "");
    widgetRule[0] = widgetName+"\n";
    widgetName = widgetName.replace(":", "");
    let importStatement  = getKivyImport(className);
    if (importStatement === undefined) {
        importStatement = getKivyMDImport(className);
        if (importStatement === undefined) {
            importStatement = "";
        }
    }
    console.log(importStatement);
    let widgetTemplate: string[] = [];
    let importList = [
        'from kivy.lang import Builder\n',
        importStatement === "" ? "" : 'from ' + importStatement  + ' import ' + className + "\n",
        "\n",
        "Builder.load_string(\"\"\"",
        "\n",
    ];
    let classDefinition = [
        "\n",
        "\"\"\")\n",
        "\n",
        "class " + widgetName + "(" + className +"):\n",
        "\tpass"
    ];
    importList.forEach(element => {
        widgetTemplate.push(element);
    });
    widgetRule.forEach(element => {
        widgetTemplate.push(element);
    });
    classDefinition.forEach(element => {
        widgetTemplate.push(element);
    });

    console.log(widgetRule);
    console.log(widgetTemplate);


    return widgetTemplate;
}

function createWidgetInFileTemp(widgetRule: string[], widgetName: string) {
    let classNamea = widgetRule[0].replace(/\s/g, "");
    let className = classNamea.replace(":", "");
    widgetName = widgetName.replace(":", "");
    widgetRule[0] = "<" + widgetName + "@" + className + ">:";


    let widgetTemplate: string[] = [];
    
    widgetRule.forEach(element => {
        widgetTemplate.push(element);
    });

    return widgetTemplate;
}