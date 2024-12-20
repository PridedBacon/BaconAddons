import Skyblock from "../../BloomCore/Skyblock";
import Vector3 from "../../BloomCore/utils/Vector3";
import { getSkullTexture, getSkyblockItemID } from "../../BloomCore/utils/Utils";

export const MSGPREFIX = "&d[Bacon] &e";
export const MSGPREFIX_SHORT = "&d[B] &e";

const checkingTriggers = [];

/**
 * Registers and unregisters the trigger depending on the result of the checkFunc. Use with render triggers to reduce lag when they are not being used.
 * NOTE: Triggers will be executed once a second. For timing based triggers, dont use this!
 * @param {() => void | Array} trigger
 * @param {Function} checkFunc
 * @param {String | Array | undefined} [area="All"] - e.g. Dungeon, Garden...
 * @returns
 */
export const registerWhen = (trigger, checkFunc, area = "All") =>
    checkingTriggers.push([
        trigger?.[Symbol.iterator] ? trigger.map((t) => t.unregister()) : trigger.unregister(),
        checkFunc,
        area,
    ]);

register("step", () => {
    for (let i = 0; i < checkingTriggers.length; i++) {
        let [trigger, func, area] = checkingTriggers[i];
        let areaResult = area;

        if (typeof area === "object")
            areaResult = area.some((entry) => entry === Skyblock.area || entry === "All");
        else areaResult = area === Skyblock.area || area === "All";

        let triggerIterable = trigger?.[Symbol.iterator];

        if (func() && areaResult)
            triggerIterable ? trigger.forEach((t) => t.register()) : trigger.register();
        else triggerIterable ? trigger.forEach((t) => t.unregister()) : trigger.unregister();
    }
}).setFps(1);

/**
 * Quickly traverses the blocks from the start coordinate to the end coordinate.
 * @param {[Number, Number, Number]} start
 * @param {Number} pitch
 * @param {Number} yaw
 * @param {BlockCheckFunction} blockCheckFunc - Will stop traversal if this function returns true.
 * @param {BlockCheckFunction} addCheckFunc - Will only add this block to the path list when it returns true
 * @param {Number} maxrange - Max Range of Blocks to traverse
 * @returns {Number[][] | [Number, Number, Number] | null | Object} - The coordinate(s) as integers, or null if miss.
 */
export const traverseVoxelsUntilFunc = (
    start,
    pitch,
    yaw,
    blockCheckFunc = null,
    addCheckFunc = null,
    maxrange = 10
) => {
    let lookVec = Vector3.fromPitchYaw(pitch, yaw).multiply(128);

    // Ints
    let currentPos = start.map((a) => Math.floor(a));
    let endPos = lookVec.getComponents().map((v, i) => Math.floor(v + start[i]));

    // Make "thing" to etc to for block and not direction
    const direction = endPos.map((v, i) => v - start[i]);
    const step = direction.map((a) => Math.sign(a));
    const thing = direction.map((a) => 1 / a);
    const tDelta = thing.map((v, i) => Math.min(v * step[i], 1));
    const tMax = thing.map((v, i) =>
        Math.abs((Math.floor(start[i]) + Math.max(step[i], 0) - start[i]) * v)
    );

    let path = [];
    let iters = 0;
    while (true && iters < 1000) {
        iters++;

        // Do block check function stuff
        let currentBlock = World.getBlockAt(...currentPos);
        if (blockCheckFunc && blockCheckFunc(currentBlock)) {
            // Return the hit block instead of the entire path
            return {
                blockpos: currentPos,
                path: path,
            };
        }

        // Add the current position to the tarversed path
        if (addCheckFunc && addCheckFunc(currentBlock)) {
            path.push([...currentPos]);
        }

        // End Reached
        if (currentPos.every((v, i) => v == endPos[i])) break;
        if (new Vec3i(...start).distance(new Vec3i(...currentPos)) > maxrange) break;

        // Find the next direction to step in
        let minIndex = tMax.indexOf(Math.min(...tMax));
        tMax[minIndex] += tDelta[minIndex];
        currentPos[minIndex] += step[minIndex];
    }
    return null;
};

