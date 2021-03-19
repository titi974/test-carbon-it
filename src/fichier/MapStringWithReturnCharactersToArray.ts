import {supprimerCommentaire} from "./supprimerCommentaire";

export const mapStringWithReturnCharactersToArrays = (datas: string): string[][] => datas
    .split(/(\r?\n)/)
    .filter(line => line !== '' && !/\r?\n/.test(line))
    .filter(supprimerCommentaire)
    .map(data => data.split('-').map(trim))

const trim = (value: string): string => value.trim()
