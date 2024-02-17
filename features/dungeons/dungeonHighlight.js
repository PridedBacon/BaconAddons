import Config from "../../config";
import { registerWhen, MSGPREFIX } from "../../utils/utils";
import { EntityArmorStand, EntityEnderman, getEntitySkullTexture } from "../../../BloomCore/utils/Utils";
import RenderLibV2 from "../../../RenderLibV2";

const witherkey =
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzRkYjRhZGZhOWJmNDhmZjVkNDE3MDdhZTM0ZWE3OGJkMjM3MTY1OWZjZDhjZDg5MzQ3NDlhZjRjY2U5YiJ9fX0=";
const bloodkey =
    "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjU2MTU5NWQ5Yzc0NTc3OTZjNzE5ZmFlNDYzYTIyMjcxY2JjMDFjZjEwODA5ZjVhNjRjY2IzZDZhZTdmOGY2In19fQ==";

let currentHighlights = [];

registerWhen(
    register("tick", () => {
        currentHighlights = [];
        World.getAllEntities().forEach((entity) => {
            if (
                entity.getEntity() instanceof EntityEnderman &&
                entity.getName() === "Dinnerbone" &&
                entity.isInvisible()
            ) {
                currentHighlights.push([entity.getX(), entity.getY(), entity.getZ(), 1, 3, 1, 0, 0, 1, 1, false, 3]);
            } else if (
                entity.getEntity() instanceof Java.type("net.minecraft.entity.player.EntityPlayer") &&
                entity.getEntity()?.field_71071_by?.func_70448_g()?.func_82833_r() === "§9Silent Death"
            ) {
                currentHighlights.push([entity.getX(), entity.getY(), entity.getZ(), 1, 2, 1, 1, 0, 0, 1, false, 3]);
            } else if (entity.getEntity() instanceof EntityArmorStand && !entity.getEntity().func_181026_s()) {
                const skull = getEntitySkullTexture(entity);
                if (skull === witherkey || skull === bloodkey)
                    currentHighlights.push([
                        entity.getX(),
                        entity.getY() + 1,
                        entity.getZ(),
                        1.5,
                        1.5,
                        1.5,
                        0,
                        0,
                        0,
                        1,
                        true,
                        5,
                    ]);
            }
        });
    }),
    () => Config.enableDungeonHighlight,
    "Dungeon"
);

registerWhen(
    register("renderWorld", () => {
        currentHighlights.forEach((entry) => RenderLibV2.drawEspBoxV2(...entry));
    }),
    () => Config.enableDungeonHighlight,
    "Dungeon"
);
