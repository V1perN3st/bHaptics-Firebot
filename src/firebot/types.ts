// bHaptic Paramatures for Custom Connection
export type bHapticsParams = {
    ipAddress: string;
    port: number;
    logging: boolean;
    loggingResp: boolean;
};

// Submit Dot Activation
export type submitDot = {
    key: string;
    position: string;
    points: [{
        index: number,
        intensity: number,
    }];
    durationMillis: number;
};

// Submit a Custom Path
export type submitPath = {
    key: string;
    position: string;
    points: [{
        x: number,
        y: number,
        intensity: number,
    }];
    durationMillis: number;
};

// You need to registerFile, before calling submitRegistered, submitRegisteredWithRotationOption, and submitRegisteredWithScaleOption
// tactFile should be the content of the tact file
export type regTactFile = {
    key: string;
    tactFile: string;
};

// Call the Registered Key to Activate
export type submitRegistered = {
    key: string;
};

// offsetAngleX: 0 - 360, offsetY: -0.5 - 0.5
// This function only works with Vest haptic pattern
export type submitRegisteredWithRotationOption = {
    key: string;
    rotationOption: [{
        offsetAngleX: number,
        offsetY: number,
    }];
};

// intensity: 0.2 - 5, duration: 0.2 - 5
export type submitRegisteredWithScaleOption = {
    key: string;
    scaleOption: [{
        intensity: number,
        duration: number,
    }];
};

// Return Keys (Active, Registered, and Counts for each) and Positions (Connected and Count)
export type RegisteredVariable = {
    keyCount: number,
    actKeyCount: number,
    connectCount: number,
    keys: {
        regKeys: string[],
        activeKeys: string[],
    }
    pos: {
        connected: string[],
    }
};

// Return only Keys (Active, Registered, and Counts for each)
export type RegisteredKeysVariable = {
    keyCount: number,
    actKeyCount: number,
    keys: {
        regKeys: string[],
        activeKeys: string[],
    }
};

// Return only Connected Positions and Count
export type ConnectedPosVariable = {
    connectCount: number,
    pos: {
        connected: string[],
    }
};