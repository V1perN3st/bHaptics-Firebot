import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import bHapticsPlayer from "../bHaptics/bHapticsPlayer"
import {
    RegisteredVariable,
    RegisteredKeysVariable,
    ConnectedPosVariable,
} from "./types";
import {
    appId,
    appName,
    retryTime,
    BHAPTICS_EVENT_SOURCE_ID,
    bHapticsPlayerConnectedEvent,
    bHapticsPlayerDisconnectedEvent,
    bHapticsRegisteredKeysEvent,
    bHapticsActiveKeysEvent,
    bHapticsDeviceCountEvent,
    bHapticsFeedbackEvent,
} from "./constants"
import { logger, responseCode } from "../logger";
import { DotPoint, PathPoint, ScaleOption, RotationOption, PositionType } from "../bHaptics/models/Interfaces"
import ErrorCode from "../bHaptics/models/ErrorCode";

let fs: ScriptModules["fs"];
let eventManager: ScriptModules["eventManager"];
let connected: boolean;
let msgRegKeys: string[] = [];
let msgActKeys: string[] = [];
let msgActKeyCount: number;
let msgRegKeyCount: number;
let msgConnectedDevices: number;
let msgConnectedPos: string[] = [];
let logging: boolean;

export let getRegVar: RegisteredVariable;
export let getRegKeyVar: RegisteredKeysVariable;
export let getConnectPosVar: ConnectedPosVariable;

export function initRemote(
    {
        addr,
        port,
        loggingEn,
        loggingRespEn,
    }: {
        addr: string,
        port: number,
        loggingEn: boolean,
        loggingRespEn: boolean,
        },
    modules: {
        eventManager: ScriptModules["eventManager"];
        fs: ScriptModules["fs"];
    }
) {
    var logging = loggingEn ?? false
    var loggingResp = loggingRespEn ?? false
    eventManager = modules.eventManager;
    fs = modules.fs;

    logger.info("Initialize bHaptics Player");

    // Initialize: Address, Port, App Name, App ID, Retry Time (int), Logging (boolean)
    bHapticsPlayer.initialize(addr, port, appId, appName, retryTime, logging, loggingResp);

    // Initialize Connection
    bHapticsPlayer.initConnect();

    logger.info("Add Listener");

    bHapticsPlayer.addListener(function (msg) {
        if (msg.status === 'Connected') {
            msgRegKeys = msg.message.RegisteredKeys;
            msgActKeys = msg.message.ActiveKeys;
            if (msgRegKeys !== undefined) {
                if (msgRegKeys.length > msgRegKeyCount) {
                    eventManager?.triggerEvent(
                        BHAPTICS_EVENT_SOURCE_ID,
                        bHapticsRegisteredKeysEvent,
                        {
                            type: "Increase",
                            count: msgRegKeys.length,
                            keys: msgRegKeys.at(-1),
                        }
                    );
                };
                msgRegKeyCount = msgRegKeys.length;
            } else {
                msgRegKeyCount = 0;
            };
            if (msgActKeys !== undefined) {
                if (msgActKeys.length > msgActKeyCount) {
                    eventManager?.triggerEvent(
                        BHAPTICS_EVENT_SOURCE_ID,
                        bHapticsActiveKeysEvent,
                        {
                            type: "Increase",
                            count: msgActKeys.length,
                            keys: msgActKeys.at(-1),
                        }
                    );
                } else if (msgActKeys.length < msgActKeyCount) {
                    eventManager?.triggerEvent(
                        BHAPTICS_EVENT_SOURCE_ID,
                        bHapticsActiveKeysEvent,
                        {
                            type: "Decrease",
                            count: msgActKeys.length,
                            keys: "None",
                        }
                    );
                };
                msgActKeyCount = msgActKeys.length;
            } else {
                msgActKeyCount = 0;
            };
            if (msg.message.ConnectedDeviceCount = 0) {

            }
            msgConnectedDevices = msg.message.ConnectedDeviceCount;
            msgConnectedPos = msg.message.ConnectedPositions;
            if (!connected) {
                connected = true;
                eventManager?.triggerEvent(
                    BHAPTICS_EVENT_SOURCE_ID,
                    bHapticsPlayerConnectedEvent,
                    {}
                );
            };
        } else if (msg.status === 'Disconnected') {
            if (connected) {
                connected = false;
                msgRegKeys = [];
                msgActKeys = [];
                msgRegKeyCount = 0;
                msgActKeyCount = 0;
                msgConnectedDevices = 0;
                msgConnectedPos = [];
                eventManager?.triggerEvent(
                    BHAPTICS_EVENT_SOURCE_ID,
                    bHapticsPlayerDisconnectedEvent,
                    {}
                );
            };
        } else if (msg.status === 'Connecting') {
            //if (connected) {
            //    connected = false;
            //};
        };
        //msgRegKeys = msg.message.RegisteredKeys;
        //msgConnectedDevices = msg.message.ConnectedDeviceCount;
        //msgConnectedPos = msg.message.ConnectedPositions;
    });
}

export async function regTact(regKey: string, tact: string, file: boolean) {
    if (!connected) {
        return;
    };
    var json: string
    if (file) {
        json = fs.readFileSync(tact, 'utf8');
    } else {
        json = tact;
    };

    if (logging) {
        if (file) {
            logger.debug("File: True");
        } else {
            logger.debug("File: Flase");
        };
        logger.debug("JSON:", json);
    };

    return bHapticsPlayer.registerFile(regKey, json)
}

