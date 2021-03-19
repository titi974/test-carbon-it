import fs from "fs";

export const lireFichier = (config: string): string => fs.readFileSync(`${config}`, 'utf8')
