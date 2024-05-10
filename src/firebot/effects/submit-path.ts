"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { PosVariable, } from "../types"
import { submitPath, } from "../tact-remote";
import { PathPoint, } from "../../bHaptics/models/Interfaces";

export const submitPathEffect: Firebot.EffectType<{
    regKey: string;
    pos: string;
    dotPath: PathPoint[];
    x: number;
    y: number;
    intensity: number;
    durationMillis: number;
    }> = {
    definition: {
        id: "bHaptics:submit-path",
        name: "bHaptics Submit Path Pattern",
        description: "Submit a Path Pattern to be played on specific devices",
        icon: "fad fa-braille",
        categories: ["common"],
    },
    optionsTemplate: `
        <eos-container header="Key">
            <p class="muted">Enter in a Key name to be called when triggering bHpatics.</p>
            <div class="input-group" pad-top="true">
                <span class="input-group-addon" id="reg-key">Key Name:</span>
                <input ng-model="effect.regKey" type="text" class="form-control" id="reg-key" placeholder="Enter Key Name">
            </div>
        </eos-container>
        <eos-container header="Settings" pad-top="true">
            <div class="input-group">
                <span class="input-group-addon" id="delay-length-effect-type">Duration (20 - 100000)</span>
                <input ng-model="effect.durationMillis" type="number" min="20" max="100000" class="form-control"
                    aria-describedby="delay-length-effect-type" replace-variables="number" disable-variable-menu="true">
            </div>
            <ui-select style="margin-top:10px" ng-model="selected" on-select="selectPos($select.selected.posType)" theme="bootstrap">
                <ui-select-match placeholder="Select Position Type...">{{$select.selected.posType}}</ui-select-match>
                <ui-select-choices repeat="pos in posCollection | filter: { posType: $select.search }">
                    <div ng-bind-html="pos.posType | highlight: $select.search""></div>
                </ui-select-choices>
            </ui-select>
        </eos-container>
        <setting-container header="Dot Paths" pad-top="true" collapsed="true">
            <div ui-sortable="sortableOptions" ng-model="effect.dotPath">
                <div ng-repeat="dotp in effect.dotPath track by $index" class="list-item selectable">
                    <span class="dragHandle" style="height: 38px; width: 15px; align-items: center; justify-content: center; display: flex">
                        <i class="fal fa-bars" aria-hidden="true"></i>
                    </span>
                    <div class="item ml-8" style="font-weight: 400;width: 100%;margin-bottom: 10px;margin-left: 20px;margin-right: 20px">
                        <firebot-input input-title="X" model="dotp.x" placeholder-text="Enter X coordinate: 0 - 1" input-type="number" disable-variables="true" />
                        <firebot-input style="margin-top:10px" input-title="Y" model="dotp.y" placeholder-text="Enter Y coordinate: 0 - 1" input-type="number" disable-variables="true" />
                        <firebot-input style="margin-top:10px" input-title="Intensity" model="dotp.intensity" placeholder-text="Enter Intensity: 0 - 100" input-type="number" disable-variables="true" />
                    </div>
                    <span class="clickable" style="color: #fb7373;" ng-click="removeItemAtIndex($index);$event.stopPropagation();" aria-label="Remove Dot Path">
                        <i class="fad fa-trash-alt" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
            <p class="muted" ng-show="effect.dotPath.length < 1">No dot paths added.</p>
            <div style="margin: 5px 0 10px 0px;">
                <button class="filter-bar" ng-click="addDot()" uib-tooltip="Add Dot Path" tooltip-append-to-body="true" aria-label="Add Dot Path">
                    <i class="far fa-plus"></i>
                </button>
            </div>
        </setting-container>
    `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.posCollection = [];
        $scope.testPos = /vest/i.test($scope.effect.pos);
        $scope.sortableOptions = {
            handle: ".dragHandle",
            stop: () => { }
        };
        $scope.selectPos = (posType: string) => {
            $scope.effect.pos = posType;
            $scope.testPos = /vest/i.test($scope.effect.pos);
        };
        $scope.getPosType = () => {
            $q.when(
                backendCommunicator.fireEventAsync("bHaptics-get-pos-data")
            ).then((msgCollections: PosVariable) => {
                if (msgCollections.pos.posType != null) {
                    msgCollections.pos.posType.forEach(msgCollections => {
                        $scope.posCollection.push({ posType: msgCollections });
                    });
                };
                $scope.selected = $scope.posCollection.find((pos: { posType: string, }) =>
                    pos.posType === $scope.effect.pos);
            });
        };
        $scope.getPosType();
        $scope.resetDefault = () => {
            $scope.effect.regKey = null;
            $scope.effect.dotPath = [];
            $scope.effect.pos = null;
            $scope.effect.durationMillis = 20;
        }
        if ($scope.effect.regKey == null) {
            $scope.resetDefault();
        }
        $scope.addDot = () => {
            $scope.effect.dotPath.push(
                {
                    x: 0,
                    y: 0,
                    intensity: 100,
                }
            );
        };
        $scope.removeItemAtIndex = (index: number) => {
            $scope.effect.dotPath.splice(index, 1)
        };
    },
    optionsValidator: (effect) => {
        const errors = [];
        if (effect.regKey == null || effect.regKey == "") {
            errors.push("Please provide a Key name.");
        } else if (/\s/.test(effect.regKey)) {
            errors.push("Please do not use spaces within key name.");
        } else if (!/^[a-z0-9-_]+$/i.test(effect.regKey)) {
            errors.push("Please use only alphanumeric characters, dash (-), or underscore (_).");
        };
        if (effect.durationMillis == null) {
            errors.push("Please enter Duration (20 - 100000).");
        } else if (effect.durationMillis < 20 || effect.durationMillis > 100000) {
            errors.push("Invalid Duration (20 - 100000).");
        };
        if (effect.dotPath.length == 0) {
            errors.push("Please add at least one dot path.");
        } else {
            for (let key in effect.dotPath) {
                if (effect.dotPath[key].intensity == null) {
                    let numkey = +key;
                    errors.push("Please enter Intensity at entry " + ++numkey + ".");
                } else if (effect.dotPath[key].intensity < 0 || effect.dotPath[key].intensity > 100) {
                    let numkey = +key;
                    errors.push("Invalid Intensity at entry " + ++numkey + " (must be between 0 - 100).");
                };
                if (effect.dotPath[key].y == null) {
                    let numkey = +key;
                    errors.push("Please enter Y coordinate between 0 - 1 at entry " + ++numkey + ".");
                } else if (effect.dotPath[key].y < 0 || effect.dotPath[key].y > 1) {
                    let numkey = +key;
                    errors.push("Invalid Y coordinate at entry " + ++numkey + " (must be between 0 - 1).");
                };
                if (effect.dotPath[key].x == null) {
                    let numkey = +key;
                    errors.push("Please enter X coordinate between 0 - 1 at entry " + ++numkey + ".");
                } else if (effect.dotPath[key].x < 0 || effect.dotPath[key].x > 1) {
                    let numkey = +key;
                    errors.push("Invalid X coordinate at entry " + ++numkey + " (must be between 0 - 1).");
                };
            };
        };
        return errors;
    },
    onTriggerEvent: async (event) => {
        await submitPath(event.effect.regKey, event.effect.pos, event.effect.dotPath, event.effect.durationMillis);
        return true;
    },
};