export const getBlockBounds = (ctBlock) => {
    const mcBlock = ctBlock.type.mcBlock;
    return [
        mcBlock.func_149704_x(),
        mcBlock.func_149665_z(),
        mcBlock.func_149706_B(),
        mcBlock.func_149753_y(),
        mcBlock.func_149669_A(),
        mcBlock.func_149693_C(),
    ].map((a) => a);
};

let Executors = Java.type("java.util.concurrent.Executors");
export class NonPooledThread {
    constructor(fun) {
        this.fun = fun;
        this.executor = Executors.newSingleThreadExecutor();
    }

    start() {
        this.executor.execute(this.fun);
    }
}

const JSLoader = Java.type("com.chattriggers.ctjs.engine.langs.js.JSLoader");
const UrlModuleSourceProvider = Java.type(
    "org.mozilla.javascript.commonjs.module.provider.UrlModuleSourceProvider"
);
const UrlModuleSourceProviderInstance = new UrlModuleSourceProvider(null, null);
const StrongCachingModuleScriptProviderClass = Java.type(
    "org.mozilla.javascript.commonjs.module.provider.StrongCachingModuleScriptProvider"
);
let StrongCachingModuleScriptProvider = new StrongCachingModuleScriptProviderClass(
    UrlModuleSourceProviderInstance
);
let CTRequire = new JSLoader.CTRequire(StrongCachingModuleScriptProvider);

/**
 * FILEPATH IS RELATIVE TO ./BaconAddons/
 * @param {String} filepath
 * @returns {CTRequire}
 */
export function RequireNoCache(place) {
    StrongCachingModuleScriptProvider = new StrongCachingModuleScriptProviderClass(
        UrlModuleSourceProviderInstance
    );
    CTRequire = new JSLoader.CTRequire(StrongCachingModuleScriptProvider);
    return CTRequire("../" + place);
}

/**
 * Gets the texture property of the skull item which the entity is wearing.
 * @param {Entity} entity - The entity whose skull's texture you want.
 * @returns {String|null}
 */
export const getEntitySkullID = (entity) => {
    if (!entity || !(entity instanceof Entity)) return null;
    let helm = entity.getEntity().func_71124_b(4);
    if (!helm) return null;
    let item = new Item(helm);
    if (!item || item.getID() !== 397 || item.getMetadata() !== 3) return null;
    return item.getNBT()?.toObject()?.tag?.SkullOwner?.Id;
};

const farmingToolsID = new Set([
    "ROOKIE_HOE",
    "BINGHOE",
    "BASIC_GARDENING_HOE",
    "BASIC_GARDENING_AXE",
    "ADVANCED_GARDENING_HOE",
    "ADVANCED_GARDENING_AXE",
    "CACTUS_KNIFE",
    "FUNGI_CUTTER",
    "MELON_DICER",
    "PUMPKIN_DICER",
    "THEORETICAL_HOE_POTATO",
    "THEORETICAL_HOE_CANE",
    "THEORETICAL_HOE_WARTS",
    "THEORETICAL_HOE_CARROT",
    "THEORETICAL_HOE_WHEAT_3",
]);

export const isHoldingFarmingTool = () => {
    const sbid = getSkyblockItemID(Player.getHeldItem());
    if (!sbid) return null;
    const fsbid = RegExp(/(.*?)(?:_\d)?$/).exec(sbid)[1];
    if (!fsbid) return null;
    return farmingToolsID.has(fsbid);
};

const setRotationFunction = Java.type("net.minecraft.entity.Entity").class.getDeclaredMethod(
    "func_70101_b",
    java.lang.Float.TYPE,
    java.lang.Float.TYPE
);
setRotationFunction.setAccessible(true);

