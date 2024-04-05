import { checkForUpdates } from "./utils/update.js";
import { MSGPREFIX } from "./utils/utils";

import "./commandManager";

import "./features/dungeons/ghostpick.js";
import "./features/garden/pests.js";
import "./features/dungeons/F7preDeviceStonk.js";
import "./features/chat/partyCommands.js";
import "./features/dungeons/ghostKey.js";
import "./features/dungeons/triggerbot.js";
import "./features/misc/harpSolver.js";
import "./features/dungeons/dungeonHighlight.js";
import "./features/dungeons/autoSuperbounce.js";
import "./features/dungeons/breakGhostblock.js";
import "./features/misc/dragonFeatures.js";
import "./features/dungeons/autoStair.js";
import "./features/garden/autoGardenTP.js";

ChatLib.chat(MSGPREFIX + "Loaded!");

let hasShownUpdateMsg = false;
const updatechecker = register("tick", () => {
    if (!hasShownUpdateMsg) {
        hasShownUpdateMsg = true;
        updatechecker.unregister();
        setTimeout(checkForUpdates, 1500);
    }
});
