export class Vector3 {
    public x: number;
    public y: number;
    public z: number;
    constructor(
        x: number = null,
        y: number = null,
        z: number = null) {

        if (x != null) {
            this.x = x;
        }

        if (y != null) {
            this.y = y;
        }

        if (z != null) {
            this.z = z;
        }
    }
}
