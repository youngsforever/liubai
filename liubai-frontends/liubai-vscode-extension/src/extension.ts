// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const extId = context.extension.id;
	console.warn(`current extension id: `, extId);
	const extMod = context.extensionMode;
	console.log(`current extension mode: `, extMod);
	
	const disposable1 = vscode.commands.registerCommand(`${extId}.helloWorld`, () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello Liubai for VS Code Ext!');
	});

	const _env = vscode.env;
	const uiKind = _env.uiKind;
	console.log(`ui kind: `, uiKind);
	console.log(`web kind: `, vscode.UIKind.Web);
	console.log(`desktop kind: `, vscode.UIKind.Desktop);
	console.log(`ExtensionKind.UI: `, vscode.ExtensionKind.UI);
	console.log(`ExtensionKind.Workspace: `, vscode.ExtensionKind.Workspace);
	console.log(`current extension kind: `, context.extension.extensionKind);


	const lang = _env.language;
	const uriScheme = _env.uriScheme;
	const appName = _env.appName;
	const machineId = _env.machineId;
	const sessionId = _env.sessionId;
	const remoteName = _env.remoteName;
	const appHost = _env.appHost;
	const appRoot = _env.appRoot;

	console.log(`lang: `, lang);
	console.log(`uriScheme: `, uriScheme);
	console.log(`appName: `, appName);
	console.log(`machineId: `, machineId);
	console.log(`sessionId: `, sessionId);
	console.log(`remoteName: `, remoteName);
	console.log(`appHost: `, appHost);
	console.log(`appRoot: `, appRoot);

	const workspaceFolders = vscode.workspace.workspaceFolders;
	console.log(`workspaceFolders: `);
	console.log(workspaceFolders);

	const extUri = context.extensionUri;
	console.log(`extensionUri: `, extUri);

	const disposable2 = vscode.commands.registerCommand(`${extId}.openBrowser`, async () => {
		const callbackLink = `${uriScheme}://${extId}/auth-complete`;
		const callbackUri = vscode.Uri.parse(callbackLink);
		console.log(`callback uri: `, callbackUri);
		console.log(`callback uri toString(): `, callbackUri.toString());

		const externalUri = await _env.asExternalUri(callbackUri);
		console.log(`external uri: `, externalUri);
		console.log(`external uri toString(): `, externalUri.toString());
	});

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
