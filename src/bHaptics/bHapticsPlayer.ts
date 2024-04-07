import PlayerSocket, { Message } from './PlayerSocket'
import {
    DotPoint,
    PathPoint,
    PositionType,
    RotationOption,
    ScaleOption
} from './models/Interfaces'
import ErrorCode from "./models/ErrorCode";
import { logger } from "../logger";

class bHapticsPlayer {
    public static registeredKeys: string[] = [];
    public static connectionPos: string[] = [];
    public static connectedCount: number;
    private static logging: boolean;
    private static socket?: PlayerSocket;

    public static addListener = (func: (msg: Message) => void) => {
        if (!bHapticsPlayer.socket) {
            logger.error('bHaptics SDK not initialized');
            return;
        }

        bHapticsPlayer.socket.addListener(func);
    };

    public static initialize = (
        addr: string = "127.0.0.1",
        port: number = 15881,
        appId: string,
        appName: string,
        retryTime: number = 5000,
        logging: boolean = false,
        loggingResp: boolean = false,
    ) => {
        if (bHapticsPlayer.socket) {
            logger.warn('Initialize called twice');
            return;
        }

        bHapticsPlayer.logging = logging;

        if (addr == "localhost") {
            addr = "127.0.0.1"
        }

        if (logging) {
            logger.debug('Initialize Address:', addr);
            logger.debug('Initialize Port:', port);
            logger.debug('Initialize AppName:', appName);
            logger.debug('Initialize AppID:', appId);
            logger.debug('Initialize Retry Time:', retryTime)
        }

        bHapticsPlayer.socket = new PlayerSocket(addr, port, appId, appName, retryTime, logging);
        bHapticsPlayer.addListener((msg => {
            if (loggingResp) {
                logger.debug('Status:', msg.status);
                logger.debug('Message:', msg.message);
            }
            if (msg.message?.RegisteredKeys) {
                bHapticsPlayer.registeredKeys = msg.message.RegisteredKeys;
            }
            if (msg.message?.ConnectedDeviceCount) {
                bHapticsPlayer.connectedCount = msg.message.ConnectedDeviceCount;
            }
            if (msg.message?.ConnectionPositions) {
                bHapticsPlayer.connectionPos = msg.message.ConnectionPositions;
            }
        }))

    };

    public static initConnect = (): ErrorCode => {
        if (!bHapticsPlayer.socket) {
            return ErrorCode.MESSAGE_NOT_INITIALIZED;
        }
        return bHapticsPlayer.socket.initConnect();
    }

    public static turnOff = (key: string): ErrorCode => {
        const request = {
            Submit: [{
                Type: 'turnOff',
                Key: key,
            }],
        };
        if (!bHapticsPlayer.socket) {
            return ErrorCode.MESSAGE_NOT_INITIALIZED;
        }
        return bHapticsPlayer.socket.send(JSON.stringify(request));
    };

    public static turnOffAll = (): ErrorCode => {
        const request = {
            Submit: [{
                Type: 'turnOffAll',
            }],
        };
        if (!bHapticsPlayer.socket) {
            return ErrorCode.MESSAGE_NOT_INITIALIZED;
        }
        return bHapticsPlayer.socket.send(JSON.stringify(request));
    };

    public static submitDot = (key: string,
        pos: string,
        dotPoints: DotPoint[],
        durationMillis: number): ErrorCode => {
        if (!bHapticsPlayer.socket) {
            return ErrorCode.MESSAGE_NOT_INITIALIZED;
        }

        if (durationMillis < 20 || durationMillis > 100000) {
            return ErrorCode.MESSAGE_INVALID_DURATION_MILLIS;
        }

        if (dotPoints === undefined) {
            return ErrorCode.MESSAGE_INVALID;
        }

        for (let i = 0; i < dotPoints.length; i++) {
            const point = dotPoints[i];


            switch (pos) {
                case PositionType.ForearmL:
                case PositionType.ForearmR:

                    if (point.index < 0 || point.index >= 6) {
                        return ErrorCode.MESSAGE_INVALID_DOT_INDEX_ARM;
                    }
                    break;
                case PositionType.Head:

                    if (point.index < 0 || point.index >= 6) {
                        return ErrorCode.MESSAGE_INVALID_DOT_INDEX_HEAD;
                    }
                    break;
                case PositionType.VestBack:
                case PositionType.VestFront:

                    if (point.index < 0 || point.index >= 20) {
                        return ErrorCode.MESSAGE_INVALID_DOT_INDEX_VEST;
                    }
                    break;
            }

            if (point.intensity < 0 || point.intensity > 100) {
                return ErrorCode.MESSAGE_INVALID_INTENSITY;
            }
        }

        const request = {
            Submit: [{
                Type: 'frame',
                Key: key,
                Frame: {
                    Position: pos,
                    PathPoints: [] as string[],
                    DotPoints: dotPoints,
                    DurationMillis: durationMillis,
                },
            }],
        };

        return bHapticsPlayer.socket.send(JSON.stringify(request, (_, val) =>
            val.toFixed ? Number(val.toFixed(3)) : val
        ));
    };

