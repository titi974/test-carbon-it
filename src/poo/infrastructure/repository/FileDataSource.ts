import fs from "fs";

export default class FileDataSource {
    constructor(private readonly path: string) {
    }
    getDatas(): string{
        return fs.readFileSync(`${this.path}`, {encoding: 'utf8'})
    }
}
