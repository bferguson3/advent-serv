import { IResponseData } from "./response-data.interface";

export interface IResponseObject {
    data: IResponseData;
    channel: number;
    visibility: string;
}