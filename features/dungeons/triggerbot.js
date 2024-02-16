import Config from "../../config";
import { MSGPREFIX, getBlockBounds, registerWhen, traverseVoxelsUntilFunc } from "../../utils/utils";
import { rightClick } from "../../utils/OdinUtils";
import RenderLibV2 from "../../../RenderLibV2";
import { MCBlockPos } from "../../../BloomCore/utils/Utils";

const clickableBlocks = new Set(["minecraft:chest", "minecraft:lever", "minecraft:skull"]);
const noGuiBlocks = new Set(["minecraft:lever", "minecraft:skull"]);
const validSkullIDs = new Set([
    "26bb1a8d-7c66-31c6-82d5-a9c04c94fb02", // Wither Essence
    "edb0155f-379c-395a-9c7d-1b6005987ac8", // Redstone Key
]);
const invalidRooms = new Set(["-60,-60", "-60,-96"]);

let clickedBlocks = [];
let highlightedBlock = [];
let lastClicked = 0;

function checkSneakRules() {
    switch (Config.triggerbotShiftBehaviour) {
        case 0:
            return true;
        case 1:
            let noGuiBlock =
                Player.lookingAt() instanceof Block && noGuiBlocks.has(Player.lookingAt().type.getRegistryName());
            let validBow =
                Player.getHeldItem()?.getRegistryName() === "minecraft:bow" &&
                Player.getInventory()?.getStackInSlot(8)?.getRegistryName() !== "minecraft:arrow";
            let sneaking = Player.isSneaking() && Player.getHeldItem();
            return noGuiBlock || validBow || sneaking;
        case 2:
            return Player.isSneaking();
        case 3:
            return !Player.isSneaking();
    }
}

const isValidSkull = (x, y, z) => {
    const tileEntity = World.getWorld().func_175625_s(new MCBlockPos(x, y, z));
    if (!tileEntity || !tileEntity.func_152108_a()) return false;
    const skullID = tileEntity.func_152108_a().getId().toString();
    return validSkullIDs.has(skullID);
};

function isValidRoom() {
    try {
        let id = Scoreboard.getLineByIndex(Scoreboard.getLines().length - 1)
            .getName()
            .trim()
            .split(" ")
            .pop();
        return !invalidRooms.has(id);
    } catch (e) {
        return false;
    }
}

register("worldLoad", () => {
    clickedBlocks = [];
});

registerWhen(
    register("tick", () => {
        if (Config.triggerbotAutostonk && checkSneakRules() && isValidRoom()) {
            let hit = traverseVoxelsUntilFunc(
                [Player.getX(), Player.getY() + Player.getPlayer().func_70047_e(), Player.getZ()],
                Player.getPitch(),
                Player.getYaw(),
                (block) => {
                    let blockPos = [block.x, block.y, block.z];
                    if (block.type.getRegistryName() === "minecraft:skull") {
                        if (!isValidSkull(blockPos[0], blockPos[1], blockPos[2])) return false;
                    }
                    return (
                        clickableBlocks.has(block.type.getRegistryName()) &&
                        !clickedBlocks.some((pos) => pos.every((v, i) => v === blockPos[i]))
                    );
                },
                (block) => block.type.getID() !== 0,
                5
            );
            if (hit) {
                hit.path.forEach((pos) => {
                    World.getWorld().func_175698_g(new BlockPos(pos[0], pos[1], pos[2]).toMCBlock());
                });
                highlightedBlock = [
                    hit.blockpos,
                    getBlockBounds(World.getBlockAt(new BlockPos(hit.blockpos[0], hit.blockpos[1], hit.blockpos[2]))),
                ];
            } else {
                highlightedBlock = [];
            }
        } else {
            highlightedBlock = [];
        }
        let block =
            Player.lookingAt() instanceof Block && clickableBlocks.has(Player.lookingAt().type.getRegistryName())
                ? Player.lookingAt().pos
                : null;
        if (!block) return;
        let blockPos = [block.x, block.y, block.z];
        if (
            checkSneakRules() &&
            !clickedBlocks.some((pos) => pos.every((v, i) => v === blockPos[i])) &&
            lastClicked + 250 < Date.now() && //Cooldown
            isValidRoom()
        ) {
            if (Player.lookingAt().type.getRegistryName() === "minecraft:skull") {
                if (!isValidSkull(Player.lookingAt().getX(), Player.lookingAt().getY(), Player.lookingAt().getZ()))
                    return;
            }
            clickedBlocks.push(blockPos);
            lastClicked = Date.now();
            ChatLib.chat(MSGPREFIX + "Clicking: &7[" + blockPos.toString() + "]");
            rightClick();
        }
    }),
    () => Config.enableTriggerBot,
    "Dungeon"
);

registerWhen(
    register("renderWorld", () => {
        if (highlightedBlock.length === 2)
            RenderLibV2.drawInnerEspBoxV2(
                highlightedBlock[0][0] + (highlightedBlock[1][3] + highlightedBlock[1][0]) / 2,
                highlightedBlock[0][1] + highlightedBlock[1][1],
                highlightedBlock[0][2] + (highlightedBlock[1][5] + highlightedBlock[1][2]) / 2,
                highlightedBlock[1][3] - highlightedBlock[1][0], //Max - Min
                highlightedBlock[1][4] - highlightedBlock[1][1],
                highlightedBlock[1][5] - highlightedBlock[1][2],
                1,
                1,
                0,
                0.3,
                true
            );
    }),
    () => Config.enableTriggerBot && Config.triggerbotAutostonk,
    "Dungeon"
);
