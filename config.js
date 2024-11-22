import {
    Color,
    @ButtonProperty,
    @CheckboxProperty,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty,
    @NumberProperty,
    @ParagraphProperty,
    @DecimalSliderProperty,
} from "../Vigilance/index";

import { essentialNotification } from "./utils/utils";

const Desktop = java.awt.Desktop;
const File = java.io.File;

@Vigilant("BaconAddonsData", "BaconAddons", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Dungeons", "Garden", "ESP", "Misc"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
})
class Config {
    constructor() {
        this.initialize(this);

        this.addDependency("Force Superbounce", "Automatic Lava Superbounce");
        this.addDependency("Triggerbot Shift Behaviour", "Enable Chest & Lever Triggerbot");
        this.addDependency(
            "Autostonk/Slice Blocks when Triggerbot could fire",
            "Enable Chest & Lever Triggerbot"
        );
        this.addDependency("Pest Box Color", "Highlight pests");
        this.addDependency("Harp Solver Delay", "Enable Harp Solver");
        // this.addDependency("Teleport Delay", "Auto tp Garden on void");
    }

    //----------General----------
    //Party Commands Toggle
    @SwitchProperty({
        name: "Enable Party Commands",
        description: "Enable Party Commands for party members e.g. !warp => /p warp",
        category: "General",
        subcategory: "Chat",
    })
    enablePartyCommands = false;

    //Slot For Instant Ghost Pick Command
    @SelectorProperty({
        name: "Default Slot for Ghost Pick Command",
        description:
            "Select the slot for the Ghost Pick to be created in\nGeneral Usage: /gpick <slot>[1-9] <tool> <EffiLVL>[0-127]",
        category: "Dungeons",
        subcategory: "Ghost Pick",
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    })
    ghostPickSlot = 6;

    //Default Efficiency Level
    @SelectorProperty({
        name: "Default Efficiency Level for Ghost Pick",
        description:
            "Select the Efficiency Level for the Ghost Pick\nGeneral Usage: /gpick <slot>[1-9] <tool> <EffiLVL>[0-127]",
        category: "Dungeons",
        subcategory: "Ghost Pick",
        options: ["0", "6", "10", "12", "127"],
    })
    ghostPickEffiLVL = 3;

    //Auto-Mode Default
    @SwitchProperty({
        name: "Auto-Mode as default Tool-Mode",
        description:
            "Automatically creates the most usefull item by default, instead of just the pickaxe",
        category: "Dungeons",
        subcategory: "Ghost Pick",
    })
    ghostPickDefaultAutoMode = true;

    //Automatically Stonk Predevice
    @SwitchProperty({
        name: "Automatically Pre-Stonk Predevice",
        description: "Automatically creates Ghostblocks for Predevice on Portal entry",
        category: "Dungeons",
        subcategory: "F7",
    })
    StonkF7Predevice = false;

    //Automatic Lava Superbounce
    @SwitchProperty({
        name: "Automatic Lava Superbounce",
        description: "Automatically places a chest under you if you sneak, so you always superbounce",
        category: "Dungeons",
        subcategory: "F7",
    })
    enableAutoSuperbounce = false;

    @SwitchProperty({
        name: "Force Superbounce",
        description: "Will always work in F7",
        category: "Dungeons",
        subcategory: "F7",
    })
    superbounceForceToggle = false;

    //Ghost Key
    @SwitchProperty({
        name: "Enable Ghostblock Keybind",
        description: "Automatically creates Ghostblocks while pressing the Key (MC Settings)",
        category: "Dungeons",
    })
    enableGhostBlockKeybind = false;

    //Ghost Key
    @SwitchProperty({
        name: "Create Ghostblocks on break",
        description: "Replaces the reappearing Block with air",
        category: "Dungeons",
    })
    enableBreakGhostblock = false;

    //Triggerbot
    //Enable
    @SwitchProperty({
        name: "Enable Chest & Lever Triggerbot",
        description: "Automatically clicks on Chests and Levers once",
        category: "Dungeons",
        subcategory: "Triggerbot",
    })
    enableTriggerBot = false;

    //Shift Behavior [Requires/Blocks/Nothing]
    @SelectorProperty({
        name: "Triggerbot Shift Behaviour",
        description: "If the Triggerbot should fire when (not) sneaking",
        category: "Dungeons",
        subcategory: "Triggerbot",
        options: ["Always", "Click when no GUI", "Requires Sneak", "Supress while Sneaking"],
    })
    triggerbotShiftBehaviour = 1;

    //AutoStonk thru walls
    @SwitchProperty({
        name: "Autostonk/Slice Blocks when Triggerbot could fire",
        description: "Automatically create Ghostblocks if there is a Chest behind a wall",
        category: "Dungeons",
        subcategory: "Triggerbot",
    })
    triggerbotAutostonk = false;

    //Dungeon Highlight
    @SwitchProperty({
        name: "Dungeon Highlight",
        description:
            "Highlights certain Entitys in Dungeons like:\n - Fels\n - Shadow Assassins\n - Wither & Blood Keys",
        category: "Dungeons",
        subcategory: "Highlight",
    })
    enableDungeonHighlight = false;

    //AutoStonk thru walls
    @SwitchProperty({
        name: "Replace Stairs with slabs",
        description: "Funni feature nobody asked for",
        category: "Dungeons",
        subcategory: "Useless",
    })
    enableAutoStair = false;

    //----------Garden----------

