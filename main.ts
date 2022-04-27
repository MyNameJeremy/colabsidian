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

interface ColabSidianSettings {
  ip: string;
  port: string;
}

const DEFAULT_SETTINGS: ColabSidianSettings = {
  ip: "127.0.0.1",
  port: "4404",
};

export default class ColabSidian extends Plugin {
  settings: ColabSidianSettings;
  basePath = (this.app.vault.adapter as FileSystemAdapter).getBasePath();
  ws: WebSocket;
  ws_enable = false;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new ColabSidianSettingTab(this.app, this));

  }

  onunload() {}

  async send(payload: object) {
    if (!this.ws || !this.ws.OPEN) return console.log("abort send", payload);
    let pl = JSON.stringify(payload);
    console.log(`sending '${pl}' to Sync-Server`);
    this.ws.send(pl, (err) => {
      if (err) console.error(err.message);
    });
  }

  async connectToSyncServer() {
    if (!!this.ws && this.ws.OPEN) this.ws.close();
    if (!this.ws_enable) return; //don't reconnect when ws is disabeled

    this.ws = new WebSocket(`ws://${this.settings.ip}:${this.settings.port}`);

    this.ws.on("message", (msg) => {
      let { type, payload } = JSON.parse(String(msg));

      if (!type) this.ws_enable = false;

      switch (type[0]) {
        case "p":
          return this.ws.send('{"type": "p"}');
        default:
          this.ws_enable = false;
      }
    });

    this.ws.on("open", () => {
      console.log(
        `connected to ${this.settings.ip}, on port ${this.settings.port}`
      );
    });
  }

  async loadSettings() {
    let data = String(readFileSync(`${this.basePath}/data.json`));
    this.settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(data));
  }

  async saveSettings() {
    await this.saveData(this.settings);
    await this.connectToSyncServer();
  }
}

class ColabSidianSettingTab extends PluginSettingTab {
  plugin: ColabSidian;

  constructor(app: App, plugin: ColabSidian) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("IP")
      .setDesc("set the IP of the sync-server")
      .addText((text) =>
        text
          .setPlaceholder("Enter the IP")
          .setValue(this.plugin.settings.ip)
          .onChange(async (value) => {
            console.log("ColabSidian ip: " + value);
            this.plugin.settings.ip = value;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
      .setName("Port")
      .setDesc("set the port of the sync-server, to connect to")
      .addText((text) =>
        text
          .setPlaceholder("Enter the Port")
          .setValue(this.plugin.settings.port)
          .onChange(async (value) => {
            console.log("ColabSidian port: " + value);
            this.plugin.settings.port = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
