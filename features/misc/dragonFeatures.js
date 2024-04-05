import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";
import RenderLibV2 from "../../../RenderLibV2/index";

const highlightEntities = new Set(["EntityEnderCrystal", "EntityDragon"]);

let currentHighlight = [];

registerWhen(
    register("tick", () => {
        currentHighlight = [];
        World.getAllEntities().forEach((entity) => {
            if (highlightEntities.has(entity.getClassName())) currentHighlight.push(entity);
        });
    }),
    () => Config.enableDragonFeatures,
    "The End"
);

registerWhen(
    register("renderWorld", () => {
        currentHighlight.forEach((entity) => {
            switch (entity.getClassName()) {
                case "EntityDragon":
                    RenderLibV2.drawEspBoxV2(
                        entity.getRenderX(),
                        entity.getRenderY(),
                        entity.getRenderZ(),
                        16,
                        8,
                        16,
                        1,
                        121 / 255,
                        0,
                        1,
                        true,
                        3
                    );
                    RenderLibV2.drawEspBoxV2(
                        entity.getRenderX(),
                        entity.getRenderY(),
                        entity.getRenderZ(),
                        16,
                        8,
                        16,
                        1,
                        1,
                        1,
                        1,
                        false,
                        5
                    );
                case "EntityEnderCrystal":
                    RenderLibV2.drawEspBoxV2(
                        entity.getX(),
                        entity.getY(),
                        entity.getZ(),
                        2,
                        2,
                        2,
                        121 / 255,
                        0,
                        0,
                        1,
                        true,
                        3
                    );
                    RenderLibV2.drawEspBoxV2(
                        entity.getX(),
                        entity.getY(),
                        entity.getZ(),
                        2,
                        2,
                        2,
                        121 / 255,
                        0,
                        121 / 255,
                        1,
                        false,
                        5
                    );
            }
        });
    }),
    () => Config.enableDragonFeatures,
    "The End"
);
