import * as fs from "fs";
import { EncounterTemplate, EncounterTemplateGroup, MapBoardItem, MapData, TileData } from "../entities";
import { EnemyType, TerrainType } from "../enums";
import { ServiceBase } from "./service-base.service";

export class MapService extends ServiceBase {

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

    public static convertToMapBlob(
        mapData: MapData,
        skipEncounterTable: boolean = true): any {

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

        returnData.encounter_table = [];

        // shouldn't need to send this back to the client at all with the map data
        if (!skipEncounterTable) {
            for (const encounterGroup of mapData.EncounterTable) {
                const encounters: any[] = [];

                for (const encounter of encounterGroup.encounters) {
                    encounters.push({
                        type: encounter.type.toString(),
                        min: encounter.min,
                        max: encounter.max
                    });
                }

                if (encounters.length > 0) {
                    returnData.encounter_table.push({
                        terrain: encounterGroup.terrain,
                        encounters: encounters
                    });
                }
            }
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
                imagepath: data.ImagePath,
                terrain: data.Terrain
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
        mapData.EncounterTable = this.convertFromEncounterBlob(mapBlob.encounter_table);

        return mapData;
    }

    private static convertFromEncounterBlob(encounterGroupBlob: any): EncounterTemplateGroup[] {
        if (!encounterGroupBlob) {
            return [];
        }

        const encounterGroups: EncounterTemplateGroup[] = [];

        for (const encounterBlob of encounterGroupBlob) {
            const terrainType = this.getEnumKeyByEnumValue<TerrainType>(TerrainType, encounterBlob.terrain);

            if (terrainType === null) {
                continue;
            }

            const encounterGroup: EncounterTemplateGroup = new EncounterTemplateGroup();
            encounterGroup.terrain = terrainType;

            const encounters: EncounterTemplate[] = [];

            for (const templateBlob of encounterBlob.encounters) {
                const enemyType = this.getEnumKeyByEnumValue<EnemyType>(EnemyType, templateBlob.type);

                if (enemyType === null) {
                    continue;
                }

                const template = new EncounterTemplate();
                template.type = enemyType;

                if (templateBlob.min !== undefined && templateBlob.min !== null) {
                    template.min = templateBlob.min;
                } else {
                    template.min = 1;
                }

                if (templateBlob.max !== undefined && templateBlob.max !== null) {
                    template.max = templateBlob.max;
                } else {
                    template.max = template.min > 1 ? template.min : 1;
                }

                encounters.push(template);
            }

            if (encounters.length > 0) {
                encounterGroup.encounters = encounters;
                encounterGroups.push(encounterGroup);
            }
        }

        return encounterGroups;
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
        tileData.Terrain = tileBlob.terrain;

        return tileData;
    }
}
