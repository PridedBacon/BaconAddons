import Config from "./config";
import { MSGPREFIX } from "./utils/utils";

//import featureManager from "./featureManager";
import { createGhostPick } from "./commands/ghostpick";
import { addToPCBlocklist, removeFromPCBlocklist, getPCBlocklist } from "./features/chat/partyCommands";

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
            /*
            case "load":
                if (args[1]) {
                    ChatLib.chat(MSGPREFIX + "Reloading Feature &a`" + args[1] + "`&e!");
                    featureManager.loadFeature(args[1]);
                    ChatLib.chat(MSGPREFIX + "Done!");
                } else {
                    ChatLib.chat(MSGPREFIX + "Reloading all Features");
                    featureManager.loadAllFeatures();
                    ChatLib.chat(MSGPREFIX + "Done!");
                }
                break;
                */
            default:
                //case "help":
                let messages = [
                    //`&c&l${ChatLib.getChatBreak(" ")}`,
                    `\n\n`,
                    `&d&n BaconAddons Commands:\n`,
                    `&7/bacon &dconfig/cnf/settings &7- &8&oOpens the config menu.`,
                    `&7/bacon &dgpick <slot> <tool> <level> &7- &8&oCreates a Ghost pickaxe in the specified slot.`,
                    `&7/bacon &dpcblocklist [add/remove/list] &7- &8&oAdd/Remove/List Players from the Party-Commands Blocklist.`,
                    //`&7/bacon &dload <name> &7- &8&oReload specified Feature(s) => Name in FeatureManager`,
                    `\n\n`,
                    //`&c&l${ChatLib.getChatBreak(" ")}`
                ];
                ChatLib.chat(messages.join("\n"));
                break;
        }
})
    .setTabCompletions("gpick", "settings", "pcblocklist", /*"load",*/ "help")
    .setName("bac", true)
    .setAliases("bacon");
