import * as vscode from 'vscode';
import { i18n } from '~/locales/i18n';
import liuInfo from '~/utils/liu-info';

export class LiuStatusBar {
  private static _instance: LiuStatusBar
  private _statusBarItem: vscode.StatusBarItem

  private constructor() {
    const extId = liuInfo.getExtId()
    const statusBarItem = vscode.window.createStatusBarItem(
      "liubai-logo",
      vscode.StatusBarAlignment.Left,
      100,
    )

    const shortname = i18n.t("common.shortname")
    statusBarItem.text = `$(pencil) ${shortname}`
    statusBarItem.command = `${extId}.record`
    statusBarItem.tooltip = i18n.t("record.title")
    statusBarItem.show()

    this._statusBarItem = statusBarItem
  }

  public static initialize() {
    LiuStatusBar.getInstance()
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new LiuStatusBar()
    }
    return this._instance
  }

  public setLoading() {
    const title = i18n.t("record.recording")
    this._statusBarItem.text = `$(loading~spin) ${title}`
  }

  public reset() {
    const shortname = i18n.t("common.shortname")
    this._statusBarItem.text = `$(pencil) ${shortname}`
  }

}