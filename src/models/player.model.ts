import { Character } from "./character.model";
import { Vector3 } from "./vector-3.model";
import { Vector4 } from "./vector-4.model";

export class Player extends Character {
    public id: number;
    public lastActivity?: number;
    public lHandPos: Vector3;
    public lHandRot: Vector4;
    public lHandObj: string;
    public rHandPos: Vector3;
    public rHandRot: Vector4;
    public rHandObj: string;
    public headPos: Vector3;
    public headRot: Vector4;
    public faceTx: string;
    public bodyTx: string;
}
