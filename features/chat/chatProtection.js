import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";

const blockedWords = {
    macro: /(.*)(m?acro?)(.*)/i,
    bac: /(^.{0,10})(bac)(.*)/i,
};

let lastBlockedMessage = "";
let tempDisabled = false;

registerWhen(
    register("messageSent", (message, event) => {
        if (tempDisabled) return;
        if (message.startsWith("/")) return;

        for (let filterName of Object.keys(blockedWords)) {
            let regex = blockedWords[filterName];
            let match = message.match(regex);

            if (match) {
                cancel(event);
                new Message(
                    MSGPREFIX,
                    `&eYour message may contain the word &a'${filterName}'&e!  `,
                    new TextComponent("&6&l[SEND]")
                        .setClick("run_command", "/baconaddonssendmeessageanyways")
                        .setHover("show_text", "&eSends the following message anyways:\n&a" + message),
                    `\n&d->  &b${match[1] ?? ""}&c${match[2]}&b${match[3] ?? ""}`
                ).chat();

                lastBlockedMessage = message;
            }
        }
    }),
    () => Config.enableChatProtection // && isOnHypixel()
);

register("command", () => {
    tempDisabled = true;
    ChatLib.say(lastBlockedMessage);

    setTimeout(() => (tempDisabled = false), 60);
}).setName("baconaddonssendmeessageanyways");
