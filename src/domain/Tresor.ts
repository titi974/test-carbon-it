import {Coordonnee} from "./Coordonnee";

export type Tresor = { type: 'T', coordonnee: Coordonnee, nombre: number }
export const hasTresor = (tresors: Tresor[]) => (coordonnee: Coordonnee): number =>
    tresors.findIndex(({coordonnee: {x, y}}) => (coordonnee.x === x && coordonnee.y === y))
const isTresor = (data: string[]): boolean => data[0] === 'T'
const mapperStringToTresor = (data: string[]): Tresor => ({
    type: 'T',
    coordonnee: {x: parseInt(data[1]), y: parseInt(data[2])},
    nombre: parseInt(data[3])
})
export const getTresors = (datas: string[][]): Tresor[] => datas.filter(isTresor).map(mapperStringToTresor)
