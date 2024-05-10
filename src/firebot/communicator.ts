import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import {
    getRespMsgData,
    getRegKeyData,
    getPosData,
} from "./tact-remote";
import {
    RegisteredVariable,
    RegisteredKeysVariable,
    PosVariable,
} from "./types";

export function setupFrontListeners(
    frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
    frontendCommunicator.onAsync<never, RegisteredVariable>(
        "bHaptics-get-response-msg-data",
        getRespMsgData
    );
    frontendCommunicator.onAsync<never, RegisteredKeysVariable>(
        "bHaptics-get-registration-key-data",
        getRegKeyData
    );
    frontendCommunicator.onAsync<never, PosVariable>(
        "bHaptics-get-pos-data",
        getPosData
    );
};