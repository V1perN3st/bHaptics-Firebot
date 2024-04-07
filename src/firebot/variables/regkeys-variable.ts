import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getRegKeyData } from "../tact-remote";

export const RegisteredKeysVariable: ReplaceVariable = {
    definition: {
        handle: "bHapticsRegKeys",
        description:
            "The list of currently registered keys within bHaptics Player. If bHaptics Player is not running, it returns 'Unknown'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const currentRegisteredKeys = await getRegKeyData();
        return JSON.stringify(currentRegisteredKeys) ?? "Unknown";
    },
}