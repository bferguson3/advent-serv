import * as fs from "fs";
import { MapBoardItem, MapData } from "../entities";
import { MapType } from "../enums";

export class MapService {

    // TODO: load in from env
    public static MAP_DATA_PATH: string = "./map-data";

    public static async loadAllMaps(): Promise<MapData[]> {
        const maps: MapData[] = [];
        const keys = Object.keys(MapType);

        for (const mapType in MapType) {
            if (!mapType) {
                continue;
            }

            const mapTypeInstance: MapType = MapType[mapType] as any as MapType;
            const map = await this.loadMap(mapTypeInstance);

            if (map) {
                maps.push(map);
            }
        }

        return maps;
    }

    private static async loadMap(mapType: MapType): Promise<MapData> {
        let mapBlob: any = null;

        try {
            mapBlob = await this.readMapData(mapType);

            const mapData = this.convertFromMapBlob(mapBlob);
            mapData.MapType = mapType;

            return mapData;
        } catch {
            return null;
        }
    }

    private static readMapData(mapType: MapType): Promise<any> {
        const path = `${MapService.MAP_DATA_PATH}/${mapType}.json`;

        const promise = new Promise<any>((resolve, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const mapData = JSON.parse(data);
                    resolve(mapData);
                }
            });
        });

        return promise;
    }

    private static convertFromMapBlob(mapBlob: any): MapData {
        const mapData = new MapData();
        mapData.Name = mapBlob.name;
        mapData.Board = this.convertFromBoardBlob(mapBlob.board);
        mapData.TreasureTable = mapBlob.treasure_table;
        mapData.Stars = mapBlob.stars;

        return mapData;
    }

    private static convertFromBoardBlob(boardBlob: any): MapBoardItem[] {
        const boardItems: MapBoardItem[] = [];

        for (const itemBlob of boardBlob) {
            const boardItem: MapBoardItem = new MapBoardItem();

            boardItem.X = itemBlob.x;
            boardItem.Y = itemBlob.y;
            boardItem.SpaceNumber = itemBlob.spaceNo;
            boardItem.TileType = itemBlob.tileType;

            boardItems.push(boardItem);
        }

        return boardItems;
    }
}
