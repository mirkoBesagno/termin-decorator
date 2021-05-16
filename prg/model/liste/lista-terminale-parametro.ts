
import { Router, Request, Response } from "express";

import chiedi from "prompts";
import { IRitornoValidatore } from "../classi/terminale-metodo";

import { TypePosizione, TerminaleParametro } from "../classi/terminale-parametro";

export interface IParametri {
    body: string, query: string, header: string
}
export interface INonTrovato {
    nomeParametro: string, posizioneParametro: number
}
export interface IErroreEstrazione {

}
export interface IParametriEstratti {
    valoriParametri: any[], nontrovato: INonTrovato[], errori: IRitornoValidatore[]
}
export class ListaTerminaleParametro extends Array<TerminaleParametro>  {

    constructor() {
        super();
    }

    EstraiParametriDaRequest(richiesta: Request): IParametriEstratti {
        const ritorno: IParametriEstratti = {
            errori: [], nontrovato: [], valoriParametri: []
        };
        for (let index = this.length - 1; index >= 0; index--) {
            const element = this[index];
            let tmp = undefined;
            if (richiesta.body[element.nomeParametro] != undefined) {
                tmp = richiesta.body[element.nomeParametro];
            }
            else if (richiesta.query[element.nomeParametro] != undefined) {
                tmp = richiesta.query[element.nomeParametro];
            }
            else if (richiesta.headers[element.nomeParametro] != undefined) {
                tmp = richiesta.headers[element.nomeParametro];
            }
            else {
                ritorno.nontrovato.push({
                    nomeParametro: element.nomeParametro,
                    posizioneParametro: element.indexParameter
                });
            }
            if (element.Validatore) {
                const rit = element.Validatore(tmp)
                if (rit.approvato == false) {
                    /* rit.terminale = {
                        nomeParametro: element.nomeParametro, posizione: element.posizione, tipoParametro: element.tipoParametro, descrizione: element.descrizione, sommario: element.sommario
                    } */
                    rit.terminale = element;
                    ritorno.errori.push(rit)
                }
            }
            ritorno.valoriParametri.push(tmp);
        }

        return ritorno;
    }
    async SoddisfaParamtri(): Promise<IParametri> {
        let body = '';
        let primo = false;
        console.log('Soddisfa il body:');
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.posizione == 'body') {
                if (index != this.length - 1 && primo == true) {
                    body = body + ', ';
                }
                primo = true;
                const messaggio = "Nome campo :" + element.nomeParametro + "|Tipo campo :"
                    + element.tipoParametro + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                const scelta = await chiedi({ message: messaggio, type: 'text', name: 'scelta' });
                body = body + ' "' + element.nomeParametro + '": ' + ' "' + scelta.scelta + '" ';
            }
        }
        body = body + '';

        let query = '';
        primo = false;
        console.log('Soddisfa le query:');
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.posizione == 'query') {
                if (primo == true) {
                    query = query + ', ';
                }
                primo = true;
                const messaggio = "Nome campo :" + element.nomeParametro + "|Tipo campo :"
                    + element.tipoParametro + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                const scelta = await chiedi({ message: messaggio, type: 'text', name: 'scelta' });
                query = query + ' "' + element.nomeParametro + '": ' + ' "' + scelta.scelta + '" ';
            }
        }
        query = query + '';


        let header = '';
        primo = false;
        console.log("Soddisfa l'header:");
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.posizione == 'header') {
                if (index != this.length - 1 && primo == true) {
                    header = header + ', ';
                }
                primo = true;
                const messaggio = "Nome campo :" + element.nomeParametro + "|Tipo campo :"
                    + element.tipoParametro + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                const scelta = await chiedi({ message: messaggio, type: 'text', name: 'scelta' });
                header = header + ' "' + element.nomeParametro + '": ' + ' "' + scelta.scelta + '" ';
            }
        }
        header = header + '';
        return { body, query, header };
    }
}