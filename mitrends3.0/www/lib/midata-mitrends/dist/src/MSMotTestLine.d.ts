import { Observation } from "midata";
export declare type handSide = "left" | "right";
export declare class MSMotTestLine extends Observation {
    constructor(date: Date, handSide: handSide);
    addLxDuration(lxDuration: number, lValue: number): void;
    addLxAvgDist(lxAvgDist: number, lValue: number): void;
    addLxStdDevDist(lxStdDevDist: number, lValue: number): void;
}
