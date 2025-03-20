import * as vscode from 'vscode'
import liuEnv from './liu-env'

const customEnv = liuEnv.getEnv()

export class Logger {
  private static outputChannel?: vscode.LogOutputChannel

  static init() {
    if(this.outputChannel) return
    const appName = customEnv.appName
    this.outputChannel = vscode.window.createOutputChannel(appName, { log: true })
  }

  static info(message: string, ...args: any[]) {
    if(!this.outputChannel) return
    this.outputChannel.info(message, ...args)
  }

  static warn(message: string, ...args: any[]) {
    if(!this.outputChannel) return
    this.outputChannel.warn(message, ...args)
  }

  static error(error: string | Error, ...args: any[]) {
    if(!this.outputChannel) return
   this.outputChannel.error(error, ...args) 
  }

  static dispose() {
    if(!this.outputChannel) return
    this.outputChannel.dispose()
  }

  static show() {
    if(!this.outputChannel) return
    this.outputChannel.show()
  }
}
