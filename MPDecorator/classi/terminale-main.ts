import { IPrintabile, targetTerminale } from "../tools";
import chiedi from "prompts";


import superagent from "superagent";
import express from "express";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";

class TerminaleMain implements IPrintabile {
    listaClassi: ListaTerminaleClasse;
    constructor() {
        this.listaClassi = new ListaTerminaleClasse();
    }
    Start() {
        let listaClassi = Reflect.getMetadata('info', targetTerminale);
        this.listaClassi = listaClassi;
        this.PrintMenu();
    }
    async PrintMenu() {
        console.log("Scegli una classe:\n");

        for (let index = 0; index < this.listaClassi.length; index++) {
            const element = this.listaClassi[index];
            console.log(index + ":\n");
            element.PrintCredenziali();
        }
        const risultato = await chiedi({ name: "scelta", message: "Digita la scelta :", type: "number" });
        if (risultato.scelta != 0) {
            this.listaClassi[risultato.scelta].PrintMenu();
        } else {

        }
    }

}

/**
 * 
 */
export function mpMain(path:string) {
    return function (ctr: Function) {
        //tmp.PrintMenu();
        ctr.prototype.serverExpressDecorato = express();
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        for (let index = 0; index < tmp.length; index++) {
            const element = tmp[index];
            ctr.prototype.serverExpressDecorato.use('/'+path+'/' + element.path, element.rotte);
        }
        ctr.prototype.PrintMenu = () => {
            console.log("mpMain" + '->' + 'PrintMenu');

            tmp.PrintMenu();
            /* const listaClassi: ListaTerminaleClasse = new ListaTerminaleClasse();
            tmp.PrintMenu(); */
        };
    }

}