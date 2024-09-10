import Config from "../../config";
import {
    registerWhen,
    MSGPREFIX,
    isPlayerBoundingBoxInAABB,
    isPlayerBoundingBoxInBlock,
    isHoldingFarmingTool,
    addTwoArrays,
    essentialNotification,
    deepMerge,
} from "../../utils/utils";
import request from "../../../requestV2";

const File = java.io.File;

new File("config/ChatTriggers/modules/BaconAddons/data/farmingMacros").mkdirs();

const directionToIndex = {
    FORWARD: 0,
    BACKWARD: 2,
    LEFT: 3,
    RIGHT: 1,
};

const keys = {
    FORWARD: new KeyBind(Client.getMinecraft().field_71474_y.field_74351_w),
    BACKWARD: new KeyBind(Client.getMinecraft().field_71474_y.field_74368_y),
    LEFT: new KeyBind(Client.getMinecraft().field_71474_y.field_74370_x),
    RIGHT: new KeyBind(Client.getMinecraft().field_71474_y.field_74366_z),
    CLICK: new KeyBind(Client.getMinecraft().field_71474_y.field_74312_F),
};

let originalSensitivity = -1;

let isEnabled = false;
let currentTask = "";
let timeout = 0;
let lastActionSwitch = 0;
let macroConfig = {};

let initialYaw = 0;
let initialPitch = 0;
let pestNotified = false;
let visitorNotified = false;
let contestNotified = false;

let isFlying = false;

const macroTasks = register("tick", () => {
    if (Client.isInGui()) return;

    if (Player.isFlying() && !isFlying) {
        isFlying = true;

        for (let key of Object.values(keys)) {
            key.setState(false);
        }
    } else if (!Player.isFlying()) isFlying = false;

    if (!Player.getPlayer().field_70122_E) return;

    if (
        Math.abs(initialYaw - Player.getYaw()) > 0.5 ||
        Math.abs(initialPitch - Player.getPitch()) > 0.5
    ) {
        Client.scheduleTask(30, () => disableMacro("&4&lDetected camera movement!"));
    }

    if (timeout > 0) return --timeout;

    if (isPlayerBoundingBoxInBlock()) {
        ChatLib.chat(MSGPREFIX + "Stuck in Block! Walking out of it!");
        timeout = 10;

        //TODO: Not hardcode this
        const keyPresses = macroConfig[currentTask]["KEYPRESSES"];
        keys["CLICK"].setState(false);

        if (keyPresses["FORWARD"]) {
            keys["BACKWARD"].setState(true);
            keys["FORWARD"].setState(false);
        }
        if (keyPresses["BACKWARD"]) {
            keys["FORWARD"].setState(true);
            keys["BACKWARD"].setState(false);
        }

        if (keyPresses["LEFT"]) {
            keys["RIGHT"].setState(true);
            keys["LEFT"].setState(false);
        }
        if (keyPresses["RIGHT"]) {
            keys["LEFT"].setState(true);
            keys["RIGHT"].setState(false);
        }
    }

    const nextTask = getNextTask(currentTask);
    if (currentTask !== nextTask && lastActionSwitch < Date.now() - 300) {
        if (Date.now() - lastActionSwitch < macroConfig[currentTask]["MINIMUM_TIME"] * 1000) {
            disableMacro("&4&lDetected an obstacle sooner than the minimum time!");
        }

        timeout = Math.ceil(macroConfig[currentTask]["SLEEP"] * 20);
        currentTask = nextTask;
        lastActionSwitch = Date.now();

        return; //ChatLib.chat(MSGPREFIX + `Now executing &a${nextTask}&e!`);
    }

    for (let keyName of Object.keys(macroConfig[currentTask]["KEYPRESSES"])) {
        let key = keys[keyName];
        let state = macroConfig[currentTask]["KEYPRESSES"][keyName];
        if (key.isKeyDown() !== state) {
            //ChatLib.chat(`Toggling Key ${key.description} to ${state}`);
            key.setState(state);
        }
    }
}).unregister();

