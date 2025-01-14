// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AuthenticationManager } from './managers/AuthenticationManager';
import liuInfo from './utils/liu-info';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	liuInfo.init(context)
	const info = liuInfo.getInfo()
	console.log("see custom info: ")
	console.log(info)

	const authManager = AuthenticationManager.getInstance(context)

	const disposable1 = vscode.commands.registerCommand(`${info.extensionId}.helloWorld`, () => {
		vscode.window.showInformationMessage('Hello Liubai for VS Code Ext!')
	})

	context.subscriptions.push(disposable1);
}

// This method is called when your extension is deactivated
export function deactivate() {}
