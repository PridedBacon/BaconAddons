import Config from "../../config";
import RenderLibV2 from "../../../RenderLibV2/index";
import { registerWhen } from "../../utils/utils";

const pest_regex = /\xA7cൠ [Earthworm|Mite|Beetle|Locust|Slug|Rat|Moth|Mosquito|Cricket|Fly]/;
let pestEntity = [];

registerWhen(
    register("tick", () => {
        World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach((name) => {
            let Name = name.getName();
            let nameRemoveFormat = Name.removeFormatting();
            if (pest_regex.test(Name)) {
                if (!pestEntity?.map((a) => a.getUUID().toString()).includes(name.getUUID().toString())) {
                    pestEntity.push(name);
                }

                return;
            }
        });
        pestEntity = pestEntity.filter((e) => !e.getEntity()["field_70128_L"]);
    }),
    () => Config.highlightPests,
    "Garden"
);
registerWhen(
    register("renderWorld", () => {
        pestEntity.forEach((e) => {
            RenderLibV2.drawEspBoxV2(
                e.getX(),
                e.getY() - 0.375,
                e.getZ(),
                0.75,
                0.75,
                0.75,
                ...Object.values(RenderLibV2.getColor(Config.colorPestHighlight)),
                true,
                3
            );
            RenderLibV2.drawInnerEspBoxV2(
                e.getX(),
                e.getY() - 0.375,
                e.getZ(),
                0.75,
                0.75,
                0.75,
                ...Object.values(RenderLibV2.getColor(Config.colorPestHighlight)),
                true
            );
        });
    }),
    () => Config.highlightPests,
    "Garden"
);
