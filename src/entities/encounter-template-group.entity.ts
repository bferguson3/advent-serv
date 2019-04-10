import { TerrainType } from "../enums";
import { EncounterTemplate } from "./encounter-template.entity";

export class EncounterTemplateGroup {
    public terrain: TerrainType;
    public encounters: EncounterTemplate[] = [];
}