export const setLooking = (paramYaw, paramPitch, feedback = true) => {
    const yaw = paramYaw === "~" || !paramYaw ? Player.getYaw() : +paramYaw;
    const pitch = paramPitch === "~" || !paramPitch ? Player.getPitch() : +paramPitch;

    if (isNaN(yaw)) {
        if (feedback) ChatLib.chat(`${MSGPREFIX}Invalid Yaw: &c${paramYaw}`);
        return;
    }
    if (isNaN(pitch)) {
        if (feedback) ChatLib.chat(`${MSGPREFIX}Invalid Pitch: &c${paramPitch}`);
        return;
    }
    if (feedback) ChatLib.chat(`${MSGPREFIX}Setting Rotation to: &a${yaw}&e, &a${pitch}&e!`);

    setRotationFunction.invoke(Player.getPlayer(), new java.lang.Float(yaw), new java.lang.Float(pitch));
};

export function isPlayerBoundingBoxInAABB(aabb, playerPos = null) {
    if (!aabb) return false;

    if (!playerPos) playerPos = [Player.getX(), Player.getY(), Player.getZ()];

    const [pX, pY, pZ] = playerPos;

    const pMaxX = (pX + 0.3 - 0.00000001).toFixed(12);
    const pMaxY = (pY + 1.8 - 0.00000001).toFixed(12);
    const pMaxZ = (pZ + 0.3 - 0.00000001).toFixed(12);
    const pMinX = (pX - 0.3 + 0.00000001).toFixed(12);
    const pMinY = (pY + 0.00000001).toFixed(12);
    const pMinZ = (pZ - 0.3 - 0.00000001).toFixed(12);

    const maxX = aabb.field_72336_d;
    const maxY = aabb.field_72337_e;
    const maxZ = aabb.field_72334_f;
    const minX = aabb.field_72340_a;
    const minY = aabb.field_72338_b;
    const minZ = aabb.field_72339_c;

    if (pMaxX < minX || pMinX > maxX) return false;
    if (pMaxY < minY || pMinY > maxY) return false;
    if (pMaxZ < minZ || pMinZ > maxZ) return false;

    return true;
}

export function isPlayerBoundingBoxInBlock(blockCoords = null, playerPos = null, ignoreIDs = null) {
    if (!blockCoords) blockCoords = [Player.getX(), Player.getY(), Player.getZ()];
    if (!playerPos) playerPos = [Player.getX(), Player.getY(), Player.getZ()];

    const blockCoordsInt = blockCoords.map(Math.floor);

    let block = World.getBlockAt(...blockCoordsInt);

    if (ignoreIDs && ignoreIDs.includes(block.type.getID())) return false;

    let aabb = block.type.mcBlock.func_180640_a(
        World.getWorld(),
        block.pos.toMCBlock(),
        block.getState()
    );
    return isPlayerBoundingBoxInAABB(aabb, playerPos);
}

/**
 * Displays a notification with a custom message and duration.
 *
 * @param {string} title - The title to display in the notification
 * @param {string} message - The message to display in the notification.
 * @param {number} [duration=3] - The duration in seconds for which the notification should be displayed.
 *                                Defaults to 3 seconds.
 * @param {function} [clickFunction=()=>{}] - The function to be executed when the notification is clicked.
 *                                            Defaults to an empty function.
 * @param {function} [closeFunction=()=>{}] - The function to be executed when the notification is closed.
 *                                            Defaults to an empty function.
 */
export function essentialNotification(
    title,
    message,
    duration = 3,
    clickFunction = () => {},
    closeFunction = () => {}
) {
    // Push the notification to the EssentialAPI notifications array
    Java.type("gg.essential.api.EssentialAPI")
        .getNotifications()
        .push(title.toString(), message.toString(), duration, clickFunction, closeFunction);
}

export const addTwoArrays = (arr1, arr2) => {
    const minLength = Math.min(arr1.length, arr2.length);

    const newArray = [];

    for (let i = 0; i < minLength; i++) {
        newArray[i] = arr1[i] + arr2[i];
    }
    return newArray;
};

/**
 * Merge two Objects e.g. deepMerge(defaultValues, input)
 */
export function deepMerge(target, source) {
    for (let key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}
