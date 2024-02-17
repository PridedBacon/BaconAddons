import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";
import Skyblock from "../../../BloomCore/Skyblock";
import Party from "../../../BloomCore/Party";
import PogObject from "../../../PogData";

let blocklist = new PogObject(
    "BaconAddons",
    {
        igns: [],
        trustedPlayers: ["taxzero", "extrabenny", "taxzero11", "pridedbacon2279"],
    },
    "./data/partyCommandsBlocklist.json"
);

let lastRun = 0;

/*const numbersToText = new Map([
    ["1", "one"],
    ["2", "two"],
    ["3", "three"],
    ["4", "four"],
    ["5", "five"],
    ["6", "six"],
    ["7", "seven"],
]);*/

registerWhen(
    register("chat", (player, command, arg) => {
        if (blocklist.igns.includes(player.toLowerCase())) {
            ChatLib.chat(
                new TextComponent(MSGPREFIX + "Blocked Party-Command from &b" + player + "&e! &a&l[UNDO]").setClick(
                    "run_command",
                    "/bac pcblocklist remove " + player
                )
            );
        }
        if (player == Player.getName() || Date.now() - lastRun < 2500) return;
        lastRun = Date.now();
        Thread.sleep(420);
        switch (command.toLowerCase()) {
            case "warp":
                sendCommandIfLeaderElseNotify("p warp", "warped Party!", player);
                break;
            case "coords":
            case "where":
                ChatLib.command(
                    `pc Current area: ${Skyblock.area ? Skyblock.area : "Lobby/Unkown"}${
                        Skyblock.subArea && Skyblock.area != Skyblock.subArea ? " (" + Skyblock.subArea + ")" : []
                    } | X: ${~~Player.getX()} Y: ${~~Player.getY()} Z: ${~~Player.getZ()}`
                );
                break;
            case "allinvite":
            case "ai":
                sendCommandIfLeaderElseNotify("p settings allinvite", "toggled All-Invite!", player);
                break;
            case "invite":
            case "inv":
                sendCommandIfLeaderElseNotify("p invite " + arg, "invited " + arg, player + "!");
                break;
            case "ptme":
                sendCommandIfLeaderElseNotify("p transfer " + player, "transfered the Party to him!", player, true);
                break;
            case "pt":
            case "tp":
                sendCommandIfLeaderElseNotify(
                    `p transfer ${arg ? arg : player}`,
                    `transfered the Party to ${arg ? arg : "him"}!`,
                    player,
                    true
                );
                break;
            case "kick":
                sendCommandIfLeaderElseNotify("p kick " + arg, `kicked ${arg} from the Party!`, player, true);
                break;

            //hypixel broke this
            /*
            default:
                dungRegEx = command.toLowerCase().match(/^[dfm][1-7]/);
                if (dungRegEx[0] && Skyblock.area) {
                    if (Party?.leader == Player.getName()) {
                        ChatLib.command(
                            `joindungeon ${dungRegEx[1] === "m" ? "master_" : []}catacombs_${numbersToText.get(
                                dungRegEx[2]
                            )}`
                        );
                        new Thread(() => {
                            for (let i = 5; i >= 0; i--) {
                                ChatLib.chat(
                                    `${MSGPREFIX}You should be in a ${dungRegEx[1] === "m" ? "M" : "F"}${
                                        dungRegEx[2]
                                    } dungeon in ${i} seconds`
                                );
                                Thread.sleep(1000);
                            }
                        }).start();
                    } else {
                        ChatLib.chat(MSGPREFIX + "Not Leader!");
                    }
                } else {
                    ChatLib.chat("no match");
                }
                break;
                */
        }
    }).setCriteria(/^Party > [^\w\[]{0,3} ?(?:\[[\w+\+-]+] )?(\w*): !(\w*) ?(\w*).*/),
    () => Config.enablePartyCommands
);

function sendCommandIfLeaderElseNotify(command, successMSG, player, CheckTrusted = false) {
    if (CheckTrusted && !blocklist.trustedPlayers.includes(player.toLowerCase())) {
        ChatLib.chat(MSGPREFIX + player + " is not trusted!");
        return;
    }
    if (Party?.leader == Player.getName()) {
        ChatLib.command(command);
        ChatLib.chat(
            new TextComponent(MSGPREFIX + "&b" + player + " &e" + successMSG + " &4&l[BLOCK PLAYER]").setClick(
                "run_command",
                "/bac pcblocklist add " + player
            )
        );
    } else {
        ChatLib.chat(MSGPREFIX + "Not Leader!");
    }
}

export function addToPCBlocklist(ign) {
    if (blocklist.igns.includes(ign.toLowerCase()) || !ign) return false;
    blocklist.igns.push(ign.toLowerCase());
    blocklist.save();
    ChatLib.chat(
        new TextComponent(MSGPREFIX + "Added " + ign + " to the Party-Commands Blocklist! &a&l[UNDO]").setClick(
            "run_command",
            "/bac pcblocklist remove " + ign
        )
    );
    return true;
}

export function removeFromPCBlocklist(ign) {
    if (!blocklist.igns.includes(ign.toLowerCase()) || !ign) return false;
    let index = blocklist.igns.indexOf(ign.toLowerCase());
    blocklist.igns.splice(index, 1);
    blocklist.save();
    ChatLib.chat(
        new TextComponent(MSGPREFIX + "Removed " + ign + " from the Party-Commands Blocklist! &a&l[REDO]").setClick(
            "run_command",
            "/bac pcblocklist add " + ign
        )
    );
    return true;
}

export function getPCBlocklist() {
    return blocklist.igns;
}
