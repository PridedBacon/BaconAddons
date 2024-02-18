import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";
import PogObject from "../../../PogData";
import RenderLibV2 from "../../../RenderLibV2";

let ESPconf = new PogObject(
    "BaconAddons",
    {
        locations: { All: {}, Dungeon: {} },
    },
    "./data/ESPconfig.json"
);

let renders = [];

registerWhen(
    register("tick", () => {
        renders = [];
        World.getAllEntities().forEach((entity) => {
            let name = entity.getName();
            let customName = entity.entity.func_95999_t();
            let className = entity.getClassName();

            function reqStartsWith(str) {
                if (!str) return true;
                return name.startsWith(str) || customName.startsWith(str);
            }

            function reqEndsWith(str) {
                if (!str) return true;
                return name.endsWith(str) || customName.endsWith(str);
            }

            function reqIncludes(str) {
                if (!str) return true;
                return name.includes(str) || customName.includes(str);
            }

            function reqMatches(str) {
                if (!str) return true;
                let regex = false;
                if (str.startsWith("/") && str.endsWith("/")) regex = true;
                if (!regex) return name === str || customName === str;
                else
                    try {
                        return RegExp(str).test(name) || RegExp(str).test(customName);
                    } catch {
                        return false;
                    }
            }

            function reqClass(str) {
                if (!str) return true;
                return className == str;
            }

            function reqSkin(str) {
                if (!str) return true;
            }

            //Startswith Endswith Includes matches => (RegEx), Class, Skin, Equippment (Name or Custom Name)

            if (
                (name.startsWith("§6✯ ") && name.endsWith("§c❤")) ||
                (customName.startsWith("§6✯ ") && customName.endsWith("§c❤"))
            ) {
                renders.push([entity.getX(), entity.getY() - 1.9, entity.getZ(), 1, 2, 0, 1, 0, 1, true]);
                print(className);
            }
        });
    }),
    () => Config.enableCustomESP
);

registerWhen(
    register("command", (...args) => {
        switch (args[0]) {
            case "add":
                break;
            case "remove":
                break;
            case "list":
                break;
            default:
                break;
        }
    }).setName("esp"),
    () => Config.enableCustomESP
);

registerWhen(
    register("renderWorld", () => {
        renders.forEach((entry) => {
            RenderLibV2.drawEspBox(...entry);
        });
    }),
    () => Config.enableCustomESP
);

//For each Island Type
//For each Mob Type
//For each Mob
//=>Config
