"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { RegisteredKeysVariable, } from "../types"
import { submitRegKey, submitRegKeyScale, submitRegKeyRotate, } from "../tact-remote";
import { ScaleOption, RotationOption, } from "../../bHaptics/models/Interfaces";

export const submitRegEffect: Firebot.EffectType<{
    regKey: string;
    modify: string;
    intensity: number;
    duration: number;
    offsetAngleX: number;
    offsetY: number;
}> = {
    definition: {
        id: "bHaptics:submit-reg",
        name: "bHaptics Submit Registered Key",
        description: "Submit Registered Key to be played, with or without modifications.",
        icon: "fad fa-vest",
        categories: ["common"],
    },
    optionsTemplate: `
        <eos-container header="Remove Registered Key" pad-top="true">
          <ui-select ng-model="selected" on-select="selectRegKey($select.selected.regKey)" theme="bootstrap">
            <ui-select-match placeholder="Select a Reg Key...">{{$select.selected.regKey}}</ui-select-match>
            <ui-select-choices repeat="keys in keyCollections | filter: {regKey: $select.search}">
                <div ng-bind-html="keys.regKey | highlight: $select.search""></div>
            </ui-select-choices>
          </ui-select>
          <p style="margin-top:3px">
            <span class="muted">(All keys reset if Firebot or bHaptics Player restarts)</span>
          </p>
        </eos-container>
        <eos-container header="Modifications">
            <div class="controls-fb" style="padding-bottom: 5px;">
                <label class="control-fb control--radio">No Modification <tooltip text="'Submit Registered Key as is'"></tooltip>
                    <input type="radio" ng-model="effect.modify" value="none"/>
                    <div class="control__indicator"></div>
                </label>
                <label class="control-fb control--radio">Scale <tooltip text="'Submit Registration Key with Scaled Options'"></tooltip>
                    <input type="radio" ng-model="effect.modify" value="scale"/>
                    <div class="control__indicator"></div>
                </label>
                <label class="control-fb control--radio">Rotate <tooltip text="'Submit Registration Key with Rotate Options (Vest Only)'"></tooltip>
                    <input type="radio" ng-model="effect.modify" value="rotate"/>
                    <div class="control__indicator"></div>
                </label>
            </div>
        </eos-container>
        <eos-container header="Scale" ng-if="effect.modify === 'scale'">
            <div class="input-group">
                <span class="input-group-addon" id="delay-length-effect-type">Intensity (0.2 - 5)</span>
                <input ng-model="effect.intensity" type="text" class="form-control" aria-describedby="delay-length-effect-type" disable-variable-menu="true">
            </div>
            <div class="input-group" style="margin-top:10px" >
                <span class="input-group-addon" id="delay-length-effect-type">Duration (0.2 - 5)</span>
                <input ng-model="effect.duration" type="text" class="form-control" aria-describedby="delay-length-effect-type" disable-variable-menu="true">
            </div>
        </eos-container>
        <eos-container header="Rotate" ng-if="effect.modify === 'rotate'">
            <div class="input-group">
                <span class="input-group-addon" id="delay-length-effect-type">Offset Angle X (0 - 360)</span>
                <input ng-model="effect.offsetAngleX" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number" disable-variable-menu="true">
            </div>
            <div class="input-group" style="margin-top:10px" >
                <span class="input-group-addon" id="delay-length-effect-type">Offset Y (-0.5 - 0.5)</span>
                <input ng-model="effect.offsetY" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number" disable-variable-menu="true">
            </div>
        </eos-container>
  `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.keyCollections = [];
        if ($scope.effect.modify == null) {
            $scope.effect.modify = "none";
        };
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
        if (effect.modify == "none") {
            if (effect.regKey == null) {
                errors.push("Please select a Key.");
            };
        } else if (effect.modify == "scale") {
            if (effect.intensity == null || effect.duration == null) {
                errors.push("Missing Intensity or Duration.");
            } else if (effect.intensity < 0.2 || effect.intensity > 5) {
                errors.push("Intensity must be between 0.2 and 5.");
            } else if (effect.duration < 0.2 || effect.duration > 5) {
                errors.push("Duration must be between 0.2 and 5.");
            };
        } else if (effect.modify == "rotate") {
            if (effect.offsetAngleX == null || effect.offsetY == null) {
                errors.push("Missing Offset Angle X or Offset Y.");
            } else if (effect.offsetAngleX < 0 || effect.offsetAngleX > 360) {
                errors.push("Offset Angle X must be between 0 and 360.");
            } else if (effect.offsetY < -0.5 || effect.offsetY > 0.5) {
                errors.push("Offset Y must be between -0.5 and 0.5.");
            };
        };
        return errors;
    },
    onTriggerEvent: async (event) => {
        if (event.effect.modify == "none") {
            await submitRegKey(event.effect.regKey);
        } else if (event.effect.modify == "scale") {
            var regScale: ScaleOption = {
                intensity: event.effect.intensity,
                duration: event.effect.duration,
            };
            await submitRegKeyScale(event.effect.regKey, regScale);
        } else if (event.effect.modify == "rotate") {
            var regRotate: RotationOption = {
                offsetAngleX: event.effect.offsetAngleX,
                offsetY: event.effect.offsetY,
            };
            await submitRegKeyRotate(event.effect.regKey, regRotate);
        };
        return true;
    },
};