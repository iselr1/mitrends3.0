import { Observation, Resource } from "midata";
export declare class MSTests extends Observation {
    constructor(date: Date, comment: string);
    addRelated(resource: Resource): void;
}