    public static submitPath = (key: string,
        pos: string,
        pathPoints: PathPoint[],
        durationMillis: number): ErrorCode => {

        if (!bHapticsPlayer.socket) {
            return ErrorCode.MESSAGE_NOT_INITIALIZED;
        }

        if (isNaN(durationMillis)) {
            return ErrorCode.MESSAGE_INVALID_DURATION_MILLIS;
        }

        if (durationMillis < 20 || durationMillis > 100000) {
            return ErrorCode.MESSAGE_INVALID_DURATION_MILLIS;
        }

        if (pathPoints === undefined) {
            return ErrorCode.MESSAGE_INVALID;
        }

        for (let i = 0; i < pathPoints.length; i++) {
            const point = pathPoints[i];

            if (point.x < 0 || point.x > 1) {
                return ErrorCode.MESSAGE_INVALID_X;
            }

            if (point.y < 0 || point.y > 1) {
                return ErrorCode.MESSAGE_INVALID_Y;
            }
            if (point.intensity < 0 || point.intensity > 100) {
                return ErrorCode.MESSAGE_INVALID_INTENSITY;
            }
        }


        const request = {
            Submit: [{
                Type: 'frame',
                Key: key,
                Frame: {
                    Position: pos,
                    PathPoints: pathPoints,
                    DotPoints: [] as string[],
                    DurationMillis: durationMillis,
                },
            }],
        };
        return bHapticsPlayer.socket.send(JSON.stringify(request, (_, val) =>
            val.toFixed ? Number(val.toFixed(3)) : val
        ));
    }

    public static registerFile = (key: string, json: string): ErrorCode => {
        if (!bHapticsPlayer.socket) {
            throw new Error('bHaptics SDK not initialized');
        }

        const jsonData = JSON.parse(json);
        const project = jsonData["project"];
        const request = {
            Register: [{
                Key: key,
                project,
            }]
        };
        return bHapticsPlayer.socket.send(JSON.stringify(request));
    }

    public static submitRegistered = (key: string): ErrorCode => {
        if (!bHapticsPlayer.socket) {
            return ErrorCode.MESSAGE_NOT_INITIALIZED;
        }

        if (bHapticsPlayer.registeredKeys.find(v => v === key) === undefined) {
            return ErrorCode.MESSAGE_NOT_REGISTERED_KEY;
        }

        const request = {
            Submit: [{
                Type: 'key',
                Key: key,
            }],
        };

        return bHapticsPlayer.socket.send(JSON.stringify(request));
    }

    public static submitRegisteredWithScaleOption = (key: string, scaleOption: ScaleOption): ErrorCode => {
        if (!bHapticsPlayer.socket) {
            return ErrorCode.MESSAGE_NOT_INITIALIZED;
        }

        if (bHapticsPlayer.registeredKeys.find(v => v === key) === undefined) {
            return ErrorCode.MESSAGE_NOT_REGISTERED_KEY;
        }

        if (scaleOption.intensity < 0.2 || scaleOption.intensity > 5) {
            return ErrorCode.MESSAGE_INVALID_SCALE_INTENSITY_RATIO;
        }

        if (scaleOption.duration < 0.2 || scaleOption.duration > 5) {
            return ErrorCode.MESSAGE_INVALID_SCALE_DURATION_RATIO;
        }

        const request = {
            Submit: [{
                Type: 'key',
                Key: key,
                Parameters: {
                    scaleOption,
                }
            }],
        };

        return bHapticsPlayer.socket.send(JSON.stringify(request));
    }

    public static submitRegisteredWithRotationOption = (key: string, rotationOption: RotationOption): ErrorCode => {
        if (!bHapticsPlayer.socket) {
            return ErrorCode.MESSAGE_NOT_INITIALIZED;
        }

        if (bHapticsPlayer.registeredKeys.find(v => v === key) === undefined) {
            return ErrorCode.MESSAGE_NOT_REGISTERED_KEY;
        }

        if (rotationOption.offsetAngleX < 0 || rotationOption.offsetAngleX > 360) {
            return ErrorCode.MESSAGE_INVALID_ROTATION_X;
        }

        if (rotationOption.offsetY < -0.5 || rotationOption.offsetY > 0.5) {
            return ErrorCode.MESSAGE_INVALID_ROTATION_Y;
        }

        const request = {
            Submit: [{
                Type: 'key',
                Key: key,
                Parameters: {
                    rotationOption,
                }
            }],
        };

        return bHapticsPlayer.socket.send(JSON.stringify(request));
    }
}

export default bHapticsPlayer;