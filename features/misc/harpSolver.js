import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";

const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot");
const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");

const sendWindowClick = (windowId, slot, clickType, actionNumber = 0) => {
    ChatLib.chat(`${MSGPREFIX}Clicking in slot ${slot}!`);
    Client.sendPacket(
        new C0EPacketClickWindow(
            windowId ?? Player.getContainer().getWindowId(),
            slot,
            clickType ?? 0,
            0,
            null,
            actionNumber
        )
    );
};
const slots = [37, 38, 39, 40, 41, 42, 43];
let canClick = false;

const funkyStuff = () => {
    canClick = false;
    let inv = Player.getContainer();
    if (!inv || !inv.getName().startsWith("Harp - ") || inv.getSize() < 54) return;
    for (let s of slots) {
        let item = inv.getStackInSlot(s - 9);
        if (!item) continue;
        let name = item.getName();
        let split = name.split(" ");
        if (split.length < 2) continue;
        let color = split[1][1];
        if (color == "7") continue;
        sendWindowClick(null, s, 0);
        canClick = false;
    }
};

registerWhen(
    register("packetReceived", () => {
        if (canClick) return;
        canClick = true;
        Client.scheduleTask(Config.clickDelayHarpSolver, funkyStuff);
    }).setPacketClass(S2FPacketSetSlot),
    () => Config.enableHarpSolver
);
