import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";

let fileNotFound = false;
let blocks;

if (!FileLib.exists("BaconAddons", "./data/F7preDeviceStonk.json")) {
    ChatLib.chat(MSGPREFIX + "Could not find F7 Pre-Device Data!\n" + MSGPREFIX + "Force-Disabling this Feature...");
    fileNotFound = true;
} else {
    blocks = JSON.parse(FileLib.read("BaconAddons", "./data/F7preDeviceStonk.json"));
    //TODO only when enabled
}

registerWhen(
    register("chat", () => {
        preStonk(400);
        preStonk(4000);
    }).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!"),
    () => Config.StonkF7Predevice && !fileNotFound,
    "Dungeon"
);

registerWhen(
    register("command", () => {
        preStonk(21);
    }).setName("pre"),
    () => Config.StonkF7Predevice && !fileNotFound,
    "Dungeon"
);

function preStonk(delay) {
    setTimeout(() => {
        ChatLib.chat(MSGPREFIX + "Prestonking!");
        for (let blockID in blocks) {
            let blockToPlace = new BlockType(blockID).getDefaultState();
            for (let i = 0; i < blocks[blockID].length; i++) {
                let [x, y, z] = blocks[blockID][i];
                let block = new BlockPos(x, y, z);
                World.getWorld().func_175656_a(block.toMCBlock(), blockToPlace);
                //https://github.com/odtheking/OdinClientCT/blob/OdinCheata/features/M7/IHATEDIORITE.js
            }
        }
    }, delay);
}

//Very Scuffed and sensitive recorder
/*
register("soundPlay", (pos, name, volume, pitch, categoryName, event) => {
    if (name.split(".")[0] === "dig") {
        ChatLib.chat(`${pos.x} ${pos.y} ${pos.z}`);
        blocks["0"].push([~~pos.x, ~~pos.y, ~~pos.z]);
    }
});

let blocks = { 0: [] };

register("playerInteract", (action, position) => {
    if (action.toString() !== "RIGHT_CLICK_BLOCK") return;
    setTimeout(() => {
        let block = Player.lookingAt().type.getID();
        ChatLib.chat(block);
        if (!blocks.hasOwnProperty(block)) blocks[block] = [];
        blocks[block].push([position.x, position.y, position.z]);
    }, 21);
});

register("command", () => {
    blocks = { 0: [] };
}).setName("start");

register("command", () => {
    FileLib.write("BaconAddons", "./data/F7preDeviceStonk.json", JSON.stringify(blocks));
    console.log(JSON.stringify(blocks));
}).setName("end");
*/
