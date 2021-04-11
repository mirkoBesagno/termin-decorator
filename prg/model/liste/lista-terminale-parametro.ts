
import { Router, Request, Response } from "express";

import chiedi from "prompts";

import { EPosizione, TerminaleParametro } from "../classi/terminale-parametro";

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
        }
        return ritorno;

    }
    async SoddisfaParamtri() {
        let body = '{';
        let primo = false;
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.posizione == EPosizione.body) {
                if (index != this.length - 1 && primo == true) {
                    body = body + ', ';
                }
                primo = true;
                const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                    + element.tipo + '|Inserire valore :';
                const scelta = await chiedi({ message: messaggio, type: 'text', name: 'scelta' });
                body = body + ' "' + element.nome + '": ' + ' "' + scelta.scelta + '" ';
            }

            if (index == this.length - 1) {
                body = body + ' }';
            } 
        }

        let query = '{';
        primo=false;
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.posizione == EPosizione.query) {                
                if (index != this.length - 1 && primo == true) {
                    body = body + ', ';
                }
                primo = true;
                const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                    + element.tipo + '|Inserire valore :';
                const scelta = await chiedi({ message: messaggio, type: 'text', name: 'scelta' });
                query = query + ' "' + element.nome + '": ' + ' "' + scelta.scelta + '" ';
            }
            if (index == this.length - 1) {
                query = query + ' }';
            }
        }

        return { body, query };
    }
}