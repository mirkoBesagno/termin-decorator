import { ListaTerminaleClasse } from "./lista-classe";
import { CheckClasseMetaData, IClasse } from "./utility-classe";

import fs from 'fs';
import { IstanzaMetodo } from "../metodo/istanza-metodo";
import { GetListaClasseMetaData, SalvaListaClasseMetaData } from "../utility-function";

export class IstanzaClasse {
    constructor(parametri: IClasse, nomeClasse: string, listaMetodi?: IstanzaMetodo[]) {

        const tmp: ListaTerminaleClasse = GetListaClasseMetaData(1);
        const classe = CheckClasseMetaData(nomeClasse);
        /* 
                if (parametri.listaTest) classe.listaTest = parametri.listaTest; */

        if (parametri.percorso) classe.SetPath = parametri.percorso;
        else classe.SetPath = nomeClasse;

        if (parametri.html) {
            classe.html = [];
            for (let index = 0; index < parametri.html.length; index++) {
                const element = parametri.html[index];
                if (element.percorsoIndipendente == undefined) element.percorsoIndipendente = false;

                if (element.html != undefined && element.htmlPath == undefined
                    && classe.html.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    classe.html.push({
                        contenuto: element.html,
                        path: element.path,
                        percorsoIndipendente: element.percorsoIndipendente
                    });
                } else if (element.html == undefined && element.htmlPath != undefined
                    && classe.html.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    try {
                        classe.html.push({
                            contenuto: fs.readFileSync(element.htmlPath).toString(),
                            path: element.path,
                            percorsoIndipendente: element.percorsoIndipendente
                        });
                    } catch (error) {
                        classe.html.push({
                            contenuto: 'Nessun contenuto',
                            path: element.path,
                            percorsoIndipendente: element.percorsoIndipendente
                        });
                    }
                }
            }
        }

        if (parametri.LogGenerale) {
            classe.listaMetodi.forEach(element => {
                if (element.onLog == undefined)
                    element.onLog = parametri.LogGenerale;
            });
        }

        if (parametri.Inizializzatore) {
            classe.listaMetodi.forEach(element => {
                let contiene = false;
                element.listaParametri.forEach(element => {
                    if (element.autenticatore == true) contiene = true;
                });
                if (contiene) element.Istanziatore = parametri.Inizializzatore;
            });
        }

        if (parametri.cacheOptionMemory) {
            classe.listaMetodi.forEach(element => {
                if (element.cacheOptionMemory == undefined) {
                    element.cacheOptionMemory = parametri.cacheOptionMemory ?? { durationSecondi: 1 };
                }
            })
        }

        if (parametri.classeSwagger && parametri.classeSwagger != '') {
            classe.classeSwagger = parametri.classeSwagger;
            classe.listaMetodi.forEach(element => {
                if (element.swaggerClassi) {
                    const ris = element.swaggerClassi.find(x => { if (x == parametri.classeSwagger) return true; else return false; })
                    if (ris == undefined && parametri.classeSwagger) {
                        element.swaggerClassi.push(parametri.classeSwagger);
                    }
                }
            });
        }

        SalvaListaClasseMetaData(tmp);
    }
}