import {lireFichier} from './fichier/LireFichier'
import path from "path";
import {mapStringWithReturnCharactersToArrays} from "./fichier/MapStringWithReturnCharactersToArray";
import {getCarte} from "./domain/Carte";
import {getMontagnes} from "./domain/Montagne";
import {getTresors} from "./domain/Tresor";
const root = path.join(path.dirname(__dirname), 'src', 'file','chasseAuxTresors.txt')
const fichier = lireFichier(root)
const datas = mapStringWithReturnCharactersToArrays(fichier)
const carte = getCarte(datas)
carte.montagnes = getMontagnes(datas)
carte.tresors = getTresors(datas)
console.log(carte)
