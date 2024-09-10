import Config from "./config";
import { downloadLatestVersion } from "./utils/update";
import { MSGPREFIX, setLooking } from "./utils/utils";

import { createGhostPick } from "./features/dungeons/ghostpick";
import { addToPCBlocklist, removeFromPCBlocklist, getPCBlocklist } from "./utils/partyCommandsBlocklist";
import { enableMacro, disableMacro } from "./features/garden/farmingMacro";

const Desktop = java.awt.Desktop;
const File = java.io.File;
const Files = java.nio.file.Files;

let isUpdating = false;

register("command", (...args) => {
    if (!args || !args[0]) {
        Config.openGUI();
    } else
        switch (args[0].toLowerCase()) {
            case "gpick":
                createGhostPick(args[1], args[2]?.toLowerCase(), args[3]);
                break;
            case "settings":
            case "cnf":
            case "config":
                Config.openGUI();
                break;
            case "pcblocklist":
                switch (args[1]?.toLowerCase()) {
                    case "add":
                        if (!addToPCBlocklist(args[2]))
                            ChatLib.chat(
                                MSGPREFIX + "Failed to add &b" + args[2] + " &eto the Blocklist!"
                            );
                        break;
                    case "remove":
                        if (!removeFromPCBlocklist(args[2]))
                            ChatLib.chat(
                                MSGPREFIX + "Failed to remove &b" + args[2] + " &efrom the Blocklist!"
                            );
                        break;
                    case "list":
                        let names = getPCBlocklist();
                        let message = new Message([MSGPREFIX + "Party-Commands Blocklisted Users:\n"]);
                        names.forEach((name) => {
                            message.addTextComponent(
                                new TextComponent("&7- &b" + name + " &4&l[✖]\n").setClick(
                                    "run_command",
                                    "/bac pcblocklist remove " + name
                                )
                            );
                        });
                        ChatLib.chat(message);
                        break;
                    default:
                        ChatLib.chat(
                            `${MSGPREFIX}Invalid Usage! Use &8\`/bac pcblocklist [add/remove/list] <player>\`&e!`
                        );
                        break;
                }
                break;
            case "update":
                if (isUpdating) ChatLib.chat(MSGPREFIX + "BaconAddons is already updating!");
                else {
                    isUpdating = true;
                    ChatLib.chat(MSGPREFIX + "Updating...");
                    downloadLatestVersion();
                }
                break;
            case "look":
                ChatLib.chat(MSGPREFIX + "This command is currently disabled, you know why :(!");
                //setLooking(args[1], args[2], true);
                break;
            case "setblock":
                if (!args[1]) return ChatLib.chat(MSGPREFIX + "Specify a Block to place!");

                const x = isNaN(parseInt(args[2])) ? ~~Player.getX() : parseInt(args[2]);
                const y = isNaN(parseInt(args[3])) ? ~~Player.getY() : parseInt(args[3]);
                const z = isNaN(parseInt(args[4])) ? ~~Player.getZ() : parseInt(args[4]);

                try {
                    World.getWorld().func_175656_a(
                        new BlockPos(x, y, z).toMCBlock(),
                        new BlockType(args[1]).getDefaultState()
                    );
                    ChatLib.chat(
                        `${MSGPREFIX}Sucessfully placed &a${args[1]}&e at &a${x}, ${y}, ${z}&e!`
                    );
                } catch (e) {
                    ChatLib.chat(
                        `${MSGPREFIX}&eFailed to place ${x && y && z ? "&c" : "&a"}${args[1]}&e at ${
                            x ? "&a" : "&c"
                        }${x}&e, ${y ? "&a" : "&c"}${y}&e, ${z ? "&a" : "&c"}${z}&e!`
                    );
                }
                break;
            case "version":
                const metadata = JSON.parse(FileLib.read("BaconAddons", "metadata.json"));
                ChatLib.chat(MSGPREFIX + "Current Version: &a" + metadata.version);
                break;
            case "macro":
                if (!args[1] || args[1]?.toLowerCase() === "help") {
                    ChatLib.chat(
                        MSGPREFIX +
                            "Use &8`/bac macro start <filename>`&e to start a farming Macro!\n" +
                            MSGPREFIX +
                            "Use &8`/bac macro (stop)`&e to stop a farming Macro!\n" +
                            MSGPREFIX +
                            "Use &8`/bac macro [create/make] <filename>`&e to create a Macro!\n" +
                            MSGPREFIX +
                            "Use &8`/bac macro edit <filename>`&e to edit a Macro!\n" +
                            MSGPREFIX +
                            "Use &8`/bac macro [files/folder]`&e to open the Macro folder!"
                    );
                } else if (args[1]?.toLowerCase() === "start") {
                    const macroArguments = args.slice(3).map((e) => e.toLowerCase());
                    const [code, values] = enableMacro(args[2] || " ", macroArguments);

                    switch (code) {
                        case -1: // Stop
                            break;
                        case 0: // Start
                            const startArgs =
                                macroArguments.length !== 0 ? ` (${macroArguments.join(", ")})` : "";
                            ChatLib.chat(
                                new TextComponent(
                                    MSGPREFIX +
                                        `Started Macro: &a${args[2]}${startArgs}&e!  &c&l[DISABLE]`
                                )
                                    .setClick("run_command", "/bac macro stop")
                                    .setHover("show_text", "&eClick to disable this Macro!")
                            );
                            break;
                        case 1:
                            if (values.length === 0) {
                                ChatLib.chat(
                                    MSGPREFIX +
                                        "No Macros created! Create a Macro-JSON file in &8`.minecraft/config/ChatTriggers/modules/BaconAddons/data/farmingMacros/`&e!"
                                );
                            } else {
                                const msg = new Message(
                                    MSGPREFIX +
                                        `Macro file with name &a${
                                            args[2] || "???"
                                        }&e not found!\n&eAvailable (file)names:`
                                );
                                const validFilenames = values
                                    .map((e) =>
                                        e
                                            .replace(/\.json$/i, "")
                                            .split("/")
                                            .pop()
                                    )
                                    .map((e) =>
                                        new TextComponent("&a" + e)
                                            .setClick("run_command", "/bac macro start " + e)
                                            .setHover("show_text", "&eClick to start: &a" + e)
                                    );

                                for (let comp of validFilenames) {
                                    msg.addTextComponent("\n&d - ").addTextComponent(comp);
                                }

                                msg.chat();
                            }
                            break;
                        case 2:
                            const [unknownArg, possibleArgs] = values;

                            ChatLib.chat(
                                MSGPREFIX +
                                    `Unknown Argument: &c'${unknownArg}'\n` +
                                    MSGPREFIX +
                                    "Possible Arguments: &a" +
                                    possibleArgs.join("&e, &a")
                            );
                            break;
                    }
                } else if (args[1]?.toLowerCase() === "create" || args[1]?.toLowerCase() === "make") {
                    if (!args[2]) {
                        ChatLib.chat(MSGPREFIX + "Specify a filename!");
                    } else if (FileLib.exists("BaconAddons", `data/farmingMacros/${args[2]}.json`)) {
                        ChatLib.chat(MSGPREFIX + `A macro with the name &a${args[2]}&e already exists!`);
                    } else {
                        const newFile = new File(
                            `config/ChatTriggers/modules/BaconAddons/data/farmingMacros/${args[2]}.json`
                        );
                        Files.copy(
                            new File(
                                "config/ChatTriggers/modules/BaconAddons/data/farmingMacros/TEMPLATE.json.disabled"
                            ).toPath(),
                            newFile.toPath()
                        );
                        Desktop.getDesktop().open(newFile);
                        ChatLib.chat(MSGPREFIX + `Opening&a ${args[2]}.json&e!`);
                    }
                } else if (args[1]?.toLowerCase() === "edit") {
                    if (!args[2]) {
                        ChatLib.chat(MSGPREFIX + "Specify a filename!");
                    } else if (!FileLib.exists("BaconAddons", `data/farmingMacros/${args[2]}.json`)) {
                        ChatLib.chat(MSGPREFIX + `No macro with the name &6${args[2]} &efound!`);
                    } else {
                        Desktop.getDesktop().open(
                            new File(
                                `config/ChatTriggers/modules/BaconAddons/data/farmingMacros/${args[2]}.json`
                            )
                        );
                        ChatLib.chat(MSGPREFIX + `Opening&a ${args[2]}.json&e!`);
                    }
                } else if (args[1]?.toLowerCase() === "folder" || args[1]?.toLowerCase() === "files") {
                    Desktop.getDesktop().open(
                        new File("config/ChatTriggers/modules/BaconAddons/data/farmingMacros")
                    );
                    ChatLib.chat(MSGPREFIX + "Opening Macro directory!");
                } else disableMacro();

                break;
            default:
                //case "help":
                let messages = [
                    //`&c&l${ChatLib.getChatBreak(" ")}`,
                    `\n\n`,
                    `&d&n BaconAddons Commands:\n`,
                    `&7/bacon &dconfig/cnf/settings &7- &8&oOpens the config menu.`,
                    `&7/bacon &dgpick <slot> <tool> <level> &7- &8&oCreates a Ghost pickaxe in the specified slot.`,
                    `&7/bacon &dpcblocklist [add/remove/list] &7- &8&oAdd/Remove/List Players from the Party-Commands Blocklist.`,
                    `&7/bacon &dupdate &7- &8&o(Re)install the newest version.`,
                    `&7/bacon &dlook <yaw> <pitch> &7- &8&oLook in the direction (uses current Angle if left empty).`,
                    `&7/bacon &dsetblock (block) <x> <y> <z> &7- &8&oPlace a block at the current or specified coords.`,
                    `&7/bacon &dmacro [start/stop] (name) &7- &8&oStarts/Stops a farming macro.`,
                    `&7/bacon &dversion &7- &8&oPrints the current version.`,
                    `\n\n`,
                    //`&c&l${ChatLib.getChatBreak(" ")}`
                ];
                ChatLib.chat(messages.join("\n"));
                break;
        }
})
    .setTabCompletions(
        "gpick",
        "settings",
        "pcblocklist",
        "update",
        "look",
        "setblock",
        "version",
        "help"
    )
    .setName("bac", true)
    .setAliases("bacon");
