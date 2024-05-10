import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { initLogger, logger, responseCode } from "./logger";
import { bHapticsParams } from "./firebot/types";
import { setupFrontListeners } from "./firebot/communicator";
import { initRemote } from "./firebot/tact-remote";
import { regTactFileEffect } from "./firebot/effects/reg-tact";
import { stopAllRegEffect } from "./firebot/effects/stop-all-reg";
import { stopRegEffect } from "./firebot/effects/stop-reg";
import { submitDotEffect } from "./firebot/effects/submit-dot";
import { submitPathEffect } from "./firebot/effects/submit-path";
import { submitRegEffect } from "./firebot/effects/submit-reg";
import { toggleHaptics } from "./firebot/effects/toggle-haptics";
import { bHapticsEventSource } from "./firebot/events/bHaptics-event-source";
import { ActKeyEventFilter } from "./firebot/filters/key-filters"
//import { ConnectedPositionVariable } from "./firebot/variables/connected-variable";
//import { RegisteredKeysVariable } from "./firebot/variables/regkeys-variable";

const script: Firebot.CustomScript<bHapticsParams> = {
  getScriptManifest: () => {
    return {
      name: "bHaptics Script",
      description: "bHaptics script for triggering bHaptics via Firebot",
      author: "V1perN3st",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
        ipAddress: {
            type: "string",
            default: "localhost",
            description: "The ip address of the computer running bHaptics Player. Use 'localhost' for the same computer.",
            validation: {
                required: true
            }
        },
        port: {
            type: "number",
            default: 15881,
            description: "Port the bHaptics Player Websocket is running on (cannot be changed in the app). Default is 15881.",
            validation: {
                required: true
            }
        },
        logging: {
            type: "boolean",
            default: false,
            description: "Enable logging for bHaptic Debug",
        },
        loggingResp: {
            type: "boolean",
            default: false,
            description: "Enable response logging for bHaptic Debug",
        },
    };
  },
  run: (runRequest) => {
      const {
          logger,
          fs,
          frontendCommunicator,
          effectManager,
          eventManager,
          eventFilterManager,
          replaceVariableManager,
      } = runRequest.modules;
      initLogger(runRequest.modules.logger);

      logger.info("Starting bHaptics contol...");

      initRemote(
          {
              addr: runRequest.parameters.ipAddress,
              port: runRequest.parameters.port,
              loggingEn: runRequest.parameters.logging,
              loggingRespEn: runRequest.parameters.loggingResp,
          },
          {
              eventManager,
              fs,
          }
      );

      setupFrontListeners(frontendCommunicator);
      effectManager.registerEffect(regTactFileEffect);
      effectManager.registerEffect(stopAllRegEffect);
      effectManager.registerEffect(stopRegEffect);
      effectManager.registerEffect(submitDotEffect);
      effectManager.registerEffect(submitPathEffect);
      effectManager.registerEffect(submitRegEffect);
      effectManager.registerEffect(toggleHaptics);

      eventManager.registerEventSource(bHapticsEventSource);

      //eventFilterManager.registerFilter(RegKeyEventFilter);
      eventFilterManager.registerFilter(ActKeyEventFilter);

      //replaceVariableManager.registerReplaceVariable(ConnectedPositionVariable);
      //replaceVariableManager.registerReplaceVariable(RegisteredKeysVariable);
  },
};

export default script;
