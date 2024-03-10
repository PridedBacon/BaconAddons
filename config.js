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


    //Carpet Remover Toggle
    //@SwitchProperty({
    //    name: "Anti Carpet - Force Disabled!",
    //    description: "Removes Carpets near you, so you get laggedback less",
    //    category: "General",
    //    subcategory: "Lagback"
    //})
    enableAntiCarpets = false



    //----------Dungeons----------

    //Auto Terms
    //@SwitchProperty({
    //    name: "Enable Auto Terms",
    //    description: "Automatically Clicks in Terminals",
    //    category: "Dungeons",
    //    subcategory: "Auto Terms"
    //})
    enableAutoTerms = false
    
    
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


    //@SwitchProperty({
    //    name: "Block Interactions on some Blocks",
    //    description: "Blocks Interaction with some blocks to allow etherwarping (e.g. hopper)",
    //    category: "Dungeons",
    //})
    enableInteractionStop = false



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




    //Dungeon Routes Config
    //@ButtonProperty({
    //    name: "Dungeon Routes Config",
    //    description: "Settings for Dungeon Routes",
    //    category: "Dungeons",
    //    subcategory: "Dungeon Routes",
    //    placeholder: "Settings"
    //})
    openDungeonRoutesConfig() {
        dungeonRoutesConfig.openGUI()
    };
    

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



    //----------ESP----------
    //@SwitchProperty({
    //    name: "Enable Custom ESP",
    //    description: "Lets you set custom ESP's",
    //    category: "ESP",
    //})
    enableCustomESP = false

    //ESP Config
    //@ButtonProperty({
    //    name: "Custom ESP Config",
    //    description: "Settings for Custom ESP",
    //    category: "ESP",
    //    placeholder: "Settings"
    //})
    openCustomESPConfig() {
        //gui.openGUI()
    };



    //----------MISC----------


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




@Vigilant("BaconAddons", "Dungeon Routes", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Render"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class DungeonRoutesConfig {
    constructor() {
        this.initialize(this)
    }



    //Dungeon Routes Toggle
    @SwitchProperty({
        name: "Dungeon Routes Toggle",
        description: "Enable Dungeon Routes",
        category: "Dungeons"
    })
    enableDungeonRoutes = false




    @SwitchProperty({
        name: "Hide Walk Locations",
        description: "Hides Walking location lines, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideLocations = false
    @SwitchProperty({
        name: "Hide Etherwarps",
        description: "Hides Etherwarp markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideEtherwarps = false
    @SwitchProperty({
        name: "Hide Stonks",
        description: "Hides Stonk markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideMines = false
    @SwitchProperty({
        name: "Hide Interacts",
        description: "Hides Interact markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideInteracts = false
    @SwitchProperty({
        name: "Hide TNTs",
        description: "Hides TNT markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideTNTs = false
    @SwitchProperty({
        name: "Hide Items",
        description: "Hides Item markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideItems = false
    @SwitchProperty({
        name: "Hide Bats",
        description: "Hides Bat markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideBats = false
    @SwitchProperty({
        name: "Hide Pearls",
        description: "Hides all Pearl markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hidePearls = false
    @SwitchProperty({
        name: "Hide Sinseekers",
        description: "Hides Sinseeker markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideSinseekers = false
    @SwitchProperty({
        name: "Hide Shadowfurys",
        description: "Hides Shadowfury markers, but still does the logic",
        category: "Render",
        subcategory: "Marker Rendering"
    })
    hideShadowfury = false



    @ColorProperty({
        name: "Location Line/Arrow Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorLocation = Color.CYAN;
    @ColorProperty({
        name: "Etherwarp Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorEtherwarp = Color.BLUE;
    @ColorProperty({
        name: "Stonk Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorMine = Color.MAGENTA;
    @ColorProperty({
        name: "Interact Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorInteract = Color.GREEN;
    @ColorProperty({
        name: "TNT Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorTNT = Color.RED;
    @ColorProperty({
        name: "Item Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorItem = Color.PINK;
    @ColorProperty({
        name: "Bat Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorBat = Color.ORANGE;
    @ColorProperty({
        name: "Pearl Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorPearl = Color.BLUE;
    @ColorProperty({
        name: "Sinseeker Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorSinseeker = Color.YELLOW;
    @ColorProperty({
        name: "Shadowfury Marker Color",
        category: "Render",
        //description: "",
        subcategory: "Colors",
    })
    colorEtherwarp = Color.WHITE;

}


export const dungeonRoutesConfig = new DungeonRoutesConfig()


export default new Config();