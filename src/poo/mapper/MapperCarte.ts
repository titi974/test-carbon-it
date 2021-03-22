import Carte from "../domain/entity/Carte";
import Tresor from "../domain/entity/Tresor";
import Montagne from "../domain/entity/Montagne";

export default class MapperCarte {
    static mapDataToCarte(data: string[], tresors: Tresor[], montagnes: Montagne[]): Carte {
        return new Carte({longueur: parseInt(data[1]), hauteur: parseInt(data[2]), tresors, montagnes})
    }
}
