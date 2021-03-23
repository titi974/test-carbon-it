import ICarteRepository from "./port/ICarteRepository";
import IAventurierRepository from "./port/IAventurierRepository";
import Carte from "./entity/Carte";
import Aventurier from "./entity/Aventurier";
import {Action} from "./constants/Action";
import {getEnumKeyByEnumValue} from "../infrastructure/utils/getValueEnum";

export default class LancerLaSequence {

    constructor(private readonly carteRepository: ICarteRepository, private readonly aventurierRepository: IAventurierRepository) {
    }

    executer(): { carte: Carte, aventuriers: Aventurier[] } {
        const carte = this.carteRepository.getCarte();
        const aventuriers = this.aventurierRepository.getAllAventurier();
        const maxCoup = aventuriers.map(({sequence}) => sequence.length).sort((a, b) => b - a)[0]
        for (let coupJoue = 0; coupJoue < maxCoup; coupJoue++) {
            for (const aventurier of aventuriers) {
                const action = Action[getEnumKeyByEnumValue(Action, aventurier.sequence[coupJoue]) || 'A']
                carte.action(action, aventurier)
            }
        }
        return {carte, aventuriers}
    }
}
