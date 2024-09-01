import request from "../../requestV2/index.js";
import { MSGPREFIX } from "./utils.js";

export function checkForUpdates() {
    request("https://raw.githubusercontent.com/PridedBacon/BaconAddons/main/metadata.json")
        .then((rawdata) => {
            data = JSON.parse(rawdata);
            let metadata = JSON.parse(FileLib.read("BaconAddons", "metadata.json"));

            if (metadata.version == data.version) return;

            let changelogFormatted = [];

            Object.entries(data.$changelog).forEach(([verTag, changelog]) => {
                if (isNewVersion(metadata.version, verTag))
                    changelogFormatted.push(`&e${verTag}:\n&3- ` + changelog.join("\n&r&3- "));
            });
            new Message(
                "\n",
                MSGPREFIX + `New update avaliable! (Version ${data.version})\n`,
                new TextComponent(MSGPREFIX + "&a&l[CLICK TO DOWNLOAD]")
                    .setClick("run_command", "/bac update")
                    .setHover("show_text", `&aClick to automatically update to Version ${data.version}`),
                "  ",
                new TextComponent(`&b&l[CHANGELOG FOR ${data.version}]`).setHover(
                    "show_text",
                    "&6&lChangelog:\n\n" + changelogFormatted.join("\n")
                ),
                "\n"
            ).chat();
        })
        .catch((error) => ChatLib.chat(MSGPREFIX + "Error getting update Information: " + error));
}

function isNewVersion(currVersion, checkVersion) {
    const partsCurrVersion = currVersion.split(".").map(Number);
    const partsCheckVersion = checkVersion.split(".").map(Number);

    const maxLength = Math.max(partsCurrVersion.length, partsCheckVersion.length);

    for (let i = 0; i < maxLength; i++) {
        let old = partsCurrVersion[i] || 0;
        let check = partsCheckVersion[i] || 0;

        if (old < check) return true;
        else if (old > check) return false;
    }

    return false;
}

const File = Java.type("java.io.File");
const URL = Java.type("java.net.URL");
const PrintStream = Java.type("java.io.PrintStream");
const Byte = Java.type("java.lang.Byte");

export function downloadLatestVersion() {
    new Thread(() => {
        new File("./config/ChatTriggers/modules/BaconAddonsTempDownload").mkdir();
        ChatLib.chat(MSGPREFIX + "Downloading latest files...");
        urlToFile(
            "https://github.com/PridedBacon/BaconAddons/archive/refs/heads/main.zip",
            "./config/ChatTriggers/modules/BaconAddonsTempDownload/BaconAddons.zip",
            10000,
            20000
        );
        ChatLib.chat(MSGPREFIX + "Downloaded the repo, unzipping!");
        FileLib.unzip(
            "./config/ChatTriggers/modules/BaconAddonsTempDownload/BaconAddons.zip",
            "./config/ChatTriggers/modules/BaconAddonsTempDownload/BaconAddons/"
        );
        ChatLib.chat(MSGPREFIX + "Finishing up!");
        FileLib.deleteDirectory(new File("./config/ChatTriggers/modules/BaconAddons"));

        new File(
            "./config/ChatTriggers/modules/BaconAddonsTempDownload/BaconAddons/BaconAddons-main"
        ).renameTo(new File("./config/ChatTriggers/modules/BaconAddons"));

        FileLib.deleteDirectory(new File("./config/ChatTriggers/modules/BaconAddonsTempDownload"));
        ChatLib.chat(MSGPREFIX + "Done, Reloading!");
        ChatLib.command("ct load", true);
    }).start();

    function urlToFile(url, destination, connecttimeout, readtimeout) {
        const d = new File(destination);
        d.getParentFile().mkdirs();
        const connection = new URL(url).openConnection();
        connection.setDoOutput(true);
        connection.setConnectTimeout(connecttimeout);
        connection.setReadTimeout(readtimeout);
        const IS = connection.getInputStream();
        const FilePS = new PrintStream(destination);
        let buf = new Packages.java.lang.reflect.Array.newInstance(Byte.TYPE, 65536);
        let len;
        while ((len = IS.read(buf)) > 0) {
            FilePS.write(buf, 0, len);
        }
        IS.close();
        FilePS.close();
    }
}
