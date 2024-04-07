"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { RegisteredKeysVariable, } from "../types"
import { submitDot, } from "../tact-remote";
import { DotPoint, } from "../../bHaptics/models/Interfaces";

export const submitDotEffect: Firebot.EffectType<{
    regKey: string;
    keyCheck: string;
    pos: string,
    dotPoints: DotPoint[],
    index: number,
    intensity: number,
    durationMillis: number
}> = {
    definition: {
        id: "bHaptics:submit-dot",
        name: "bHaptics Submit Dot Pattern",
        description: "Submit a Dot Pattern to be played on specific devices",
        icon: "fad fa-ellipsis-h",
        categories: ["common"],
    },
    optionsTemplate: `
        <eos-container header="Key">
            <p class="muted">Enter in a Key name to be called when triggering bHpatics.</p>
            <input ng-model="effect.data.regKey" type="text" class="form-control" id="reg-key" placeholder="Enter Key Name">
            <div class="input-group">
                <span class="input-group-addon" id="delay-length-effect-type">Duration (20 - 100000)</span>
                <input ng-model="effect.data.durationMillis" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number" disable-variable-menu="true">
            </div>
            <div class="effect-info alert alert-warning">
                <b>Warning!</b> WIP and does not work.
            </div>
        </eos-container>
        <setting-container header="Dot Points" pad-top="true" collapsed="true">
            <div class="input-group" style="width: 100%;">
                <div ng-repeat="dot in effect.data.dots track by $index" class="list-item">
                    <div class="item ml-8" style="font-weight: 400;width: 100%;margin-bottom: 10px;">
                        <div>
                            <div style="margin-bottom: 10px;">
                                <firebot-input input-title="Index:" model="dot.index"
                                    placeholder="Enter Index: 0 - 20"></firebot-input>
                            </div>
                            <firebot-input input-title="Intensity:" model="dot.intensity"
                                    placeholder="Enter Intensity: 0 - 100"></firebot-input>
                        </div>
                    </div>
                    <div class="ml-4">
                        <span class="clickable" style="color: #fb7373;"
                            ng-click="removeItemAtIndex($index);$event.stopPropagation();" aria-label="Remove item">
                            <i class="fad fa-trash-alt" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
                <p class="muted" ng-show="effect.data.dots.length < 1">No items added.</p>
                <div class="mx-0 mt-2.5 mb-4">
                    <button class="filter-bar" ng-click="addDot()" uib-tooltip="Add item"
                        tooltip-append-to-body="true" aria-label="Add item">
                        <i class="far fa-plus"></i>
                    </button>
                </div>
            </div>
        </setting-container>
    `,
    optionsController: ($scope: any, backendCommunicator: any, utilityService: any, $q: any) => {
        $scope.resetDefault = () => {
            $scope.effect.data.regKey = null;
            $scope.effect.data.dots = [];
            $scope.effect.data.pos = null;
            $scope.effect.data.durationMillis = 0;
        }

        if ($scope.effect.data == null) {
            $scope.resetDefault();
        }

        $scope.addDot = () => {
            $scope.effect.dots.push(
                {
                    index: 0,
                    intensity: 0,
                }
            );
        };

    },
    optionsValidator: (effect) => {
        const errors = [];
        if (effect.regKey == null || effect.regKey == "") {
            errors.push("Please provide a Key name.");
        } else if (effect.regKey.includes(effect.keyCheck)) {
            errors.push("Key name already registered.");
        };
        if (effect.durationMillis == null) {
            errors.push("Please enter Duration (20 - 100000).")
        } else if (effect.durationMillis < 20 || effect.durationMillis > 100000) {
            errors.push("Invalid Duration (20 - 100000).")
        };
        return errors;
    },
    onTriggerEvent: async (event) => {
        return true;
    },
};