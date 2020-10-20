import { Vector3 } from "./vector-3.model";

export class Vector4 extends Vector3 {
    public r: number;

    constructor(
        x: number = null,
        y: number = null,
        z: number = null,
        r: number = null) {

        super(x, y, z);

        if (r != null) {
            this.r = r;
        }
    }
}
