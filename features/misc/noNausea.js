import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";

registerWhen(
    register("packetReceived", (packet, event) => {
        if (packet.func_149427_e() === 9) cancel(event);
    }).setFilteredClass(net.minecraft.network.play.server.S1DPacketEntityEffect),
    () => Config.disableNausea
);
