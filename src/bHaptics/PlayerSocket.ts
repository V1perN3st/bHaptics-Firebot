import ErrorCode from "./models/ErrorCode";
import * as WebSocket from "ws";
import { logger } from "../logger";

//const DEFAULT_URL = 'ws://127.0.0.1:15881/v2/feedbacks?' //app_id=com.bhaptics.designer2&app_name=bHaptics Designer';

export enum STATUS {
    CONNECTING = 'Connecting',
    CONNECTED = 'Connected',
    DISCONNECT = 'Disconnected',
}

//const DEFAULT_RETRY_CONNECT_TIME = 5000;

export interface Message {
    status: STATUS;
    message: any;
}

export default class PlayerSocket {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private handlers: Function[] = [];
    private websocketClient: any;
    private currentStatus: STATUS;
    private message: any;
    private isTriggered = false;
    private addr: string;
    private port: number;
    private appId: string;
    private appName: string;
    private logging: boolean;
    private loggingResp: boolean;
    private retryConnectTime: number;

    constructor(addr: string, port: number, appId = "yourAppId", appName = 'yourAppName', retryConnectTime: number, logging: boolean) {
        this.addr = addr;
        this.port = port;
        this.appName = appName;
        this.appId = appId;
        this.logging = logging;
        this.message = {};
        this.retryConnectTime = retryConnectTime;
        this.currentStatus = STATUS.DISCONNECT;
        if (this.logging) {
            logger.debug('Constructed!');
        }
    }

    public addListener = (func: (msg: Message) => void) => {
        this.handlers.push(func);
    };

    public initConnect = () => {
        if (this.logging) {
            logger.debug('PlayerSocket initConnect');
        }
        if (!this.isTriggered) {
            this.isTriggered = true;
            this.connect();
            return ErrorCode.CONNECTION_NOT_ESTABLISHED;
        }
    }

    private emit = (msg: Message) => {
        this.handlers.forEach(func => {
            func(msg);
        })
    };

    connect = () => {
        if (this.logging) {
            logger.debug('PlayerSocket Connecting');
        }

        try {
            this.websocketClient = new WebSocket(`ws://${this.addr}:${this.port}/v2/feedbacks?app_id=${this.appId}&app_name=${this.appName}`);
        } catch (e) {
            // connection failed
            logger.error('PlayerSocket Connect:', e);
            return;
        }

        this.websocketClient.onopen = () => {
            if (this.logging) {
                logger.debug('PlayerSocket Connected');
            }
            this.currentStatus = STATUS.CONNECTED;
            this.emit({
                status: this.currentStatus,
                message: this.message,
            });
        };

        this.websocketClient.onmessage = (result: any) => {
            if (JSON.stringify(this.message) === result.data) {
                return;
            }

            this.message = JSON.parse(result.data);
            this.emit({
                status: this.currentStatus,
                message: this.message,
            });
        };

        this.websocketClient.onclose = (_: any) => {
            if (this.logging) {
                logger.debug('PlayerSocket Closed');
            }
            this.currentStatus = STATUS.DISCONNECT;
            this.emit({
                status: this.currentStatus,
                message: this.message,
            });
            setTimeout(() => {
                this.connect();
            }, this.retryConnectTime);
        };

        this.websocketClient.onerror = (event: any) => {
            if (this.logging) {
                logger.debug('PlayerSocket Error');
            }
            this.currentStatus = STATUS.DISCONNECT;
            this.emit({
                status: this.currentStatus,
                message: event.message,
            });
        }

        this.currentStatus = STATUS.CONNECTING;
        this.emit({
            status: this.currentStatus,
            message: this.message,
        });
    };

    send = (message: string): ErrorCode => {
        if (this.logging) {
            logger.debug('Send:', message);
        }

        if (message === undefined) {
            return ErrorCode.CONNECTION_NOT_ESTABLISHED;
        }

        if (!this.isTriggered) {
            this.isTriggered = true;
            this.connect();
            return ErrorCode.CONNECTION_NOT_ESTABLISHED;
        }

        if (this.websocketClient === undefined) {
            return ErrorCode.CONNECTION_NOT_ESTABLISHED;
        }

        if (this.currentStatus !== STATUS.CONNECTED) {
            return ErrorCode.CONNECTION_NOT_ESTABLISHED;
        }

        try {
            this.websocketClient.send(message);
            return ErrorCode.SUCCESS;
        } catch (e) {
            // sending failed
            logger.error('PlayerSocket Send:', e);
            return ErrorCode.FAILED_TO_SEND_MESSAGE;
        }
    }
}