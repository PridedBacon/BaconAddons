import PogObject from "../../PogData";
import { MSGPREFIX } from "./utils";

const blocklist = new PogObject(
    "BaconAddons",
    {
        igns: [],
        trustedPlayers: ["taxzero", "extrabenny", "taxzero11", "pridedbacon2279"],
    },
    "./data/partyCommandsBlocklist.json"
);

export function addToPCBlocklist(ign) {
    if (isBlocked(ign) || !ign) return false;
    blocklist.igns.push(ign.toLowerCase());
    blocklist.save();
    ChatLib.chat(
        new TextComponent(
            MSGPREFIX + "Added " + ign + " to the Party-Commands Blocklist! &a&l[UNDO]"
        ).setClick("run_command", "/bac pcblocklist remove " + ign)
    );
    return true;
}

export function removeFromPCBlocklist(ign) {
    if (!isBlocked(ign) || !ign) return false;
    let index = blocklist.igns.indexOf(ign.toLowerCase());
    blocklist.igns.splice(index, 1);
    blocklist.save();
    ChatLib.chat(
        new TextComponent(
            MSGPREFIX + "Removed " + ign + " from the Party-Commands Blocklist! &a&l[REDO]"
        ).setClick("run_command", "/bac pcblocklist add " + ign)
    );
    return true;
}

export function getPCBlocklist() {
    return blocklist.igns;
}

export function isBlocked(ign) {
    return blocklist.igns.includes(ign.toLowerCase());
}

export function isTrusted(ign) {
    return blocklist.trustedPlayers.includes(ign.toLowerCase());
}
