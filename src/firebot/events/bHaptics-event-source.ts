import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    BHAPTICS_EVENT_SOURCE_ID,
    bHapticsDeviceEvent,
    bHapticsRegisteredKeysEvent,
    bHapticsActiveKeysEvent,
    bHapticsPlayerConnectedEvent,
    bHapticsPlayerDisconnectedEvent,
    bHapticsPlayerConnectingEvent,
    bHapticsFeedbackStatusEvent,
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
        },
        {
            id: bHapticsPlayerConnectingEvent,
            name: "bHaptics Player Connecting",
            description: "When the bHaptics Player is Connecting",
            manualMetadata: {},
        },
        {
            id: bHapticsDeviceEvent,
            name: "bHaptics Device Change",
            description: "When a Position Connects or Disconnects",
            manualMetadata: {
                pos: [],
                count: 0,
            },
        },
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
        },
        {
            id: bHapticsFeedbackStatusEvent,
            name: "bHaptics Feedback Status",
            description: "When the Feedback is Enabled or Disable",
            manualMetadata: {
                enabled: null,
            },
        },
    ]
}