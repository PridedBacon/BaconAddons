import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";
import { removeUnicode } from "../../../BloomCore/utils/Utils";

const JavaBlockPos = Java.type("net.minecraft.util.BlockPos");
const setBlockState = (x, y, z, state) =>
    World.getWorld().func_175656_a(new JavaBlockPos(x, y, z), state);
const setBlock = (x, y, z, block) =>
    World.getWorld().func_175656_a(
        new BlockPos(x, y, z).toMCBlock(),
        new BlockType(block).getDefaultState()
    );

let chests = [];
registerWhen(
    register("tick", () => {
        let pX = parseInt(Player.getX());
        let pY = parseInt(Player.getY());
        let pZ = parseInt(Player.getZ());
        if (Player.isSneaking())
            for (let x = pX - 1; x <= pX + 1; x++)
                for (let y = pY - 1; y > pY - 10; y--)
                    for (let z = pZ - 1; z <= pZ + 1; z++) {
                        let block = World.getBlockAt(x, y, z);
                        if (block?.type?.getID() === 10 || block?.type?.getID() === 11) {
                            chests.push([block.getState(), x, y, z]);
                            setBlock(x, y, z, "rail");
                            break;
                        }
                    }
        for (let i = 0; i < chests.length; i++) {
            let x = chests[i][1];
            let y = chests[i][2];
            let z = chests[i][3];
            if (Math.abs(x - pX) >= 1.5 || Math.abs(z - pZ) >= 1.5) {
                setBlockState(x, y, z, chests[i][0]);
                chests.splice(i, 1);
            }
        }
    }),
    () =>
        Config.enableAutoSuperbounce &&
        (getCurrentRoomId() === "f7" ||
            (Config.superbounceForceToggle &&
                Scoreboard.getLines().some(
                    (l) => removeUnicode(l.getName()).trim() === "7 cThe Cataccombs 7(F7)"
                ))),
    "Dungeon"
);

register("worldLoad", () => {
    chests = [];
});

function getCurrentRoomId() {
    try {
        let id = Scoreboard.getLineByIndex(Scoreboard.getLines().length - 1)
            .getName()
            .trim()
            .split(" ")
            .pop();
        return id;
    } catch (e) {
        return "None";
    }
}
