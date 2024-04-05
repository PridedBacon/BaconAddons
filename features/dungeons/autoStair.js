import Config from "../../config";
import { registerWhen } from "../../utils/utils";

const JavaBlockPos = Java.type("net.minecraft.util.BlockPos");
const setBlockState = (x, y, z, state) => World.getWorld().func_175656_a(new JavaBlockPos(x, y, z), state);

function checkStair(stairState, x, y, z) {
    let res = RegExp(/^minecraft:\w*\[facing=(\w*),half=bottom,shape=.*/).exec(stairState);
    if (res?.length > 1) {
        let pX = parseInt(Player.getX());
        let pZ = parseInt(Player.getZ());
        switch (res[1]) {
            case "north":
                return pZ > z;
            case "south":
                return pZ - 2 < z;
            case "east":
                return pX - 1 < x;
            case "west":
                return pX + 1 > x;
        }
    } else console.log("Could not match stair regex");
    return false;
}

let slabs = [];
registerWhen(
    register("tick", () => {
        let pX = parseInt(Player.getX());
        let pY = parseInt(Player.getY());
        let pZ = parseInt(Player.getZ());
        for (let x = pX - 3; x < pX + 3; x++) {
            for (let z = pZ - 3; z < pZ + 3; z++) {
                let block = World.getBlockAt(x, pY, z);
                if (
                    !block ||
                    !block.type.getRegistryName().includes("stair") ||
                    !checkStair(block.getState(), x, pY, z)
                )
                    continue;
                slabs.push([block.getState(), x, pY, z]);
                setBlockState(x, pY, z, new BlockType(44).getDefaultState());
            }
        }

        for (let i = 0; i < slabs.length; i++) {
            let [oldBlock, x, y, z] = slabs[i];
            if (Math.abs(x - pX) > 3 || Math.abs(z - pZ) > 3 || y !== pY || !checkStair(oldBlock, x, y, z)) {
                setBlockState(x, y, z, oldBlock);
                slabs.splice(i, 1);
            }
        }
    }),
    () => Config.enableAutoStair,
    "Dungeon"
);

register("worldLoad", () => {
    slabs = [];
});
