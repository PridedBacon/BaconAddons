/// <reference types="../../CTAutocomplete/asm" />
/// <reference lib="es2015" />

/** @param {IASM} ASM */
export default (ASM) => {
    const { desc, BOOLEAN, OBJECT, JumpCondition } = ASM;

    ASM.injectBuilder(
        "net/minecraft/client/renderer/EntityRenderer",
        "setupFog",
        "(IF)V",
        ASM.At(
            ASM.At.INVOKE(
                "net/minecraft/entity/EntityLivingBase",
                "isPotionActive",
                "(Lnet/minecraft/potion/Potion;)Z"
            )
        )
    )
        .methodMaps({
            func_78468_a: "setupFog",
            func_70644_a: "isPotionActive",
        })
        .instructions(($) => {
            $.array(0, OBJECT, ($) => {}).invokeJS("toggleBlindness");
            const result = $.astore();
            $.aload(result.index);
            $.instanceof("org/mozilla/javascript/Undefined");

            $.ifClause([JumpCondition.TRUE], ($) => {
                $.aload(result.index);
                $.checkcast(BOOLEAN);
                $.invokeVirtual(BOOLEAN, "booleanValue", desc("Z"));
                $.ifClause([JumpCondition.FALSE], ($) => {
                    $.methodReturn();
                });
            });
        })
        .execute();

    /*
    ASM.injectBuilder(
        "net/minecraft/client/renderer/EntityRenderer",
        "setupCameraTransform",
        "(FI)V",
        ASM.At(
            ASM.At.INVOKE(
                "net/minecraft/entity/EntityLivingBase",
                "isPotionActive",
                "(Lnet/minecraft/potion/Potion;)Z"
            )
        )
    )
        .methodMaps({
            func_78479_a: "setupCameraTransform",
            func_70644_a: "isPotionActive",
        })
        .instructions(($) => {
            $.array(0, OBJECT, ($) => {}).invokeJS("toggleNausea");
            const result = $.astore();
            $.aload(result.index);
            $.instanceof("org/mozilla/javascript/Undefined");

            $.ifClause([JumpCondition.TRUE], ($) => {
                $.aload(result.index);
                $.checkcast(BOOLEAN);
                $.invokeVirtual(BOOLEAN, "booleanValue", desc("Z"));
                $.ifClause([JumpCondition.FALSE], ($) => {
                    $.methodReturn();
                });
            });
        })
        .execute();
        */
};
