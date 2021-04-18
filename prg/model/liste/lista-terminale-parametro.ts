
import { Router, Request, Response } from "express";

import chiedi from "prompts";

import { TypePosizione, TerminaleParametro } from "../classi/terminale-parametro";

export interface IParametri {
    body: string, query: string, header: string
}

export class ListaTerminaleParametro extends Array<TerminaleParametro>  {
    constructor() {
        super();
    }
    EstraiParametriDaRequest(richiesta: Request) {
        const ritorno = [];
        for (let index = 0; index < this.length; index++) {
            const element = this[index];

            //const indice = JSON.stringify(richiesta.body).search(element.nome);
            if (richiesta.body[element.nome] != undefined) {
                const tmp = richiesta.body[element.nome];
                ritorno.push(tmp);
            }
            else if (richiesta.query[element.nome] != undefined) {
                const tmp2 = richiesta.query[element.nome];
                ritorno.push(tmp2);
            }
            else if (richiesta.headers[element.nome] != undefined) {
                const tmp3 = richiesta.headers[element.nome];
                ritorno.push(tmp3);
            }
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
                const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                    + element.tipo + '|Inserire valore :';
                const gg = chiedi;
                const scelta = await gg({ message: messaggio, type: 'text', name: 'scelta' });
                body = body + ' "' + element.nome + '": ' + ' "' + scelta.scelta + '" ';
            }
        }
        body = body + '';

        let query = '';
        primo = false;
        console.log('Soddisfa le query:');
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.posizione == 'query') {
                if (index != this.length - 1 && primo == true) {
                    query = query + ', ';
                }
                primo = true;
                const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                    + element.tipo + '|Inserire valore :';
                const scelta = await chiedi({ message: messaggio, type: 'text', name: 'scelta' });
                query = query + ' "' + element.nome + '": ' + ' "' + scelta.scelta + '" ';
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
                const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                    + element.tipo + '|Inserire valore :';
                const scelta = await chiedi({ message: messaggio, type: 'text', name: 'scelta' });
                header = header + ' "' + element.nome + '": ' + ' "' + scelta.scelta + '" ';
            }
        }
        header = header + '';
        return { body, query, header };
    }
}