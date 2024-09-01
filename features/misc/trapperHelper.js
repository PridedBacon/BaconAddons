import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";
import RenderLibV2 from "../../../RenderLibV2/index";
import MayorUtils from "../../utils/MayorUtils";

let animals = [];
let armorStands = [];
let isHunting = false;
let lastLocs = [];
let mobLocation = "";
let mobRarity = "🤧🤢😭"; // required for (entity.includes(mobType))

let animalHealth = [100, 200, 500, 1000, 2000, 5000, 10000, 30000];
MayorUtils.isDerpy().then((answ) => {
    if (answ) animalHealth = animalHealth.map((a) => a * 2);
});

const spawnedAnimalClasses = new Set([
    //net.minecraft.entity.passive.
    "EntityChicken",
    "EntityCow",
    "EntityPig",
    "EntityRabbit",
    "EntitySheep",
    "EntityHorse",

    "EntityArmorStand",
]);

const minReqHeight = {
    "desert mountain": 110,
    "desert settlement": 73,
    oasis: 59,
};

const maxReqHeight = {
    "desert settlement": 85,
    "mushroom gorge": 100,
    "glowing mushroom cave": 64,
    "overgrown mushroom cave": 72,
    oasis: 115,
};

registerWhen(
    register("step", () => {
        armorStands = [];

        animals = World.getAllEntities().filter((e) => {
            let mobClass = e.getClassName();
            if (!spawnedAnimalClasses.has(mobClass)) return false; // If it is same Mob

            if (mobClass === "EntityArmorStand" && e.getName().includes(mobRarity)) {
                armorStands.push(e);
                return false; // If it is Armor Stand -> Seperate Renderer
            }

            if (minReqHeight[mobLocation] && minReqHeight[mobLocation] > e.getY()) return; // Filter for mobs below ...

            if (maxReqHeight[mobLocation] && maxReqHeight[mobLocation] < e.getY()) return; // Filter for mobs above     ...

            if (!animalHealth.includes(new EntityLivingBase(e.entity).getMaxHP())) return false; //If it has same HP

            return true;
        });

        animals = animals.filter((e) => !armorStands.some((a) => a.distanceTo(e) < 3)); //Don't display animal and armorStands at the same time
    }).setFps(8),
    () => Config.enableTrapperHelper && isHunting,
    "The Farming Islands"
);

registerWhen(
    register("renderWorld", () => {
        if (animals.length !== 0 || armorStands.length !== 0) {
            lastLocs = animals
                .map((e) => [e.getX(), e.getY(), e.getZ()])
                .concat(armorStands.map((e) => [e.getX(), e.getY() - 1, e.getZ()]));

            animals.forEach((e) => {
                RenderLibV2.drawInnerEspBox(
                    e.getRenderX(),
                    e.getRenderY(),
                    e.getRenderZ(),
                    1,
                    1,
                    0,
                    1,
                    0,
                    0.66,
                    true
                );

                RenderLibV2.drawLine(
                    Player.getRenderX(),
                    Player.getRenderY() + Player.getPlayer().func_70047_e(),
                    Player.getRenderZ(),
                    e.getRenderX(),
                    e.getRenderY() + 0.5,
                    e.getRenderZ(),
                    0,
                    1,
                    0,
                    0.66,
                    true,
                    4
                );
            });

            armorStands.forEach((e) => {
                RenderLibV2.drawInnerEspBox(
                    e.getRenderX(),
                    e.getRenderY() - 1,
                    e.getRenderZ(),
                    1,
                    1,
                    0,
                    0,
                    1,
                    0.66,
                    true
                );

                RenderLibV2.drawLine(
                    Player.getRenderX(),
                    Player.getRenderY() + Player.getPlayer().func_70047_e(),
                    Player.getRenderZ(),
                    e.getRenderX(),
                    e.getRenderY() - 0.5,
                    e.getRenderZ(),
                    0,
                    0,
                    1,
                    0.66,
                    true,
                    4
                );
            });
        } else {
            lastLocs.forEach(([x, y, z]) => {
                RenderLibV2.drawInnerEspBox(x, y, z, 1, 1, 1, 165 / 255, 0, 0.4, true);

                RenderLibV2.drawLine(
                    Player.getRenderX(),
                    Player.getRenderY() + Player.getPlayer().func_70047_e(),
                    Player.getRenderZ(),
                    x,
                    y + 0.5,
                    z,
                    1,
                    165 / 255,
                    0,
                    0.4,
                    true,
                    4
                );
            });
        }
    }),
    () => Config.enableTrapperHelper && isHunting,
    "The Farming Islands"
);

// Auto accept
registerWhen(
    register("chat", (event) => {
        const msg = event.message;
        const acceptmsg = msg.func_150253_a().find((m) => m.text === "§a§l[YES]");
        const acceptCommand = new TextComponent(acceptmsg).getClickValue();
        ChatLib.chat(MSGPREFIX + "Auto accepting Task!");
        ChatLib.say(acceptCommand);

        isHunting = true;
        lastLocs = [];
        animals = [];
        armorStands = [];
        spawnedMobs = [];
    }).setCriteria("\nAccept the trapper's task to hunt the animal?\nClick an option: [YES] - [NO]"),
    () => Config.enableTrapperHelper,
    "The Farming Islands"
);

registerWhen(
    register("chat", (event) => {
        isHunting = false;
    }).setCriteria("Return to the Trapper soon to get a new animal to hunt!"),
    () => Config.enableTrapperHelper,
    "The Farming Islands"
);

registerWhen(
    register("chat", () => {
        isHunting = false;
    }).setChatCriteria("You ran out of time and the animal disappeared!"),
    () => Config.enableTrapperHelper,
    "The Farming Islands"
);

registerWhen(
    register("chat", (rarity, loc) => {
        mobRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase();
        mobLocation = loc.toLowerCase();
    }).setChatCriteria(/\[NPC\] Trevor: You can find your (\w+) animal near the ([\w ]+)\./),
    () => Config.enableTrapperHelper,
    "The Farming Islands"
);
