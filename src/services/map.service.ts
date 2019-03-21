import * as fs from "fs";
import { MapBoardItem, MapData, TileData } from "../entities";

export class MapService {

    // TODO: load in from env
    public static MAP_DATA_PATH: string = "./map-data";
    public static TILE_FILE_NAME: string = "tiledata";

    public static async loadAllMaps(tileData: TileData[]): Promise<MapData[]> {
        const maps: MapData[] = [];

        const mapFiles = await this.readMapDirectory();

        for (const mapProperty in mapFiles) {
            if (!mapFiles[mapProperty]) {
                continue;
            }

            const mapFileName = mapFiles[mapProperty];

            const map = await this.loadMap(mapFileName);

            if (map) {
                for (const boardItem of map.Board) {
                    if (boardItem) {
                        for (const tile of tileData) {
                            if (boardItem.TileType === tile.Id) {
                                boardItem.TileData = tile;
                                break;
                            }
                        }
                    }
                }

                maps.push(map);
            }
        }

        return maps;
    }

    public static async loadTileData(): Promise<TileData[]> {
        let tileBlob: any = null;

        try {
            const tiles: TileData[] = [];

            tileBlob = await this.readTileData();

            for (const tileProp in tileBlob) {
                if (!tileBlob.hasOwnProperty(tileProp)) {
                    continue;
                }

                const tileData = this.convertFromTileBlob(tileProp, tileBlob[tileProp]);

                if (tileData) {
                    tiles.push(tileData);
                }
            }

            return tiles;
        } catch {
            return null;
        }
    }

    public static convertToMapBlob(mapData: MapData): any {
        const returnData: any = {};

        returnData.name = mapData.Name;
        returnData.stars = mapData.Stars;
        returnData.dice = mapData.Dice;

        returnData.board = [];

        for (const boardItem of mapData.Board) {
            returnData.board.push({
                x: boardItem.X,
                y: boardItem.Y,
                spaceNo: boardItem.SpaceNumber,
                tileType: boardItem.TileType
            });
        }

        // TODO: update this when treasure table structure gets defined
        returnData.treasure_table = mapData.TreasureTable;

        return returnData;
    }

    public static convertToTileBlob(tileData: TileData[]): any {
        const returnData: any = {};

        for (const data of tileData) {
            returnData[data.Id] = {
                name: data.Name,
                description: data.Description,
                treasure_rate: data.TreasureRate,
                enc_rate: data.EncounterRate,
                imagepath: data.ImagePath
            };
        }

        return returnData;
    }

    // Loading Map Data
    private static FILENAMES_EXCLUDE_MAP_PARSING: string[] = [
        "tiledata.json"
    ];

    private static async loadMap(mapFileName: string): Promise<MapData> {
        let mapBlob: any = null;

        try {
            mapBlob = await this.readMapData(mapFileName);

            const mapData = this.convertFromMapBlob(mapBlob);
            mapData.MapFileName = mapFileName;

            return mapData;
        } catch {
            return null;
        }
    }

    private static readMapDirectory(): Promise<string[]> {
        const path = `${MapService.MAP_DATA_PATH}`;

        const promise = new Promise<any>((resolve, reject) => {
            fs.readdir(path, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    // filter out files we don't want to parse as maps
                    const fileNames = data.filter((item) =>
                        MapService.FILENAMES_EXCLUDE_MAP_PARSING.indexOf(item.toLowerCase()) === -1
                    );

                    resolve(fileNames);
                }
            });
        });

        return promise;
    }

    private static readMapData(mapFileName: string): Promise<any> {
        const path = `${MapService.MAP_DATA_PATH}/${mapFileName}`;

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
        mapData.Dice = mapBlob.dice;

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

    // Loading Tile Data
    private static readTileData(): Promise<any> {
        const path = `${MapService.MAP_DATA_PATH}/${MapService.TILE_FILE_NAME}.json`;

        const promise = new Promise<any>((resolve, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const tileData = JSON.parse(data);
                    resolve(tileData);
                }
            });
        });

        return promise;
    }

    private static convertFromTileBlob(id: string, tileBlob: any): TileData {
        const tileData = new TileData();

        tileData.Id = id;
        tileData.Name = tileBlob.name;
        tileData.Description = tileBlob.description;
        tileData.TreasureRate = tileBlob.treasure_rate;
        tileData.EncounterRate = tileBlob.enc_rate;
        tileData.ImagePath = tileBlob.imagepath;

        return tileData;
    }
}
