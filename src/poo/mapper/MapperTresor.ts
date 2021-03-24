import Tresor from "../domain/entity/Tresor";
import Coordonnee from "../domain/value-object/Coordonnee";

export default class MapperTresor {
    static mapDataToTresor(data: string[]): Tresor {
        const coordonnee = new Coordonnee({x: parseInt(data[1]), y: parseInt(data[2])});
        return new Tresor({coordonnee, quantite: parseInt(data[3])})
    }

    static mapDomainToData(tresor: Tresor): string {
        const {coordonnee, quantite} = tresor
        return `T - ${coordonnee.x} - ${coordonnee.y} - ${quantite}`
    }
}
