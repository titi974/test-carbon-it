import Tresor from "../entity/Tresor";

export default interface ITresorRepository {
    getTresors(): Tresor[]
}
