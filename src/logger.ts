import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
export let logger: ScriptModules["logger"] = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { },
};

export function initLogger(newLogger: ScriptModules["logger"]) {
    logger = newLogger;
}

export function responseCode(code: number, logging: boolean) {
    switch (code) {
        case 0:
            if (logger) {
                logger.debug("Success")
            };
            return;
        case 2:
            logger.error("Connection Not Established");
            return;
        case 5:
            logger.error("Invalid Duration Millis");
            return;
        case 6:
            logger.error("Invalid Dot Index Head");
            return;
        case 7:
            logger.error("Invalid Dot Index Arm");
            return;
        case 8:
            logger.error("Invalid Dot Index Vest");
            return;
        case 9:
            logger.error("Invalid Intensity");
            return;
        case 10:
            logger.error("Invalid X");
            return;
        case 11:
            logger.error("Invalid Y");
            return;
        case 12:
            logger.error("Invalid Rotation X");
            return;
        case 13:
            logger.error("Invalid Rotation Y");
            return;
        case 14:
            logger.error("Invalid Scale Intensity Ratio");
            return;
        case 15:
            logger.error("Invalid Scale Duration Ratio");
            return;
        case 16:
            logger.error("Not Registered Key");
            return;
    };
}