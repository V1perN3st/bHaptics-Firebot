import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    BHAPTICS_EVENT_SOURCE_ID,
    bHapticsDeviceCountEvent,
    bHapticsRegisteredKeysEvent,
    bHapticsActiveKeysEvent,
    bHapticsPlayerConnectedEvent,
    bHapticsPlayerDisconnectedEvent,
    bHapticsFeedbackEvent,
} from "../constants";

export const bHapticsEventSource: EventSource = {
    id: BHAPTICS_EVENT_SOURCE_ID,
    name: "bHaptics",
    events: [
        {
            id: bHapticsPlayerConnectedEvent,
            name: "bHaptics Player Connected",
            description: "When the bHpatics Player is Connected",
            manualMetadata: {},
        },
        {
            id: bHapticsPlayerDisconnectedEvent,
            name: "bHaptics Player Disconnected",
            description: "When the bHaptics Player is Disconnected",
            manualMetadata: {},
        },/*
        {
            id: bHapticsDeviceCountEvent,
            name: "Device Count Changed",
            description: "When the Device Connected Count Change",
            manualMetadata: {
                type: "Unknown",
                count: 0,
                pos: "Last Pos",
            },
        },*/
        {
            id: bHapticsRegisteredKeysEvent,
            name: "bHaptics Registered Keys Changed",
            description: "When the Registered Keys Change",
            manualMetadata: {
                type: "Unknown",
                count: 0,
                keys: "Last Key",
            },
        },
        {
            id: bHapticsActiveKeysEvent,
            name: "bHaptics Active Keys Changed",
            description: "When a Registered Key is Triggered",
            manualMetadata: {
                count: 0,
                keys: "Last Key",
            },
        },/*
        {
            id: bHapticsFeedbackEvent,
            name: "Active Feedback",
            description: "This shows what is being activated",
            manualMetadata: {},
        },*/
    ]
}