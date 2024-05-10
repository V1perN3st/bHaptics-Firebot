"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { enableFeedback, disableFeedback, toggleFeedback, } from "../tact-remote";

export const toggleHaptics: Firebot.EffectType<{
    action: string;
}> = {
    definition: {
        id: "bHaptics:toggle-haptics",
        name: "bHaptics Toggle Haptics",
        description: "Toggle the Haptics to be on or off",
        icon: "fad fa-plug",
        categories: ["common"],
    },
    optionsTemplate: `
        <eos-container header="Action">
            <dropdown-select options="{ toggle: 'Toggle', true: 'Enable', false: 'Disable'}" selected="effect.action"></dropdown-select>
        </eos-container>
    `,
    optionsController: ($scope: any) => {
        if ($scope.effect.action == null) {
            $scope.effect.action = "toggle";
        }
    },
    optionsValidator: () => {
        return [];
    },
    onTriggerEvent: async (event) => {
        if (event.effect.action == "toggle") {
            await toggleFeedback();
        } else if (event.effect.action == "true") {
            await enableFeedback();
        } else if (event.effect.action == "false") {
            await disableFeedback();
        };
        return true;
    },
};