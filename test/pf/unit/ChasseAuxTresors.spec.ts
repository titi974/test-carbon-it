import path from "path";
import fs from "fs";
import {lireFichier} from "../../../src/pf/fichier/LireFichier";
import {mapStringWithReturnCharactersToArrays} from "../../../src/pf/fichier/MapStringWithReturnCharactersToArray";
import {Carte, getCarte} from "../../../src/pf/domain/Carte";
import {getMontagnes, Montagne} from "../../../src/pf/domain/Montagne";
import {getTresors, Tresor} from "../../../src/pf/domain/Tresor";
import {Aventurier, getAventurier} from "../../../src/pf/domain/Aventurier";
import {Action} from "../../../src/pf/domain/constants/Action";
import {sOrienter} from "../../../src/pf/use-case/SOrienter";
import {PointsCardinaux} from "../../../src/pf/domain/constants/PointsCardinaux";
import {Avancer} from "../../../src/pf/use-case/Avancer";
import {Coordonnee} from "../../../src/pf/domain/Coordonnee";
import {prendreTresor} from "../../../src/pf/use-case/PrendreLeTresor";
import {finDeLaChasse, SePromener} from "../../../src/pf/use-case/SePromener";
import {faireUneSauvegarde} from "../../../src/pf/fichier/SauvegarderFichier";
import {mapperToDrawCarte} from "../../../src/pf/fichier/mapperToDrawCarte";
import {mapperToVerboseCarte} from "../../../src/pf/fichier/MapperToVerboseCarte";

