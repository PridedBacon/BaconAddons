import Skyblock from "../../BloomCore/Skyblock";
import Vector3 from "../../BloomCore/utils/Vector3";

const checkingTriggers = []; // [[trigger, func]]
/**
 * Registers and unregisters the trigger depending on the result of the checkFunc. Use with render triggers to reduce lag when they are not being used.
 * @param {() => void} trigger
 * @param {Function} checkFunc
 * @param {String | undefined} [area="All"] - e.g. Dungeon, Garden...
 * @returns
 */
export const MSGPREFIX = "&d[Bacon] &e";

export const registerWhen = (trigger, checkFunc, area = "All") =>
    checkingTriggers.push([trigger.unregister(), checkFunc, area]);

register("step", () => {
    for (let i = 0; i < checkingTriggers.length; i++) {
        let [trigger, func, area] = checkingTriggers[i];
        if (func() && (area === "All" || area == Skyblock.area)) trigger.register();
        else trigger.unregister();
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
    const tMax = thing.map((v, i) => Math.abs((Math.floor(start[i]) + Math.max(step[i], 0) - start[i]) * v));

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
const UrlModuleSourceProvider = Java.type("org.mozilla.javascript.commonjs.module.provider.UrlModuleSourceProvider");
const UrlModuleSourceProviderInstance = new UrlModuleSourceProvider(null, null);
const StrongCachingModuleScriptProviderClass = Java.type(
    "org.mozilla.javascript.commonjs.module.provider.StrongCachingModuleScriptProvider"
);
let StrongCachingModuleScriptProvider = new StrongCachingModuleScriptProviderClass(UrlModuleSourceProviderInstance);
let CTRequire = new JSLoader.CTRequire(StrongCachingModuleScriptProvider);

/**
 * FILEPATH IS RELATIVE TO ./BaconAddons/
 * @param {String} filepath
 * @returns {CTRequire}
 */
export function RequireNoCache(place) {
    StrongCachingModuleScriptProvider = new StrongCachingModuleScriptProviderClass(UrlModuleSourceProviderInstance);
    CTRequire = new JSLoader.CTRequire(StrongCachingModuleScriptProvider);
    return CTRequire("../" + place);
}
