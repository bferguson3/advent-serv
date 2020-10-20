import { Character } from "./character.model";
import { Vector4 } from "./vector-4.model";

export class Player extends Character {
    public id: number;
    public lastActivity?: number;
    public lHandPos: Vector4;
    public lHandObj: string;
    public rHandPos: Vector4;
    public rHandObj: string;
    public faceTx: string;
    public bodyTx: string;
}
