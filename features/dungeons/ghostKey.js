import Config from "../../config";
import { registerWhen } from "../../utils/utils";
import { MCBlockPos } from "../../../BloomCore/utils/Utils";

const ghostBlockKey = new KeyBind("Create Ghost Blocks (Hold)", Keyboard.KEY_NONE, "§dBaconAddons");

const protectedBlocks = new Set([
    "minecraft:lever",
    "minecraft:chest",
    "minecraft:trapped_chest",
    "minecraft:skull",
]);
const validSkullIDs = new Set([
    "26bb1a8d-7c66-31c6-82d5-a9c04c94fb02", // Wither Essence
    "edb0155f-379c-395a-9c7d-1b6005987ac8", // Redstone Key
]);

const isValidSkull = (x, y, z) => {
    const tileEntity = World.getWorld().func_175625_s(new MCBlockPos(x, y, z));
    if (!tileEntity || !tileEntity.func_152108_a()) return false;
    const skullID = tileEntity.func_152108_a().getId().toString();
    return validSkullIDs.has(skullID);
};

registerWhen(
    register("tick", () => {
        if (ghostBlockKey.isKeyDown()) {
            playerLookingAt = Player.lookingAt() instanceof Block ? Player.lookingAt() : null;
            if (
                playerLookingAt &&
                (!protectedBlocks.has(playerLookingAt.type.getRegistryName()) ||
                    (playerLookingAt.type.getRegistryName() === "minecraft:skull" &&
                        !isValidSkull(
                            playerLookingAt.pos.x,
                            playerLookingAt.pos.y,
                            playerLookingAt.pos.z
                        )))
            ) {
                World.getWorld().func_175698_g(playerLookingAt.pos.toMCBlock());
            }
        }
    }),
    () => Config.enableGhostBlockKeybind
);
