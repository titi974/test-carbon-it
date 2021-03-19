export type Carte = { type: string, longueur: number, hauteur: number, tresors?: [], montagnes?: [] }
const isCarte = (data: string[]): boolean => data[0] === 'C'
const mapperStringToCarte = (data: string[]): Carte => ({
    type: data[0],
    longueur: parseInt(data[1]),
    hauteur: parseInt(data[2]),
    tresors: [],
    montagnes: []
})
export const getCarte = (datas: string[][]): Carte => mapperStringToCarte(datas.filter(isCarte)[0])
