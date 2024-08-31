import Config from "./config";
import { downloadLatestVersion } from "./utils/update";
import { MSGPREFIX, setLooking } from "./utils/utils";

import { createGhostPick } from "./features/dungeons/ghostpick";
import { addToPCBlocklist, removeFromPCBlocklist, getPCBlocklist } from "./utils/partyCommandsBlocklist";

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
                            ChatLib.chat(MSGPREFIX + "Failed to add &b" + args[2] + " &eto the Blocklist!");
                        break;
                    case "remove":
                        if (!removeFromPCBlocklist(args[2]))
                            ChatLib.chat(MSGPREFIX + "Failed to remove &b" + args[2] + " &efrom the Blocklist!");
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
                    ChatLib.chat(`${MSGPREFIX}Sucessfully placed &a${args[1]}&e at &a${x}, ${y}, ${z}&e!`);
                } catch (e) {
                    ChatLib.chat(
                        `${MSGPREFIX}&eFailed to place ${x && y && z ? "&c" : "&a"}${args[1]}&e at ${
                            x ? "&a" : "&c"
                        }${x}&e, ${y ? "&a" : "&c"}${y}&e, ${z ? "&a" : "&c"}${z}&e!`
                    );
                }
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
                    `&7/bacon &dupdate &7- &8&o(Re)install the newest version`,
                    `&7/bacon &dlook <yaw> <pitch> &7- &8&oLook in the direction (uses current Angle if left empty)`,
                    `&7/bacon &dsetblock (block) <x> <y> <z> &7- &8&oPlace a block at the current or specified coords`,
                    `\n\n`,
                    //`&c&l${ChatLib.getChatBreak(" ")}`
                ];
                ChatLib.chat(messages.join("\n"));
                break;
        }
})
    .setTabCompletions("gpick", "settings", "pcblocklist", "update", "look", "setblock", "help")
    .setName("bac", true)
    .setAliases("bacon");
