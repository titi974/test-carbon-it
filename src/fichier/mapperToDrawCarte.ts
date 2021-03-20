import {Aventurier} from "../domain/Aventurier";
import {Carte} from "../domain/Carte";
import {Tresor} from "../domain/Tresor";
import {Montagne} from "../domain/Montagne";
import {Coordonnee} from "../domain/Coordonnee";

const jeSuisLa = (position: Coordonnee) => (horizontal: number) => (vertical: number) => position.x === horizontal && position.y === vertical
const prepareFind = <A extends Tresor | Montagne>(list: A[]) => (horizontal: number) => (vertical: number): A | undefined => list.find(({coordonnee}) => coordonnee.x === horizontal && coordonnee.y === vertical)
export const mapperToDrawCarte = (data: { aventurier: Aventurier, carte: Carte }): string => {
    const {aventurier: {position, name}, carte} = data
    const {tresors, montagnes} = carte
    const result: string[][] = []
    const findTresor = prepareFind(tresors)
    const findMontagne = prepareFind(montagnes)
    const jAiFini = jeSuisLa(position)
    for (let vertical = 0; vertical < carte.hauteur; vertical++) {
        const lignes: string[] = []
        for (let horizontal = 0; horizontal < carte.longueur; horizontal++) {
            const tres = findTresor(horizontal)(vertical)
            const mont = findMontagne(horizontal)(vertical)
            if (jAiFini(horizontal)(vertical)) {
                lignes.push(`A(${name})`)
            } else if (tres) {
                lignes.push(`T(${tres.nombre})`)
            } else if (mont) {
                lignes.push(`M`)
            } else {
                lignes.push(`*`)
            }
        }
        result.push(lignes)
    }
    return result.map(ligne => ligne.join(` `)).join('\r')
}
