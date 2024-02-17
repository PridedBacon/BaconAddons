import { MSGPREFIX } from "./utils/utils";

import "./commandManager";

import "./features/garden/pests.js";
import "./features/dungeons/F7preDeviceStonk.js";
import "./features/chat/partyCommands.js";
import "./features/dungeons/ghostKey.js";
import "./features/dungeons/triggerbot.js";
import "./features/misc/harpSolver.js";
import "./features/dungeons/dungeonHighlight.js";
import "./features/dungeons/autoSuperbounce.js";
//import "./features/dungeons/autoTerms.js";
//import "./features/general/antiCarpet.js"];
//import "./features/esp/customMobESP.js";
//import "./features/dungeons/dungeonRoutes.js";

ChatLib.chat(MSGPREFIX + "Loaded!");
