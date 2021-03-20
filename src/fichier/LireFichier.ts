import fs from "fs";

export const lireFichier = (config: string): string => fs.readFileSync(`${config}`, {encoding: 'utf8'})
