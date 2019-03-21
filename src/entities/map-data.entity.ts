import { MapType } from "../enums";
import { MapBoardItem } from "./map-board-item.entity";

export class MapData {
    public TreasureTable: any[] = [];
    public Board: MapBoardItem[] = [];
    public Name: string;
    public Stars: number;
    public Dice: number;
    public MapType: MapType;
}
