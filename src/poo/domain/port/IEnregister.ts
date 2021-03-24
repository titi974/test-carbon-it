import Carte from "../entity/Carte";
import Aventurier from "../entity/Aventurier";

export default interface IEnregister {
    executer(carte: Carte,aventurier: Aventurier[]): void
}
