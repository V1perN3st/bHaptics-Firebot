"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { RegisteredKeysVariable, } from "../types"
import { regTact, } from "../tact-remote";
/**
* The Trigger Hotkey Effect
*/
export const regTactFileEffect: Firebot.EffectType<{
    tactkey: string;
    tactfilepath: string;
    rawtact: string;
    tactmode: string;
    regKey: string[];
}> = {
    /**
    * The definition of the Effect
    */
    definition: {
        id: "bHaptics:reg-tact",
        name: "bHaptics Register TACT File",
        description: "Register a TACT file to Key name",
        icon: "fad fa-file-code",
        categories: ["common"],
    },
    /**
    * The HTML template for the Options view (ie options when effect is added to something such as a button.
    * You can alternatively supply a url to a html file via optionTemplateUrl
    */
    optionsTemplate: `
        <eos-container header="Key">
            <p class="muted">Enter in a Key name to be called when triggering bHpatics.</p>
            <input ng-model="effect.tactkey" type="text" class="form-control" id="tact-key" placeholder="Enter Key Name">
            <p class="muted">Create TACT files in bHaptics Studio (https://studio.bhaptics.com/)</p>
        </eos-container>
        <eos-container header="TACT Type" pad-top="true">
            <div class="controls-fb" style="padding-bottom: 5px;">
                <label class="control-fb control--radio">File   <tooltip text="'Select a TACT file to register.'"></tooltip>
                    <input type="radio" ng-model="effect.tactmode" value="tactfile"/>
                    <div class="control__indicator"></div>
                </label>
                <label class="control-fb control--radio">Raw   <tooltip text="'Paste in the raw TACT file to register'"></tooltip>
                    <input type="radio" ng-model="effect.tactmode" value="tactraw"/>
                    <div class="control__indicator"></div>
                </label>
            </div>
        </eos-container>
        <eos-container header="TACT File" ng-if="effect.tactmode == 'tactfile'" pad-top="true">
            <p class="muted">Select the TACT file to be Registered with bHaptics Player.</p>
            <file-chooser model="effect.tactfilepath" options="{ filters: [ {name:'Text',extensions:['tact']} ]}"></file-chooser>
        </eos-container>
        <eos-container header="Raw TACT Entry" ng-if="effect.tactmode == 'tactraw'" pad-top="true">
            <firebot-input model="effect.rawtact" type="text" placeholder-text="Enter raw TACT File" disable-variable-menu="true" use-text-area="true"></firebot-input>
        </eos-container>
    `,
    /**
    * The controller for the front end Options
    */
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.keyCollections = [];
        $scope.getReportedRegKeys = () => {
            $q.when(
                backendCommunicator.fireEventAsync("bHaptics-get-registration-key-data")
            ).then((msgCollections: RegisteredKeysVariable) => {
                if (msgCollections.keys.regKeys != null) {
                    $scope.effect.regKey = msgCollections.keys.regKeys;
                };
            });
        };
        $scope.getReportedRegKeys();
    },
    /**
    * When the effect is triggered by something
    * Used to validate fields in the option template.
    */
    optionsValidator: effect => {
        const errors = [];
        if (effect.tactkey == null || effect.tactkey == "") {
            errors.push("Please provide a Key name.");
        } else if (/\s/.test(effect.tactkey)) {
            errors.push("Please do not use spaces within key name.")
        } else if (!/^[a-z0-9-_]+$/i.test(effect.tactkey)) {
            errors.push("Please use only alphanumeric characters, dash (-), or underscore (_)")
        };
        if (effect.tactmode == "tactfile" && (effect.tactfilepath == null || effect.tactfilepath === "")) {
            errors.push("Please select a TACT file.");
        } else if (effect.tactmode == "tactraw" && (effect.rawtact == null || effect.rawtact === "")) {
            errors.push("Please enter in the raw TACT file.");
        };
        return errors;
    },
    /**
    * When the effect is triggered by something
    */
    onTriggerEvent: async event => {
        if (event.effect.tactmode == "tactfile") {
            await regTact(event.effect.tactkey, event.effect.tactfilepath, true);
        } else if (event.effect.tactmode == "tactraw") {
            await regTact(event.effect.tactkey, event.effect.rawtact, false);
        };
        return true;
    }
}