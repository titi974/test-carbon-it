import {Coordonnee} from "./Coordonnee";

export type Montagne = { type: 'M', coordonnee: Coordonnee }
export const hasMontagne = (montagnes: Montagne[]) => (coordonnee: Coordonnee): boolean => !!montagnes.find(({coordonnee: {x,y}}) => coordonnee.x === x && coordonnee.y === y)
const isMontagne = (data: string[]): boolean => data[0] === 'M'
const mapperStringToMontagne = (data: string[]): Montagne => ({type: 'M', coordonnee: {x: parseInt(data[1]), y: parseInt(data[2])}})
export const getMontagnes = (datas: string[][]): Montagne[] => datas.filter(isMontagne).map(mapperStringToMontagne)
