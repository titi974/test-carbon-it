import ChasseAuxTresorsRepository from "../../infrastructure/repository/ChasseAuxTresorsRepository";
import FileDataSource from "../../infrastructure/repository/FileDataSource";
import path from "path";

const root = path.join(__dirname,'..', 'file')
new ChasseAuxTresorsRepository(new FileDataSource(path.join(root,'chasseAuxTresors.txt')));