function getNextTask(currentTask) {
    const nextTask = macroConfig[currentTask]["NEXT"];

    const [pX, pY, pZ] = [Player.getX(), Player.getY(), Player.getZ()];
    const yaw = Player.getYaw();

    const blockCoords = [
        [pX + 0.6, pY, pZ], // East / +X
        [pX, pY, pZ + 0.6], // South / +Z
        [pX - 0.6, pY, pZ], // West / -X
        [pX, pY, pZ - 0.6], // North / -Z
    ];

    let blockIndex;

    if (yaw >= -135 && yaw < -45) blockIndex = 0;
    else if (yaw >= -45 && yaw < 45) blockIndex = 1;
    else if (yaw >= -45 && yaw < 135) blockIndex = 2;
    else blockIndex = 3;

    let shouldSwitchTask = Object.keys(directionToIndex)
        .filter(
            (dir) =>
                macroConfig[currentTask]["KEYPRESSES"][dir] &&
                !macroConfig[currentTask]["IGNORE"].includes(dir)
        )
        .every((dir) => {
            let coord = blockCoords[(blockIndex + directionToIndex[dir]) % 4];
            let pushedCoord = addTwoArrays(coord, [0, 0.501, 0]);
            return isPlayerBoundingBoxInBlock(pushedCoord, pushedCoord, [42]);
        });

    shouldSwitchTask =
        shouldSwitchTask ||
        Object.keys(directionToIndex)
            .filter(
                (dir) =>
                    macroConfig[currentTask]["KEYPRESSES"][dir] &&
                    !macroConfig[currentTask]["IGNORE"].includes(dir)
            )
            .every((dir) => {
                let coord = blockCoords[(blockIndex + directionToIndex[dir]) % 4];
                let blockCoord = addTwoArrays(coord, [0, 1.8, 0]);
                return isPlayerBoundingBoxInBlock(blockCoord, coord, [42]);
            });

    return shouldSwitchTask ? nextTask : currentTask;
}

register("worldLoad", () => disableMacro());

let teleportAlreadyDetected = false;
let willTeleportSoon = false;

registerWhen(
    register("tick", () => {
        if (Math.abs(Player.getX()) > 240 || Math.abs(Player.getZ()) > 240) {
            if (teleportAlreadyDetected) return;
            teleportAlreadyDetected = true;
            if (willTeleportSoon || !isHoldingFarmingTool()) return;

            willTeleportSoon = true;

            setTimeout(() => {
                currentTask = Object.keys(macroConfig)[0];

                ChatLib.chat(MSGPREFIX + "Teleporting to Garden!");
                ChatLib.command("warp garden");

                willTeleportSoon = false;
            }, Config.autoGardenTPdelay * 1000);
        } else teleportAlreadyDetected = false;
    }),
    () => Config.enableAutoGardenTP || isEnabled,
    "Garden"
);

let lastMacroName = "";

export function enableMacro(name) {
    if (name === lastMacroName) {
        disableMacro();
        return true;
    }

    const file_content = FileLib.read("BaconAddons", `data/farmingMacros/${name}.json`);

    if (!file_content) {
        return new File("config/ChatTriggers/modules/BaconAddons/data/farmingMacros")
            .list()
            .filter((e) => e.toLowerCase().endsWith(".json"));
    }

    ChatLib.command("setspawnlocation");

    if (Client.settings.getSettings().field_74341_c > 0)
        originalSensitivity = Client.settings.getSettings().field_74341_c;

    Client.settings.getSettings().field_74341_c = -(1 / 3);

    lastMacroName = name;

    macroConfig = JSON.parse(file_content);
    for (let key in macroConfig) {
        macroConfig[key] = deepMerge(
            {
                KEYPRESSES: {
                    FORWARD: false,
                    BACKWARD: false,
                    LEFT: false,
                    RIGHT: false,
                    CLICK: false,
                },
                MINIMUM_TIME: 0,
                SLEEP: 0,
                IGNORE: [],
            },
            macroConfig[key]
        );
    }
    //Proper taskname and NEXT are required

    currentTask = Object.keys(macroConfig)[0];
    initialYaw = Player.getYaw();
    initialPitch = Player.getPitch();
    pestNotified = false;
    visitorNotified = false;
    contestNotified = false;

    const tab = TabList.getNames().map((e) => e.removeFormatting().trim());

    const alivePests = parseInt(
        tab
            .find((e) => e.includes("Alive:"))
            ?.split(" ")
            ?.pop()
    );
    const spawnedVisitors = parseInt(
        tab.find((e) => e.includes("Visitors:"))?.match(/Visitors: \((\d)\)/)[1]
    );
    const nextContest = 3600 - (~~(Date.now() / 1000 - 900) % 3600);

    if (spawnedVisitors >= Config.discordPingMinVisitors) {
        visitorNotified = true;
        ChatLib.chat(MSGPREFIX + `There are already &a${spawnedVisitors} Visitors &eon your Garden!`);
    }

    if (alivePests >= Config.discordPingMinPests) {
        pestNotified = true;
        ChatLib.chat(MSGPREFIX + `There are already &6${alivePests} Pests &eon your Garden!`);
    }

    if (parseInt(Config.discordPingTimeContest) >= nextContest) {
        contestNotified = true;
        ChatLib.chat(MSGPREFIX + `There is a contest starting in &b${nextContest}s&e!`);
    }

    setTimeout(() => {
        isEnabled = true;
        macroTasks.register();
    }, 400);
}

