"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { stopAllRegKeys } from "../tact-remote";

export const stopAllRegEffect: Firebot.EffectType<{}> = {
    definition: {
        id: "bHaptics:stop-all-reg",
        name: "bHaptics Stop All Active Keys",
        description: "Stop all Active Keys all at once",
        icon: "fad fa-trash-alt",
        categories: ["common"],
    },
    optionsTemplate: `
    <eos-container>
      <div class="effect-info alert alert-warning">
        <b>Warning!</b> When this effect is activated, Firebot will stop all Active Keys Playing in bHaptics Player.
      </div>
    </eos-container>
  `,
    optionsController: () => {
    },
    optionsValidator: () => {
        return [];
    },
    onTriggerEvent: async () => {
        stopAllRegKeys()
        return true;
    },
};