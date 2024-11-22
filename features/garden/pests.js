import Config from "../../config";
import RenderLibV2 from "../../../RenderLibV2/index";
import { registerWhen, getEntitySkullID } from "../../utils/utils";
import { EntityArmorStand } from "../../../BloomCore/utils/Utils";

const pestSkullIDs = [
    "6b159ec3-fa0b-3049-a0a7-37027bc22968", //Mite
    "8842a457-5e25-3ad0-958e-dfbebbb1129c", //Rat
    "92fde6ff-c0e2-3b24-a24c-89306e02fb97", //Beetle
    "58feded7-33e7-310a-862f-7c4c392e8397", //Cricket
    "b9acc486-f7c7-39ed-9258-d24942e9e8dc", //Mosquito
    "efcda633-c522-38ef-9df9-34dc30c1c2d2", //Slug
    "d4903c23-3dad-3880-900e-d05c1d519497", //Fly
    "61bcdaae-56f5-302e-9f05-11345b9610c9", //Moth
    "1894b3f5-35d5-359d-b74d-370a57c8f175", //Locust
    "5bef72fa-93bb-3e97-8dbe-6595ee7c64b4", //Earthworm

    // "1d2096a5-b4aa-3020-9d5b-975045ea664f", //Earthworm middle
];

let pests = [];

const isPest = (entity) => {
    if (!(entity.getEntity() instanceof EntityArmorStand)) return false;
    let id = getEntitySkullID(entity);
    if (!id) return false;
    return pestSkullIDs.includes(id);
};

registerWhen(
    register("step", () => {
        pests = World.getAllEntitiesOfType(EntityArmorStand.class).filter(isPest);
    }).setFps(8),
    () => Config.highlightPests,
    "Garden"
);
registerWhen(
    register("renderWorld", () => {
        pests.forEach((e) => {
            RenderLibV2.drawInnerEspBoxV2(
                e.getRenderX(),
                e.getRenderY() + 1,
                e.getRenderZ(),
                2,
                2,
                2,
                ...Object.values(RenderLibV2.getColor(Config.colorPestHighlight)),
                true
            );

            RenderLibV2.drawLine(
                Player.getRenderX(),
                Player.getRenderY() + Player.getPlayer().func_70047_e(),
                Player.getRenderZ(),
                e.getRenderX(),
                e.getRenderY() + 2,
                e.getRenderZ(),
                ...Object.values(RenderLibV2.getColor(Config.colorPestHighlight)),
                true,
                4
            );
        });
    }),
    () => Config.highlightPests,
    "Garden"
);
