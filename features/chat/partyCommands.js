import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";
import Skyblock from "../../../BloomCore/Skyblock";
import Party from "../../../BloomCore/Party";
import { isBlocked, isTrusted } from "../../utils/partyCommandsBlocklist";

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
        if (isBlocked(player.toLowerCase())) {
            ChatLib.chat(
                new TextComponent(MSGPREFIX + "Blocked Party-Command from &b" + player + "&e! &a&l[ALLOW]").setClick(
                    "run_command",
                    "/bac pcblocklist remove " + player
                )
            );
            return;
        }
        if (player == Player.getName() || Date.now() - lastRun < 2500) return;
        lastRun = Date.now();
        setTimeout(() => {
            switch (command.toLowerCase()) {
                case "warp":
                    sendCommandIfLeaderElseNotify("p warp", "warped Party!", player);
                    break;
                case "coords":
                case "where":
                    ChatLib.command(
                        `pc x: ${~~Player.getX()}, y: ${~~Player.getY()}, z: ${~~Player.getZ()} | Current area: ${
                            Skyblock.area ? Skyblock.area : "Lobby/Unkown"
                        }${Skyblock.subArea && Skyblock.area != Skyblock.subArea ? " (" + Skyblock.subArea + ")" : []}`
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
        }, 420);
    }).setCriteria(/^Party > [^\w\[]{0,3} ?(?:\[[\w+\+-]+] )?(\w*): !(\w*) ?(\w*).*/),
    () => Config.enablePartyCommands
);

function sendCommandIfLeaderElseNotify(command, successMSG, player, CheckTrusted = false) {
    if (CheckTrusted && !isTrusted(player.toLowerCase())) {
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
