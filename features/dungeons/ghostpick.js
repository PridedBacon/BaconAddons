import Config from "../../config";
import { MSGPREFIX } from "../../utils/utils";

const ItemStack = Java.type("net.minecraft.item.ItemStack");
const Enchantment = Java.type("net.minecraft.enchantment.Enchantment");
const validTools = {
    pick: "minecraft:diamond_pickaxe",
    axe: "minecraft:golden_axe",
    shovel: "minecraft:golden_shovel",
    shear: "minecraft:shears",
};
const toolTranslation = {
    pick: "Pickaxe",
    axe: "Axe",
    shovel: "Shovel",
    shear: "Shears",
};
const defaultSlotTranslation = () => Config.ghostPickSlot + 1;
const defaultEffiLVLTranslation = ["0", "6", "10", "12", "127"];

export const createGhostPick = (
    slot = defaultSlotTranslation(),
    tool = Config.ghostPickDefaultAutoMode ? "auto" : "pick",
    level = defaultEffiLVLTranslation[Config.ghostPickEffiLVL]
) => {
    const num = parseInt(slot, 10);
    const lvl = parseInt(level, 10);

    if (isNaN(num) || num > 9 || num < 1) {
        ChatLib.chat(
            `${MSGPREFIX}Invalid Input for Slot (\`${slot}\`)&6!\n&d[Bacon] &eUse &8\`/bac gpick [1-9] (tool) [0-127]\`&e!`
        );
        return;
    }
    if (!(tool in validTools || tool == "auto")) {
        ChatLib.chat(
            `${MSGPREFIX}Invalid Input for Tool (\`${tool}\`)&6!\n&d[Bacon] &eValid Tools: &8\`pick, axe, shovel, shear\`&e!`
        );
        return;
    }
    if (isNaN(lvl) || lvl > 127 || lvl < 0) {
        ChatLib.chat(
            `${MSGPREFIX}Invalid Input for Efficiency Level (\`${level}\`)&6!\n&d[Bacon] &eUse &8\`/bac gpick [1-9] (tool) [0-127]\`&e!`
        );
        return;
    }

    if (tool == "auto") {
        playerLookingAt = Player.lookingAt() instanceof Block ? Player.lookingAt() : null;
        if (
            playerLookingAt &&
            playerLookingAt.type.mcBlock.func_176195_g(
                World.getWorld(),
                new BlockPos(
                    playerLookingAt.getX(),
                    playerLookingAt.getY(),
                    playerLookingAt.getZ()
                ).toMCBlock()
            ) !== 0
        ) {
            const ItemEffi = (item) =>
                new ItemStack(new Item(item).getItem()).func_150997_a(playerLookingAt.type.mcBlock);

            let EfficiencyValues = Object.values(validTools).map((a) => ItemEffi(a));
            let maxValueIndex = EfficiencyValues.indexOf(Math.max(...EfficiencyValues));
            tool = Object.keys(validTools)[maxValueIndex];
        } else {
            tool = "pick";
        }
    }

    let nbt = new ItemStack(new Item(validTools[tool]).getItem()); //Item
    nbt.func_77966_a(Enchantment.field_77349_p, lvl); //Efficiency 127 Max
    nbt.func_77978_p().func_74757_a("Unbreakable", true); //Unbreakable

    Player.getInventory()
        .getInventory()
        .func_70299_a(num - 1, nbt);

    ChatLib.chat(
        `${MSGPREFIX}Created Ghost &a${toolTranslation[tool]}&6 in slot &a${num}&6! (&aEffi ${lvl}&6)`
    );
};

const key = new KeyBind("Create Ghost Pickaxe", Keyboard.KEY_NONE, "§dBaconAddons");

key.registerKeyPress(() => createGhostPick());
