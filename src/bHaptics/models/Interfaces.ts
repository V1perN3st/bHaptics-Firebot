export interface DotPoint {
    index: number;
    intensity: number;
}

export interface PathPoint {
    x: number;
    y: number;
    intensity: number;
}


export interface ScaleOption {
    intensity: number;
    duration: number;
}


export interface RotationOption {
    offsetAngleX: number;
    offsetY: number;
}


export enum PositionType {
    Vest = 'Vest',
    VestFront = 'VestFront',
    VestBack = 'VestBack',
    Head = 'Head',
    ForearmL = 'ForearmL',
    ForearmR = 'ForearmR',
    GloveL = 'GloveL',
    GloveR = 'GloveR',
    HandL = 'HandL',
    HandR = 'HandR',
    FootL = 'FootL',
    FootR = 'FootR',
    All = 'All',
}