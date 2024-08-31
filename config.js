import {
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
    Color
} from '../Vigilance/index';



@Vigilant("BaconAddons", "BaconAddons", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Dungeons", "Garden", "ESP", "Misc"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Config {
    constructor() {
        this.initialize(this)

        this.addDependency("Force Superbounce", "Automatic Lava Superbounce");
        this.addDependency("Triggerbot Shift Behaviour", "Enable Chest & Lever Triggerbot");
        this.addDependency("Autostonk/Slice Blocks when Triggerbot could fire", "Enable Chest & Lever Triggerbot");
        this.addDependency("Pest Box Color", "Highlight pests");
        this.addDependency("Harp Solver Delay", "Enable Harp Solver")
    }

    

    //----------General----------
    //Party Commands Toggle
    @SwitchProperty({
        name: "Enable Party Commands",
        description: "Enable Party Commands for party members e.g. !warp => /p warp",
        category: "General",
        subcategory: "Chat"
    })
    enablePartyCommands = false
    
    
    //Slot For Instant Ghost Pick Command
    @SelectorProperty({
        name: "Default Slot for Ghost Pick Command",
        description: "Select the slot for the Ghost Pick to be created in\nGeneral Usage: /gpick <slot>[1-9] <tool> <EffiLVL>[0-127]",
        category: "Dungeons",
        subcategory: "Ghost Pick",
        options: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9"
        ]
    })
    ghostPickSlot = 6;

    //Default Efficiency Level
    @SelectorProperty({
        name: "Default Efficiency Level for Ghost Pick",
        description: "Select the Efficiency Level for the Ghost Pick\nGeneral Usage: /gpick <slot>[1-9] <tool> <EffiLVL>[0-127]",
        category: "Dungeons",
        subcategory: "Ghost Pick",
        options: [
            "0",
            "6",
            "10",
            "12",
            "127"
        ]
    })
    ghostPickEffiLVL = 3;

    //Auto-Mode Default
    @SwitchProperty({
        name: "Auto-Mode as default Tool-Mode",
        description: "Automatically creates the most usefull item by default, instead of just the pickaxe",
        category: "Dungeons",
        subcategory: "Ghost Pick"
    })
    ghostPickDefaultAutoMode = true



    //Automatically Stonk Predevice
    @SwitchProperty({
        name: "Automatically Pre-Stonk Predevice",
        description: "Automatically creates Ghostblocks for Predevice on Portal entry",
        category: "Dungeons",
        subcategory: "F7"
    })
    StonkF7Predevice = false

    //Automatic Lava Superbounce
    @SwitchProperty({
        name: "Automatic Lava Superbounce",
        description: "Automatically places a chest under you if you sneak, so you always superbounce",
        category: "Dungeons",
        subcategory: "F7"
    })
    enableAutoSuperbounce = false

    @SwitchProperty({
        name: "Force Superbounce",
        description: "Will always work in F7",
        category: "Dungeons",
        subcategory: "F7"
    })
    superbounceForceToggle = false



    //Ghost Key
    @SwitchProperty({
        name: "Enable Ghostblock Keybind",
        description: "Automatically creates Ghostblocks while pressing the Key (MC Settings)",
        category: "Dungeons",
    })
    enableGhostBlockKeybind = false


    //Ghost Key
    @SwitchProperty({
        name: "Create Ghostblocks on break",
        description: "Replaces the reappearing Block with air",
        category: "Dungeons",
    })
    enableBreakGhostblock = false


    //Triggerbot
    //Enable
    @SwitchProperty({
        name: "Enable Chest & Lever Triggerbot",
        description: "Automatically clicks on Chests and Levers once",
        category: "Dungeons",
        subcategory: "Triggerbot"
    })
    enableTriggerBot = false

    //Shift Behavior [Requires/Blocks/Nothing]
    @SelectorProperty({
        name: "Triggerbot Shift Behaviour",
        description: "If the Triggerbot should fire when (not) sneaking",
        category: "Dungeons",
        subcategory: "Triggerbot",
        options: [
            "Always",
            "Click when no GUI",
            "Requires Sneak",
            "Supress while Sneaking"
        ]
    })
    triggerbotShiftBehaviour = 1;

    //AutoStonk thru walls
    @SwitchProperty({
        name: "Autostonk/Slice Blocks when Triggerbot could fire",
        description: "Automatically create Ghostblocks if there is a Chest behind a wall",
        category: "Dungeons",
        subcategory: "Triggerbot"
    })
    triggerbotAutostonk = false

    

    //Dungeon Highlight
    @SwitchProperty({
        name: "Dungeon Highlight",
        description: "Highlights certain Entitys in Dungeons like:\n - Fels\n - Shadow Assassins\n - Wither & Blood Keys",
        category: "Dungeons",
        subcategory: "Highlight"
    })
    enableDungeonHighlight = false


    //AutoStonk thru walls
    @SwitchProperty({
        name: "Replace Stairs with slabs",
        description: "Funni feature nobody asked for",
        category: "Dungeons",
        subcategory: "Useless"
    })
    enableAutoStair = false


    //----------Garden----------


    @SwitchProperty({
        name: "Highlight pests",
        description: "Toggle ESP for Pests",
        category: "Garden",
        subcategory: "Pests"
    })
    highlightPests = false

    @ColorProperty({
        name: "Pest Box Color",
        description: "Color of the Box around the Pest",
        category: "Garden",
        subcategory: "Pests",
    })
    colorPestHighlight = Color.WHITE;

    @SwitchProperty({
        name: "Auto tp Garden on void",
        description: "Automatically teleports you to your Garden Spawnpoint when falling into the void while holding a farming tool",
        category: "Garden",
        subcategory: "Farming"
    })
    enableAutoGardenTP = false



    //----------MISC----------

    @SwitchProperty({
        name: "Disable Blindness",
        description: "Disables the Blindness Fog\n&cNOTE: You need to disable Fog &e(Options > Video Settings > Details > Fog) &cusing Optifine for this to work!",
        category: "Misc",
        subcategory: "ASM"
    })
    ASMdisableBlindness = false

    @SwitchProperty({
        name: "Enable Trapper Helper",
        description: "Tries to display ESP on the Mob",
        category: "Misc",
        subcategory: "Trapper"
    })
    enableTrapperHelper = false


    @SwitchProperty({
        name: "Enable Dragon Features",
        description: "Misc Dragon/End Features",
        category: "Misc",
        subcategory: "End"
    })
    enableDragonFeatures = false

    //Harp Solver
    @SwitchProperty({
        name: "Enable Harp Solver",
        description: "Automatically clicks in the Harp",
        category: "Misc",
        subcategory: "Harp"
    })
    enableHarpSolver = false


    @SliderProperty({
        name: "Harp Solver Delay",
        description: "Set the Click delay in Ticks for the Harp",
        category: "Misc",
        subcategory: "Harp",
        min: 0,
        max: 5
    })
    clickDelayHarpSolver = 2
}


export default new Config();