    @SwitchProperty({
        name: "Highlight pests",
        description: "Toggle ESP for Pests",
        category: "Garden",
        subcategory: "Pests",
    })
    highlightPests = false;

    @ColorProperty({
        name: "Pest Box Color",
        description: "Color of the Box around the Pest",
        category: "Garden",
        subcategory: "Pests",
    })
    colorPestHighlight = Color.WHITE;

    @SwitchProperty({
        name: "Auto tp Garden on void",
        description:
            "Automatically teleports you to your Garden Spawnpoint when falling into the void while holding a farming tool",
        category: "Garden",
        subcategory: "Farming",
    })
    enableAutoGardenTP = false;

    @DecimalSliderProperty({
        name: "Teleport Delay",
        description: "The Delay after which to teleport the player",
        category: "Garden",
        subcategory: "Farming",
        minF: 0.0,
        maxF: 3.0,
        decimalPlaces: 2,
    })
    autoGardenTPdelay = 1.00;

    @ButtonProperty({
        name: "Open Farming Macros Folder",
        description: "Opens '.../BaconAddons/data/farmingMacros'",
        category: "Garden",
        subcategory: "Macro",
        placeholder: "Open",
    })
    openMacrosFolder() {
        Desktop.getDesktop().open(
            new File("config/ChatTriggers/modules/BaconAddons/data/farmingMacros")
        );
    }

    @ButtonProperty({
        name: "Toggle 'Pause on lost Focus'",
        description: "Toggle the 'Pause on lost Focus' Behaviour (or just press F3+P)",
        category: "Garden",
        subcategory: "Macro",
        placeholder: "Toggle",
    })
    togglePauseOnLostFocus() {
        Client.getSettings().getSettings().field_82881_y =
            !Client.getSettings().getSettings().field_82881_y;
        essentialNotification(
            "BaconAddons",
            `${
                Client.getSettings().getSettings().field_82881_y ? "Enabled" : "Disabled"
            } Pause on lost Focus`
        );
    }

    @TextProperty({
        name: "Discord ID",
        description:
            "The discord ID to ping when a macro auto-disables.\nLeave empty to disable\n&cThis has to be the ID not username!",
        category: "Garden",
        subcategory: "Macro",
    })
    discordID = "";

    @TextProperty({
        name: "Discord Webhook URL",
        description:
            "The discord Webhook URL to post to when a macro auto-disables.\nLeave empty to disable",
        category: "Garden",
        subcategory: "Macro",
    })
    discordWebhookURL = "";

    @SliderProperty({
        name: "Ping when too many Pests",
        description: "How many pests are required to ping.\nSet to 0 to disable",
        category: "Garden",
        subcategory: "Macro",
        min: 0,
        max: 8,
    })
    discordPingMinPests = 0;

    @SliderProperty({
        name: "Ping when too many Visitors",
        description: "How many visitors are required to ping.\nSet to 0 to disable",
        category: "Garden",
        subcategory: "Macro",
        min: 0,
        max: 5,
    })
    discordPingMinVisitors = 0;

    @TextProperty({
        name: "Ping when close to a contest",
        description: "How many seconds before a contest start to ping.\nLeave empty to disable",
        category: "Garden",
        subcategory: "Macro",
    })
    discordPingTimeContest = "";

    //----------MISC----------

    /*
    @SwitchProperty({
        name: "Disable Blindness",
        description: "Disables the Blindness Fog\n&cNOTE: You need to disable Fog &e(Options > Video Settings > Details > Fog) &cusing Optifine for this to work!\n&cNOTE: You cant sprint as you still have the actual effect!\n&4WARNING: MAY CAUSE RARE GRAPHICAL GLITCHES!",
        category: "Misc",
        subcategory: "Camera"
    })
    ASMdisableBlindness = false
    */

    @SwitchProperty({
        name: "Disable Nausea",
        description: "Removes Nausea from the Player",
        category: "Misc",
        subcategory: "Camera",
    })
    disableNausea = false;

    @SwitchProperty({
        name: "Enable Trapper ESP",
        description: "Tries to display ESP on the Mob\nSometimes Displays other People's/Glitched Mobs",
        category: "Misc",
        subcategory: "Trapper",
    })
    enableTrapperHelper = false;

    @SwitchProperty({
        name: "Enable Dragon Features",
        description: "Misc Dragon/End Features",
        category: "Misc",
        subcategory: "End",
    })
    enableDragonFeatures = false;

    //Harp Solver
    @SwitchProperty({
        name: "Enable Harp Solver",
        description: "Automatically clicks in the Harp",
        category: "Misc",
        subcategory: "Harp",
    })
    enableHarpSolver = false;

    @SliderProperty({
        name: "Harp Solver Delay",
        description: "Set the Click delay in Ticks for the Harp",
        category: "Misc",
        subcategory: "Harp",
        min: 0,
        max: 5,
    })
    clickDelayHarpSolver = 2;

    @SwitchProperty({
        name: "Chat Protection",
        description: "Prevents you from sending messages contaning the words (m)acr(o) and bac\nIf you send a command, this filter is ignored",
        category: "General",
        subcategory: "Chat",
    })
    enableChatProtection = true;

    @SwitchProperty({
        name: "Primal Fear Helper",
        description: "Automatically sends/clicks the right chat message",
        category: "General",
        subcategory: "Chat",
    })
    enablePrimalFearHelper = false;
}

export default new Config();
