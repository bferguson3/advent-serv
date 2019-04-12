import { ResponseObjectChild } from "./response-object-child.entity";

export interface IResponseObject {
    type: string;
    visibility: string;
    childResponses: ResponseObjectChild[];
}
