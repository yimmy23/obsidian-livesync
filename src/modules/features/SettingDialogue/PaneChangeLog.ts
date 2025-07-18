import { MarkdownRenderer } from "../../../deps.ts";
import { versionNumberString2Number } from "../../../lib/src/string_and_binary/convert.ts";
import { $msg } from "../../../lib/src/common/i18n.ts";
import { fireAndForget } from "octagonal-wheels/promises";
import type { ObsidianLiveSyncSettingTab } from "./ObsidianLiveSyncSettingTab.ts";
//@ts-ignore
const manifestVersion: string = MANIFEST_VERSION || "-";
//@ts-ignore
const updateInformation: string = UPDATE_INFO || "";

const lastVersion = ~~(versionNumberString2Number(manifestVersion) / 1000);
export function paneChangeLog(this: ObsidianLiveSyncSettingTab, paneEl: HTMLElement): void {
    const informationDivEl = this.createEl(paneEl, "div", { text: "" });

    const tmpDiv = createDiv();
    // tmpDiv.addClass("sls-header-button");
    tmpDiv.addClass("op-warn-info");

    tmpDiv.innerHTML = `<p>${$msg("obsidianLiveSyncSettingTab.msgNewVersionNote")}</p><button>${$msg("obsidianLiveSyncSettingTab.optionOkReadEverything")}</button>`;
    if (lastVersion > (this.editingSettings?.lastReadUpdates || 0)) {
        const informationButtonDiv = informationDivEl.appendChild(tmpDiv);
        informationButtonDiv.querySelector("button")?.addEventListener("click", () => {
            fireAndForget(async () => {
                this.editingSettings.lastReadUpdates = lastVersion;
                await this.saveAllDirtySettings();
                informationButtonDiv.remove();
            });
        });
    }
    fireAndForget(() =>
        MarkdownRenderer.render(this.plugin.app, updateInformation, informationDivEl, "/", this.plugin)
    );
}
