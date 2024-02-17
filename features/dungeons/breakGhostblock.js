import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";

let blocks = [];

registerWhen(
    register("blockBreak", (block) => {
        blocks.push([0, block.pos]);
    }),
    () => Config.enableBreakGhostblock,
    "Dungeon"
);

registerWhen(
    register("tick", () => {
        for (let i = 0; i < blocks.length; i++) {
            let [call, block] = blocks[i];
            blocks[i][0]++;
            if (call > 20) blocks.splice(i, 1);
            if (World.getBlockAt(block.x, block.y, block.z).type.getID() !== 0) {
                World.getWorld().func_175698_g(block.toMCBlock());
                blocks.splice(i, 1);
            }
        }
    }),
    () => Config.enableBreakGhostblock,
    "Dungeon"
);
