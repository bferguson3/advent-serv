import { MesssageHandlerBase } from "../message-handlers/message-handler-base.handler";
import { ResponseObjectChild } from "./response-object-child.entity";

export interface IResponseObject {
    type: string;
    visibility: string;
    childHandlers: ResponseObjectChild[];
}
