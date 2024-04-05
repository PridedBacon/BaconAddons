import Config from "../../config";
import { registerWhen, MSGPREFIX, isHoldingFarmingTool } from "../../utils/utils";

let alreadyDetected = false;

registerWhen(
    register("tick", () => {
        if (Player.getY() < 67) {
            if (alreadyDetected) return;
            alreadyDetected = true;
            if (!isHoldingFarmingTool()) return;
            ChatLib.chat(MSGPREFIX + "Teleporting to Garden!");
            ChatLib.command("warp garden");
        } else alreadyDetected = false;
    }),
    () => Config.enableAutoGardenTP,
    "Garden"
);
