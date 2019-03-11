import { TileData } from "./tile-data.entity";

export class MapBoardItem {
    public X: number;
    public Y: number;
    public SpaceNumber: number;
    public TileType: string;

    public TileData: TileData;
}