export function validateRegKeys(regKey: string) {
    logger.debug("msgReg:", msgRegKeys);
    logger.debug("regKey:", regKey)
    /*if (msgRegKeys.includes(regKey)) {
        return true
    } else {
        return false
    };*/
    return false;
}

export async function stopAllRegKeys(): Promise<void> {
    if (!connected) {
        return;
    };
    try {
        await bHapticsPlayer.turnOffAll();
    } catch (e) {
        var error = responseCode(e, logging);
        logger.error("Failed to remove all Registration Keys:", error);
    };
};

export async function stopRegKeys(regKey: string): Promise<void> {
    if (!connected) {
        return;
    };
    try {
        await bHapticsPlayer.turnOff(regKey);
    } catch (e) {
        var error = responseCode(e, logging);
        logger.error("Failed to remove Registration Key:", error);
    };
};

export async function submitRegKey(regKey: string): Promise<void> {
    if (!connected) {
        return;
    };
    try {
        await bHapticsPlayer.submitRegistered(regKey);
    } catch (e) {
        var error = responseCode(e, logging);
        logger.error("Failed to Submit Registered Key:", error);
    };
};

export async function submitRegKeyScale(regKey: string,
    scaleOption: ScaleOption): Promise<void> {
    if (!connected) {
        return;
    };
    if (logging) {
        logger.debug("RegKey:", regKey);
        logger.debug("Scale:", scaleOption);
    };
    try {
        await bHapticsPlayer.submitRegisteredWithScaleOption(regKey, scaleOption);
    } catch (e) {
        var error = responseCode(e, logging);
        logger.error("Failed to Submit Registered Key with Scale Option:", error);
    };
};

export async function submitRegKeyRotate(regKey: string,
    rotationOption: RotationOption): Promise<void> {
    if (!connected) {
        return;
    };
    if (logging) {
        logger.debug("RegKey:", regKey);
        logger.debug("Scale:", rotationOption);
    };
    try {
        await bHapticsPlayer.submitRegisteredWithRotationOption(regKey, rotationOption);
    } catch (e) {
        var error = responseCode(e, logging);
        logger.error("Failed to Submit Registered Key with Rotation Option:", error);
    };
};

export async function submitDot(key: string,
    pos: string,
    dotPoints: DotPoint[],
    durationMillis: number): Promise<void> {
    if (!connected) {
        return;
    };
    if (logging) {
        logger.debug("RegKey:", key);
        logger.debug("Position:", pos);
        logger.debug("Dot Points:", dotPoints);
        logger.debug("Duration (Millis):", durationMillis);
    };
    try {
        await bHapticsPlayer.submitDot(key, pos, dotPoints, durationMillis);
    } catch (e) {
        var error = responseCode(e, logging);
        logger.error("Failed to Submit Dot:", error);
    };
};

export async function submitPath(key: string,
    pos: string,
    pathPoints: PathPoint[],
    durationMillis: number): Promise<void> {
    if (!connected) {
        return;
    };
    if (logging) {
        logger.debug("RegKey:", key);
        logger.debug("Position:", pos);
        logger.debug("Path Points:", pathPoints);
        logger.debug("Duration (Millis):", durationMillis);
    };
    try {
        await bHapticsPlayer.submitPath(key, pos, pathPoints, durationMillis);
    } catch (e) {
        var error = responseCode(e, logging);
        logger.error("Failed to Submit Path:", error);
    };
};

export async function getRespMsgData(): Promise<RegisteredVariable> {
    if (!connected) {
        return;
    };
    getRegVar = {
        keyCount: msgRegKeyCount,
        actKeyCount: msgActKeyCount,
        connectCount: msgConnectedDevices,
        keys: {
            regKeys: msgRegKeys,
            activeKeys: msgActKeys,
        },
        pos: {
            connected: msgConnectedPos,
        },
    };
    if (logging) {
        logger.debug("getRespMsgData Return:", getRegVar);
    };
    return getRegVar;
}

export async function getRegKeyData(): Promise<RegisteredKeysVariable> {
    if (!connected) {
        return;
    };
    getRegKeyVar = {
        keyCount: msgRegKeyCount,
        actKeyCount: msgActKeyCount,
        keys: {
            regKeys: msgRegKeys,
            activeKeys: msgActKeys,
        },
    }
    if (logging) {
        logger.debug("getRegKeyData Return:", getRegKeyVar);
    };
    return getRegKeyVar;
}

export async function getConnectedPosData(): Promise<ConnectedPosVariable> {
    if (!connected) {
        return;
    };
    getConnectPosVar = {
        connectCount: msgConnectedDevices,
        pos: {
            connected: msgConnectedPos,
        },
    }
    if (logging) {
        logger.debug("getRegKeyData Return:", getRegKeyVar);
    };
    return getConnectPosVar;
}

/*
export async function getReportedRegKeysVar(): Promise<string[]> {
    if (!connected) {
        return;
    };
    try {
        return msgRegKeys;
    } catch (e) {
        return null;
    };
}
*/
export async function getReportedConnectedPos(): Promise<string[]> {
    if (!connected) {
        return;
    };
    try {
        return msgConnectedPos;
    } catch (e) {
        return null;
    };
}
/*
export async function getReportedConnected(): Promise<number> {
    if (!connected) {
        return;
    };
    try {
        return msgConnectedDevices;
    } catch (e) {
        return null;
    };
}
*/