describe('Chasse aux trésors', () => {
    const root = path.join(path.dirname(__dirname),'..', 'files')
    describe('trouver le fichier', () => {
        it('error', () => {
            // Given
            const file = 'badFile.txt'
            // When
            try {
                lireFichier(path.join(root, file))
                expect(true).toEqual(false)
            } catch (e) {
                // Then
                expect(e.message).toMatch('no such file or directory')
            }
        })
        it('success', () => {
            // Given
            const file = 'chasseAuxTresors.txt'
            // When
            const data = lireFichier(path.join(root, file))
            // Then
            expect(data).toEqual("C - 3 - 4\n" +
                "M - 1 - 0\n" +
                "M - 2 - 1\n" +
                "T - 0 - 3 - 2\n" +
                "T - 1 - 3 - 3\n" +
                "A - Lara - 1 - 1 - S - AADADAGGA" +
                "\n")
        })
    })
    it('transformer les lignes en tableau', () => {
        // Given
        const file = 'chasseAuxTresors.txt'
        const datas = lireFichier(path.join(root, file))
        // When
        const lines = mapStringWithReturnCharactersToArrays(datas)
        // Then
        expect(lines).toEqual([['C', '3', '4'], ['M', '1', '0'], ['M', '2', '1'], ['T', '0', '3', '2'], ['T', '1', '3', '3'], ['A', 'Lara', '1', '1', 'S', 'AADADAGGA']])
    })
    it('Lignes sans commentaire', () => {
        // Given
        const file = 'chasseAuxTresorsAvecCommentaire.txt'
        const datas = lireFichier(path.join(root, file))
        // When
        const lines = mapStringWithReturnCharactersToArrays(datas)
        // Then
        expect(lines).toEqual([['C', '3', '4'], ['M', '2', '1'], ['T', '0', '3', '2'], ['T', '1', '3', '3'], ['A', 'Lara', '1', '1', 'S', 'AADADAGGA']])
    })
    describe('Transform données en domain', () => {
        const file = 'chasseAuxTresors.txt'
        const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
        describe('Create Carte', () => {
            it('avec sucess', () => {
                // Given When
                const carte = getCarte(lines)
                // // Then
                expect(carte).toEqual({type: 'C', longueur: 3, hauteur: 4, tresors: [], montagnes: []})
            })
            it('erreur ce n\'est pas un rectangle', () => {
                // Given
                const linesCarte = [['C', '4', '4']]
                //When // Then
                expect(() => getCarte(linesCarte)).toThrowError('La carte n\'est pas un rectangle')
            })
        })
        it('Create Montagnes entity', () => {
            // Given When
            const montains: Montagne[] = getMontagnes(lines)
            // // Then
            expect(montains).toEqual([{type: 'M', coordonnee: {x: 1, y: 0}}, {type: 'M', coordonnee: {x: 2, y: 1}}])
        })
        it('Create Tresors entity', () => {
            // Given When
            const tresors: Tresor[] = getTresors(lines)
            // // Then
            expect(tresors).toEqual([
                {
                    type: 'T',
                    coordonnee: {x: 0, y: 3},
                    nombre: 2
                },
                {
                    type: 'T',
                    coordonnee: {x: 1, y: 3},
                    nombre: 3
                }])
        })
        describe('Create aventurier', () => {
            it('Un seul', () => {
                // Given When
                const aventurier: Aventurier[] = getAventurier(lines)
                // // Then
                expect(aventurier).toEqual([{
                    type: 'A',
                    name: 'Lara',
                    position: {x: 1, y: 1},
                    orientation: 'S',
                    tresors: 0,
                    mouvements: 'AADADAGGA'
                }])
            })
            it('Plusieurs', () => {
                // Given
                const fileMulti = 'chasseAuxTresorsMultiJoueurs.txt'
                const linesMulti = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, fileMulti)))
                // When
                const aventurier: Aventurier[] = getAventurier(linesMulti)
                // // Then
                expect(aventurier).toEqual([{
                    type: 'A',
                    name: 'Lara',
                    position: {x: 1, y: 1},
                    orientation: 'S',
                    tresors: 0,
                    mouvements: 'AADADAGGA'
                }, {
                    type: 'A',
                    name: 'Thierry',
                    position: {x: 1, y: 2},
                    orientation: 'E',
                    tresors: 0,
                    mouvements: 'AADADAGGA'
                }])
            })
        })
    })
    describe("s'orentier", () => {
        describe('vers la Droite', () => {
            it('orientaion N => O', () => {
                // Given
                let orientation = PointsCardinaux.N.toString()
                // When
                const result = sOrienter(orientation)(Action.D)
                // Then
                expect(result).toEqual(PointsCardinaux.O)
            })
            it('orientaion E => N', () => {
                // Given
                let orientation = PointsCardinaux.E.toString()
                // When
                const result = sOrienter(orientation)(Action.D)
                // Then
                expect(result).toEqual(PointsCardinaux.N)
            })
            it('orientaion 4 fois partir du N revenir au N', () => {
                // Given
                let orientation = PointsCardinaux.N.toString()
                // When Then
                orientation = sOrienter(orientation)(Action.D)
                expect(orientation).toEqual(PointsCardinaux.O)
                orientation = sOrienter(orientation)(Action.D)
                expect(orientation).toEqual(PointsCardinaux.S)
                orientation = sOrienter(orientation)(Action.D)
                expect(orientation).toEqual(PointsCardinaux.E)
                orientation = sOrienter(orientation)(Action.D)
                expect(orientation).toEqual(PointsCardinaux.N)
            })
        })
        describe('vers la Gauche', () => {
            it('orientaion N => E', () => {
                // Given
                let orientation = PointsCardinaux.N.toString()
                // When
                const result = sOrienter(orientation)(Action.G)
                // Then
                expect(result).toEqual(PointsCardinaux.E)

            })
            it('orientaion O => N', () => {
                // Given
                let orientation = PointsCardinaux.O.toString()
                // When
                const result = sOrienter(orientation)(Action.G)
                // Then
                expect(result).toEqual(PointsCardinaux.N)

            })
            it('orientaion 4 fois partir du N revenir au N', () => {
                // Given ['N', 'O', 'S', 'E']
                let orientation = PointsCardinaux.N.toString()
                // When Then
                orientation = sOrienter(orientation)(Action.G)
                expect(orientation).toEqual(PointsCardinaux.E)
                orientation = sOrienter(orientation)(Action.G)
                expect(orientation).toEqual(PointsCardinaux.S)
                orientation = sOrienter(orientation)(Action.G)
                expect(orientation).toEqual(PointsCardinaux.O)
                orientation = sOrienter(orientation)(Action.G)
                expect(orientation).toEqual(PointsCardinaux.N)
            })
        })
    })
    describe('Avancer', () => {
        it('orientatioin Nord {x:1,y:1} => {x:1,y:0}', () => {
            // Given
            const orientation: PointsCardinaux = PointsCardinaux.N
            const position: Coordonnee = {x: 1, y: 1}
            // When
            const newPosition = Avancer(position)(orientation);
            // Then
            expect(newPosition).toEqual({x: 1, y: 0})
        })
        it('orientatioin Sud {x:1,y:1} => {x:1,y:2}', () => {
            // Given
            const orientation: PointsCardinaux = PointsCardinaux.S
            const position: Coordonnee = {x: 1, y: 1}
            // When
            const newPosition = Avancer(position)(orientation);
            // Then
            expect(newPosition).toEqual({x: 1, y: 2})
        })
        it('orientatioin Est {x:1,y:1} => {x:0,y:1}', () => {
            // Given
            const orientation: PointsCardinaux = PointsCardinaux.E
            const position: Coordonnee = {x: 1, y: 1}
            // When
            const newPosition = Avancer(position)(orientation);
            // Then
            expect(newPosition).toEqual({x: 0, y: 1})
        })
        it('orientatioin Ouext {x:2,y:1} => {x:1,y:1}', () => {
            // Given
            const orientation: PointsCardinaux = PointsCardinaux.O
            const position: Coordonnee = {x: 1, y: 1}
            // When
            const newPosition = Avancer(position)(orientation);
            // Then
            expect(newPosition).toEqual({x: 2, y: 1})
        })
    })
    it('prendre le trésor', () => {
        // Given
        const file = 'chasseAuxTresors.txt'
        const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
        const carte = getCarte(lines)
        carte.tresors = [{type: 'T', coordonnee: {x: 1, y: 1}, nombre: 2}]
        const aventurier: Aventurier = getAventurier(lines)[0]
        // When
        const result = prendreTresor(carte)(aventurier)
        // Then
        expect(result.tresors[0].nombre).toEqual(1)
        expect(result.aventurier).toEqual(1)
    })
    describe('Se promener', () => {
        describe('avec un joueur', () => {
            let carte: Carte
            let aventurier: Aventurier
            beforeEach(() => {
                // Given
                carte = {
                    type: 'C',
                    longueur: 3,
                    hauteur: 4,
                    tresors: [],
                    montagnes: []
                }
                aventurier = {
                    type: 'A',
                    name: 'Test',
                    orientation: PointsCardinaux.S,
                    position: {x: 1, y: 1},
                    tresors: 0,
                    mouvements: 'AADA'
                }
            })
            it('avec success', () => {
                // When
                const trajet = SePromener(carte)([aventurier])
                // Then
                expect(trajet).toEqual({
                    aventuriers: [{...aventurier, position: {x: 0, y: 3}, orientation: 'E'}],
                    carte
                })
            })
            it('en trouvant un trésor', () => {
                // Given
                carte.tresors = [{type: 'T', coordonnee: {x: 1, y: 3}, nombre: 2}]
                // When
                const trajet = SePromener(carte)([aventurier])
                // Then
                expect(trajet).toEqual({
                    aventuriers: [{...aventurier, position: {x: 0, y: 3}, orientation: 'E', tresors: 1}],
                    carte: {...carte, tresors: [{type: 'T', coordonnee: {x: 1, y: 3}, nombre: 1}]}
                })
            })
            it('en rencontrant une montagne', () => {
                // Given
                carte.montagnes = [{type: 'M', coordonnee: {x: 1, y: 3}}]
                // When
                const trajet = SePromener(carte)([aventurier])
                // Then
                expect(trajet).toEqual({
                    aventuriers: [{...aventurier, position: {x: 0, y: 2}, orientation: 'E'}],
                    carte
                })
            })
        })
        describe('avec plusieurs joueurs', () => {
            let carte: Carte
            let aventuriers: Aventurier[]
            beforeEach(() => {
                // Given
                carte = {
                    type: 'C',
                    longueur: 3,
                    hauteur: 4,
                    tresors: [],
                    montagnes: []
                }
                aventuriers = [{
                    type: 'A',
                    name: 'Test',
                    orientation: PointsCardinaux.S,
                    position: {x: 1, y: 1},
                    tresors: 0,
                    mouvements: 'AADA'
                }, {
                    type: 'A',
                    name: 'Test2',
                    orientation: PointsCardinaux.S,
                    position: {x: 0, y: 1},
                    tresors: 0,
                    mouvements: 'AGAA'
                }]
            })
            it('avec success', () => {
                // When
                const trajet = SePromener(carte)(aventuriers)
                // Then
                expect(trajet).toEqual({
                    aventuriers: [
                        {
                            ...aventuriers[0],
                            position: {x: 0, y: 3},
                            orientation: 'E'
                        },
                        {
                            ...aventuriers[1],
                            position: {x: 2, y: 2},
                            orientation: 'O'
                        }],
                    carte
                })
            })
            it('en trouvant un trésor', () => {
                // Given
                carte.tresors = [{type: 'T', coordonnee: {x: 1, y: 3}, nombre: 2}]
                // When
                const trajet = SePromener(carte)(aventuriers)
                // Then
                expect(trajet).toEqual({
                    aventuriers: [
                        {
                            ...aventuriers[0],
                            position: {x: 0, y: 3},
                            orientation: 'E',
                            tresors: 1
                        },
                        {
                            ...aventuriers[1],
                            position: {x: 2, y: 2},
                            orientation: 'O'
                        }],
                    carte: {...carte, tresors: [{type: 'T', coordonnee: {x: 1, y: 3}, nombre: 1}]}
                })
            })
            it('en rencontrant une montagne', () => {
                // Given
                carte.montagnes = [{type: 'M', coordonnee: {x: 1, y: 3}}]
                // When
                const trajet = SePromener(carte)(aventuriers)
                // Then
                expect(trajet).toEqual({aventuriers: [
                        {
                            ...aventuriers[0],
                            position: {x: 1, y: 2},
                            orientation: 'E'
                        },
                        {
                            ...aventuriers[1],
                            position: {x: 0, y: 2},
                            orientation: 'O'
                        }], carte})
            })
            it('si il y a déjà un autre aventurier sur la case', () => {
                // Given
                aventuriers[0] = {
                    type: 'A',
                    name: 'Test',
                    orientation: PointsCardinaux.S,
                    position: {x: 1, y: 1},
                    tresors: 0,
                    mouvements: 'AA'
                }
                aventuriers[1] = {
                    type: 'A',
                    name: 'Test2',
                    orientation: PointsCardinaux.N,
                    position: {x: 1, y: 3},
                    tresors: 0,
                    mouvements: 'AA'
                }
                // When
                const trajet = SePromener(carte)(aventuriers)
                // Then
                expect(trajet).toEqual({aventuriers: [
                        {
                            ...aventuriers[0],
                            position: {x: 1, y: 2},
                            orientation: 'S'
                        },
                        {
                            ...aventuriers[1],
                            position: {x: 1, y: 3},
                            orientation: 'N'
                        }], carte})
            })
        })
    })
    describe('Enregistrer la fin de la chasse', () => {
        const fileSvg = 'chasseAuxTresorsResultat.txt'
        const chasseAuxTresors = (): finDeLaChasse => {
            const carte: Carte = {
                type: 'C',
                longueur: 3,
                hauteur: 4,
                tresors: [
                    {type: 'T', coordonnee: {x: 0, y: 3}, nombre: 2},
                    {type: 'T', coordonnee: {x: 1, y: 3}, nombre: 3}],
                montagnes: [
                    {type: 'M', coordonnee: {x: 1, y: 0}},
                    {type: 'M', coordonnee: {x: 2, y: 1}}]
            }
            const aventurier: Aventurier = {
                type: 'A',
                name: 'Test',
                orientation: PointsCardinaux.S,
                position: {x: 1, y: 1},
                tresors: 0,
                mouvements: 'AADADAGGA'
            }
            return SePromener(carte)([aventurier])
        }
        it('au format schema', () => {
            // Given
            const fileSvg = 'chasseAuxTresorsResultat.txt'
            try {
                fs.unlinkSync(path.join(root, fileSvg))
            } catch (e) {
                console.log(e)
            }
            const sauvegarder = faireUneSauvegarde(path.join(root, fileSvg))
            // When
            sauvegarder(mapperToDrawCarte(chasseAuxTresors()))
            // Then
            const datas = lireFichier(path.join(root, fileSvg))
            expect(datas).toEqual("* M *\r* * M\r* * *\rA(Test) T(2) *")
        })
        it('au format verbeux', () => {
            // Given
            try {
                fs.unlinkSync(path.join(root, fileSvg))
            } catch (e) {
                console.log(e)
            }
            const sauvegarder = faireUneSauvegarde(path.join(root, fileSvg))
            // When
            sauvegarder(mapperToVerboseCarte(chasseAuxTresors()))
            // Then
            const datas = lireFichier(path.join(root, fileSvg))
            expect(datas).toEqual("C - 3 - 4\rM - 1 - 0\rM - 2 - 1\rT - 1 - 3 - 2\rA - Test - 0 - 3 - S - AADADAGGA")
        })
    })

});
