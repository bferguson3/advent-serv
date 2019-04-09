import { EncounterTemplateGroup } from "./encounter-template-group.entity";
import { MapBoardItem } from "./map-board-item.entity";

export class MapData {
    public TreasureTable: any[] = [];
    public EnconterTable: EncounterTemplateGroup[] = [];
    public Board: MapBoardItem[] = [];
    public Name: string;
    public Stars: number;
    public Dice: number;
    public MapFileName: string;
}
