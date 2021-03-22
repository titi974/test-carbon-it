import Montagne from "../entity/Montagne";


export default interface IMontagneRepository {
    getMontagnes(): Montagne[]
}
