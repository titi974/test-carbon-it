import {Coordonnee} from "./Coordonnee";
import {PointsCardinaux} from "./PointsCardinaux";
import {getEnumKeyByEnumValue} from "../utils/getValueEnum";

export type Aventurier = { type: string, name: string, position: Coordonnee, orientation: PointsCardinaux, mouvements: string, tresors: number }
const isAventurier = (data: string[]): boolean => data[0] === 'A'
const mapperStringToAventurier = (data: string[]): Aventurier => ({
    type: data[0],
    name: data[1],
    position: {x: parseInt(data[2]), y: parseInt(data[3])},
    orientation: PointsCardinaux[getEnumKeyByEnumValue(PointsCardinaux, data[4]) || 'N'],
    mouvements: data[5],
    tresors: 0
})
export const getAventurier = (datas: string[][]): Aventurier[] => datas.filter(isAventurier).map(mapperStringToAventurier)
