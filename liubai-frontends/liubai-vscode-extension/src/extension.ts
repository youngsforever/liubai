// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AuthenticationManager } from './managers/AuthenticationManager';
import liuInfo from './utils/liu-info';
import { i18n } from './locales/i18n';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	liuInfo.init(context)
	const info = liuInfo.getInfo()
	i18n.init()
	console.log("see custom info: ")
	console.log(info)

	const authManager = AuthenticationManager.getInstance(context)

	const disposable1 = vscode.commands.registerCommand(`${info.extensionId}.helloWorld`, async () => {
		const title = i18n.t("appPrefix") + i18n.t("login.h1")
		const confirmTxt = i18n.t("login.sign_in")
		const cancelTxt = i18n.t("common.cancel")
		const res = await vscode.window.showInformationMessage(title, confirmTxt, cancelTxt)
		console.log("result: ", res)
	})

	context.subscriptions.push(disposable1);
}

// This method is called when your extension is deactivated
export function deactivate() {}
