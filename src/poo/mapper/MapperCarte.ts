import Carte from "../domain/entity/Carte";
import Tresor from "../domain/entity/Tresor";

export default class MapperCarte {
    static mapDataToCarte(data: string[], tresors: Tresor[]): Carte {
        return new Carte({longueur: parseInt(data[1]), hauteur: parseInt(data[2]), tresors})
    }
}
