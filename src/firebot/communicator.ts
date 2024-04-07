import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import {
    getRespMsgData,
    getRegKeyData,
    getConnectedPosData,
} from "./tact-remote";
import {
    RegisteredVariable,
    RegisteredKeysVariable,
    ConnectedPosVariable,
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
    frontendCommunicator.onAsync<never, ConnectedPosVariable>(
        "bHaptics-get-connected-pos-data",
        getConnectedPosData
    );
};