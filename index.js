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
//import "./features/garden/farmingAutoWalk.js";
//import "./features/dungeons/autoTerms.js";
//import "./features/dungeons/interactionStop.js";
//import "./features/esp/customMobESP.js";
//import "./features/general/antiCarpet.js"];
//import "./features/dungeons/dungeonRoutes.js";

ChatLib.chat(MSGPREFIX + "Loaded!");

let hasShownUpdateMsg = false;
register("worldLoad", () => {
    if (!hasShownUpdateMsg) {
        hasShownUpdateMsg = true;
        checkForUpdates();
    }
});
