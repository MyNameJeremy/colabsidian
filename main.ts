import { readFileSync } from "fs";
import WebSocket from "ws";

import {
  App,
  FileSystemAdapter,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TAbstractFile,
  TFile,
} from "obsidian";
import CodeMirror from "codemirror";

export default class ColabSidian extends Plugin {
  async onload() {

  }

  onunload() {}

}