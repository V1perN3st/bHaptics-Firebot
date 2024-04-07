"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { submitPath } from "../tact-remote";

export const submitPathEffect: Firebot.EffectType<{}> = {
    definition: {
        id: "bHaptics:submit-path",
        name: "bHaptics Submit Path Pattern",
        description: "Submit a Path Pattern to be played on specific devices",
        icon: "fad fa-braille",
        categories: ["common"],
    },
    optionsTemplate: `
    <eos-container>
      <div class="effect-info alert alert-warning">
        <b>Warning!</b> WIP and does not work.
      </div>
    </eos-container>
  `,
    optionsController: () => {
    },
    optionsValidator: () => {
        return [];
    },
    onTriggerEvent: async () => {
        return true;
    },
};