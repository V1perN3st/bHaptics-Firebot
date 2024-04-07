"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { RegisteredKeysVariable } from "../types"
import { stopRegKeys } from "../tact-remote";

export const stopRegEffect: Firebot.EffectType<{
    regKey: string;
} > = {
    definition: {
        id: "bHaptics:stop-reg-key",
        name: "bHaptics Stop a Registered Key",
        description: "Stop a specific active registered Key",
        icon: "fad fa-eraser",
        categories: ["common"],
    },
    optionsTemplate: `
        <eos-container header="Stop Registered Key">
          <ui-select ng-model="selected" on-select="selectRegKey($select.selected.regKey)" theme="bootstrap">
            <ui-select-match placeholder="Select a Reg Key...">{{$select.selected.regKey}}</ui-select-match>
            <ui-select-choices repeat="keys in keyCollections | filter: {regKey: $select.search}">
                <div ng-bind-html="keys.regKey | highlight: $select.search""></div>
            </ui-select-choices>
          </ui-select>
          <p style="margin-top:3px">
            <span class="muted">This effect will stop the specific Key that was registered with Firebot and is Active</span>
          </p>
        </eos-container>
    `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.keyCollections = [];
        $scope.selectRegKey = (regKey: string) => {
            $scope.effect.regKey = regKey;
        };
        $scope.getReportedRegKeys = () => {
            $q.when(
                backendCommunicator.fireEventAsync("bHaptics-get-registration-key-data")
            ).then((msgCollections: RegisteredKeysVariable) => {
                if (msgCollections.keys.regKeys != null) {
                    msgCollections.keys.regKeys.forEach(msgCollections => {
                        $scope.keyCollections.push({ regKey: msgCollections });
                    });
                };
                $scope.selected = $scope.keyCollections.find((keys: { regKey: string, }) =>
                    keys.regKey === $scope.effect.regKey);
            });
        };
        $scope.getReportedRegKeys();
    },
    optionsValidator: (effect) => {
        const errors = [];
        if (effect.regKey == null) {
            errors.push("Please select a Key.");
        }
        return errors;
    },
    onTriggerEvent: async (event) => {
        await stopRegKeys(event.effect.regKey)
        return true;
    },
};