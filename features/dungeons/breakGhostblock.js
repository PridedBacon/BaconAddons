import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";

let blocks = [];

registerWhen(
    register("blockBreak", (block) => {
        blocks.push([Date.now(), block.pos]);
    }),
    () => Config.enableBreakGhostblock,
    "Dungeon"
);

registerWhen(
    register("renderWorld", () => {
        for (let i = 0; i < blocks.length; i++) {
            let [date, block] = blocks[i];
            blocks[i][0]++;
            if (Date.now() - date > 1500) blocks.splice(i, 1);
            if (World.getBlockAt(block.x, block.y, block.z).type.getID() !== 0) {
                World.getWorld().func_175698_g(block.toMCBlock());
            }
        }
    }),
    () => Config.enableBreakGhostblock,
    "Dungeon"
);
