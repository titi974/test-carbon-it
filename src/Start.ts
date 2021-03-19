import {lireFichier} from './fichier/LireFichier'
import path from "path";
import {mapStringWithReturnCharactersToArrays} from "./fichier/MapStringWithReturnCharactersToArray";
import {getCarte} from "./domain/Carte";
import {getMontagnes} from "./domain/Montagne";
import {getTresors} from "./domain/Tresor";
import {getAventurier} from "./domain/Aventurier";
import {sOrienter} from "./SOrienter";
import {Action} from "./domain/Action";
import {Avancer} from "./Avancer";

const root = path.join(path.dirname(__dirname), 'src', 'file','chasseAuxTresors.txt')
const fichier = lireFichier(root)
const datas = mapStringWithReturnCharactersToArrays(fichier)
const aventurier = getAventurier(datas)
const carte = getCarte(datas)
console.log(aventurier)

carte.montagnes = getMontagnes(datas)
carte.tresors = getTresors(datas)
aventurier.orientation = sOrienter(aventurier.orientation)(Action.G);
aventurier.position = Avancer(aventurier.position)(aventurier.orientation)

console.log(carte)
console.log(aventurier)
