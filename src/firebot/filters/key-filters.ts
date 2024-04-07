import { EventFilter } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager";
import {
    BHAPTICS_EVENT_SOURCE_ID,
    bHapticsActiveKeysEvent,
    bHapticsRegisteredKeysEvent,
    bHapticsDeviceCountEvent,
} from "../constants";
import { RegisteredKeysVariable, } from "../types"

/*
export const RegKeyEventFilter: EventFilter = {
    id: "v1pern3st:bhaptics-regkey-count-filter",
    name: "Registered Key",
    events: [
        { eventSourceId: BHAPTICS_EVENT_SOURCE_ID, eventId: bHapticsRegisteredKeysEvent }
    ],
    description: "Filter on the name of the Registered Key",
    valueType: "preset",
    comparisonTypes: ["is", "is not"],
    presetValues: (backendCommunicator, $q) => {
        return $q
            .when(backendCommunicator.fireEventAsync("bHaptics-get-registration-key-data"))
            .then((msgCollections: RegisteredKeysVariable) =>
                msgCollections.keys.regKeys.map((s) => {
                    return {
                        value: s,
                        display: s,
                    };
                })
            );
    },
    predicate: async ({ comparisonType, value }, { eventMeta }) => {
        const expected = value;
        const actual = eventMeta.keys;
        switch (comparisonType) {
            case "is":
                return actual === expected;
            case "is not":
                return actual !== expected;
            default: false;
        }
    },
};*/

export const ActKeyEventFilter: EventFilter = {
    id: "v1pern3st:bhaptics-actkey-count-filter",
    name: "Active Key",
    events: [
        { eventSourceId: BHAPTICS_EVENT_SOURCE_ID, eventId: bHapticsActiveKeysEvent }
    ],
    description: "Filter on the name of the Active Key",
    valueType: "preset",
    comparisonTypes: ["is", "is not"],
    presetValues: (backendCommunicator, $q) => {
        return $q
            .when(backendCommunicator.fireEventAsync("bHaptics-get-registration-key-data"))
            .then((msgCollections: RegisteredKeysVariable) =>
                msgCollections.keys.regKeys.map((s) => {
                    return {
                        value: s,
                        display: s,
                    };
                })
            );
    },
    predicate: async ({ comparisonType, value }, { eventMeta }) => {
        const expected = value;
        const actual = eventMeta.keys;
        switch (comparisonType) {
            case "is":
                return actual === expected;
            case "is not":
                return actual !== expected;
            default: false;
        }
    },
};

/*
export const CountEventFilter: EventFilter = {
    id: "v1pern3st:bhaptics-count-filter",
    name: "bHaptic Count",
    events: [
        { eventSourceId: BHAPTICS_EVENT_SOURCE_ID, eventId: bHapticsRegisteredKeysEvent },
        { eventSourceId: BHAPTICS_EVENT_SOURCE_ID, eventId: bHapticsActiveKeysEvent },
        //{ eventSourceId: BHAPTICS_EVENT_SOURCE_ID, eventId: bHapticsDeviceCountEvent },
    ],
    description: "Filter on the count of bHaptics Events (Keys and Positions)",
    valueType: "number",
    comparisonTypes: [
        "is",
        "is not",
        "greater than",
        "greater than or equal to",
        "less than",
        "less than or equal to",
    ],
    predicate: async ({ comparisonType, value }, { eventMeta }) => {
        const expected = value;
        const actual = eventMeta.count;
        switch (comparisonType) {
            case "is":
                return actual === expected;
            case "is not":
                return actual !== expected;
            default: false;
        }
    },
};
*/