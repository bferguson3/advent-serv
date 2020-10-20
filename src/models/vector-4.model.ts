import { Vector3 } from "./vector-3.model";

export class Vector4 extends Vector3 {
    public w: number;

    constructor(
        x: number = null,
        y: number = null,
        z: number = null,
        w: number = null) {

        super(x, y, z);

        if (w != null) {
            this.w = w;
        }
    }
}
