import fs from "fs";

export const faireUneSauvegarde = (path: string) => (data: string): void => {
    try {
        fs.accessSync(path, fs.constants.R_OK)
        fs.unlinkSync(path)
    } catch (e) {

    }
    fs.writeFileSync(path, data, {encoding: "utf8"})
}
