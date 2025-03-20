import * as vscode from 'vscode'
import liuEnv from './liu-env'

const customEnv = liuEnv.getEnv()

export class Logger {
  private static outputChannel: vscode.LogOutputChannel

  static init(context: vscode.ExtensionContext) {
    const appName = customEnv.appName
    this.outputChannel = vscode.window.createOutputChannel(appName, { log: true })
  }

  static info(message: string, ...args: any[]) {
    this.outputChannel.info(message, ...args)
  }

  static warn(message: string, ...args: any[]) {
    this.outputChannel.warn(message, ...args)
  }

  static error(error: string | Error, ...args: any[]) {
   this.outputChannel.error(error, ...args) 
  }

  static dispose() {
    this.outputChannel.dispose()
  }

  static show() {
    this.outputChannel.show()
  }
}