export function disableMacro(panikReason = null) {
    if (isEnabled) {
        macroTasks.unregister();
        isEnabled = false;
        lastMacroName = "";

        Client.settings.getSettings().field_74341_c = originalSensitivity;

        for (let key of Object.values(keys)) {
            key.setState(false);
        }

        if (panikReason) {
            ChatLib.chat(MSGPREFIX + panikReason);

            new Thread(() => {
                for (let i = 0; i < 20; i++) {
                    World.playSound("mob.blaze.hit", 10, 1.5);
                    Thread.sleep(150);
                }
            }).start();

            essentialNotification("BaconAddons", panikReason, 10);

            console.log("Posting Warning to Discord!");

            postToDiscord(`# 🚨⚠️ ${panikReason} ⚠️🚨`);
        }

        ChatLib.chat(MSGPREFIX + "Disabled current Macro!");
    }
}

function postToDiscord(messageContent) {
    if (Config.discordID && Config.discordWebhookURL) {
        request({
            url: Config.discordWebhookURL,
            method: "POST",
            body: {
                content: `<@${Config.discordID}>\n` + messageContent.replace(/&\w/g, ""),
            },
            headers: {
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        }).catch((err) => console.log(err));
    }
}

const pestsToReduction = {
    1: "0",
    2: "0",
    3: "0",
    4: "5",
    5: "15",
    6: "30",
    7: "50",
    8: "75",
};

registerWhen(
    register("step", () => {
        const tab = TabList.getNames().map((e) => e.removeFormatting().trim());

        if (!pestNotified && Config.discordPingMinPests !== 0) {
            const alive = parseInt(
                tab
                    .find((e) => e.includes("Alive:"))
                    ?.split(" ")
                    ?.pop()
            );

            if (alive >= Config.discordPingMinPests) {
                //No need for NaN check
                pestNotified = true;
                console.log("Posting Pests to Discord!");
                postToDiscord(
                    `# ${alive} Pests are on your Garden!\n## Farming Fortune is reduced by ${pestsToReduction[alive]}%`
                );
            }
        }

        if (!visitorNotified && Config.discordPingMinVisitors !== 0) {
            const visitorsAmount = parseInt(
                tab.find((e) => e.includes("Visitors:"))?.match(/Visitors: \((\d)\)/)[1]
            );

            if (visitorsAmount >= Config.discordPingMinVisitors) {
                //No need for NaN check
                const visitorAmountTabIndex = tab.findIndex((e) => /Visitors: \(\d\)/.test(e));

                let visitors = [];
                if (visitorAmountTabIndex !== -1) {
                    tab.slice(
                        visitorAmountTabIndex + 1,
                        visitorAmountTabIndex + visitorsAmount + 1
                    ).forEach((e) => visitors.push(e));
                }

                visitorNotified = true;
                console.log("Posting Visitors to Discord!");
                postToDiscord(
                    `# ${visitorsAmount} Visitors are on your Garden!\n**Visitors:**\n\`\`\`\n- ${visitors.join(
                        "\n- "
                    )}\`\`\``
                );
            }
        }

        const discordPingTimeContest = parseInt(Config.discordPingTimeContest);
        const secondsUntilContest = 3600 - (~~(Date.now() / 1000 - 900) % 3600);

        if (
            !contestNotified &&
            !isNaN(discordPingTimeContest) &&
            discordPingTimeContest !== 0 &&
            secondsUntilContest <= discordPingTimeContest
        ) {
            const upcoming = tab
                .filter((e) => e.match(/^([☘○]) ([\w ]*)/))
                .filter((e) => !!e)
                .map((e) => {
                    let match = e.match(/^([☘○]) ([\w ]*)/);
                    return {
                        crop: match[2],
                        bonus: match[1] === "☘",
                    };
                });

            contestNotified = true;
            console.log("Posting Contest to Discord!");
            postToDiscord(
                `# A Farming contest is about to start in ${secondsUntilContest}s\n**Crops:**\n${upcoming
                    .map(({ crop, bonus }) =>
                        "* &CROP&".replace("CROP", crop).replace(/&/g, bonus ? "**" : "")
                    )
                    .join("\n")}`
            );
        } else if (contestNotified && secondsUntilContest > discordPingTimeContest) {
            contestNotified = false;
        }
    }).setFps(1),
    () => isEnabled,
    "Garden"
);

registerWhen(
    register("chat", (player) => {
        disableMacro(`&6&l${player} &4&lis visiting your Garden!`);
    }).setCriteria(/\[SkyBlock\] (.*) is visiting Your Garden!/),
    () => isEnabled,
    "Garden"
);

const disableMacroKey = new KeyBind("Disable current Macro", Keyboard.KEY_NONE, "§dBaconAddons");
disableMacroKey.registerKeyPress(() => disableMacro());

register("gameLoad", () => {
    if (Client.settings.getSettings().field_74341_c > 0)
        originalSensitivity = Client.settings.getSettings().field_74341_c;
});

register("gameUnload", () => {
    if (isEnabled && originalSensitivity > 0)
        Client.settings.getSettings().field_74341_c = originalSensitivity;
});

//Doesn't Work ??
