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
export function mpMain(path: string) {
    return function (ctr: Function) {
        //tmp.PrintMenu();
        ctr.prototype.serverExpressDecorato = express();
        /* ctr.prototype.Inizializza = () => {
            let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
            for (let index = 0; index < tmp.length; index++) {
                const element = tmp[index];
                element.SettaPathRoot_e_Global(path, '/' + path + '/' + element.path);
                ctr.prototype.serverExpressDecorato.use('/' + path + '/' + element.path, element.rotte);
            }
        }
        ctr.prototype.PrintMenu = () => {
            let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
            console.log("mpMain" + ' -> ' + 'PrintMenu');
            tmp.PrintMenu();
        }; */
    }
}
export class Main {
    path: string;
    serverExpressDecorato: express.Express;
    listaTerminaleClassi: ListaTerminaleClasse;
    constructor(path: string, server?: express.Express) {
        this.path = path;
        if (server == undefined) this.serverExpressDecorato = express();
        else this.serverExpressDecorato = server;
        this.listaTerminaleClassi = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
    }

    Inizializza() {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        for (let index = 0; index < tmp.length; index++) {
            const element = tmp[index];
            const pathGlobal = '/' + this.path + '/' + element.path;
            element.SettaPathRoot_e_Global(this.path, pathGlobal);
            this.serverExpressDecorato.use(pathGlobal, element.rotte);
        }
    }
    PrintMenu() {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        console.log("mpMain" + ' -> ' + 'PrintMenu');
        tmp.PrintMenu();
        /* const listaClassi: ListaTerminaleClasse = new ListaTerminaleClasse();
        tmp.PrintMenu(); */
    };
    StartExpress() {
        this.serverExpressDecorato.listen(3000);
    }
}