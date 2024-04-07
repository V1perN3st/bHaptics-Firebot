import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getReportedConnectedPos } from "../tact-remote";

export const ConnectedPositionVariable: ReplaceVariable = {
    definition: {
        handle: "bHapticsConnectedPos",
        description:
            "The list of currently connected devices within bHaptics Player. If bHaptics Player is not running, it returns 'Unknown'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const currentConnectedPos = await getReportedConnectedPos();
        return currentConnectedPos ?? "Unknown";
    },
}