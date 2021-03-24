import IEnregister from "./port/IEnregister";
import Carte from "./entity/Carte";
import Aventurier from "./entity/Aventurier";

export default class Enregistrer {
    constructor(private readonly systemSauvegarder: IEnregister) {
    }

    executer(carte: Carte, aventuriers: Aventurier[]) {
        this.systemSauvegarder.executer(carte, aventuriers)
    }
}
