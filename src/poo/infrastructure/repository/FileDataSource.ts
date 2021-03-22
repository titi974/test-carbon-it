import fs from "fs";

export default class FileDataSource {
    constructor(private readonly path: string) {
    }
    get datas(): string{
        return fs.readFileSync(`${this.path}`, {encoding: 'utf8'})
    }
}
