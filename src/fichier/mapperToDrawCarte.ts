import {Tresor} from "../domain/Tresor";
import {Montagne} from "../domain/Montagne";
import {finDeLaChasse} from "../use-case/SePromener";
import {Aventurier} from "../domain/Aventurier";

const jeSuisLa = (horizontal: number) => (vertical: number) => (aventurier: Aventurier) => aventurier.position.x === horizontal && aventurier.position.y === vertical
const prepareFind = <A extends Tresor | Montagne>(list: A[]) => (horizontal: number) => (vertical: number): A | undefined => list.find(({coordonnee}) => coordonnee.x === horizontal && coordonnee.y === vertical)
export const mapperToDrawCarte = (data: finDeLaChasse): string => {
    const {aventuriers, carte} = data
    const {tresors, montagnes} = carte
    const result: string[][] = []
    const findTresor = prepareFind(tresors)
    const findMontagne = prepareFind(montagnes)
    for (let vertical = 0; vertical < carte.hauteur; vertical++) {
        const lignes: string[] = []
        for (let horizontal = 0; horizontal < carte.longueur; horizontal++) {
            const tres = findTresor(horizontal)(vertical)
            const mont = findMontagne(horizontal)(vertical)
            const aventurier = aventuriers.find(jeSuisLa(horizontal)(vertical))
            if (aventurier) {
                lignes.push(`A(${aventurier.name})`)
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
