import { IPrintabile, targetTerminale } from "../tools";
import chiedi from "prompts";


import superagent from "superagent";
import express from "express";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import * as bodyParser from 'body-parser';

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

    Inizializza(patheader: string) {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        for (let index = 0; index < tmp.length; index++) {
            const element = tmp[index];
            const pathGlobal = '/' + this.path + '/' + element.path;
            element.SettaPathRoot_e_Global(this.path, pathGlobal, patheader);
            this.serverExpressDecorato.use(bodyParser.json({
                limit: '50mb',
                verify(req: any, res, buf, encoding) {
                    req.rawBody = buf;
                }
            }));
            this.serverExpressDecorato.use(pathGlobal, element.rotte);
        }
    }
    async PrintMenu() {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        //console.log("Menu main, digita il numero della la tua scelta: ");
        const scelte = [
            "Stampa albero",
            "Stampa classi",
            'Scegli classe'
        ];
        for (let index = 0; index < scelte.length; index++) {
            const element = scelte[index];
            const tmp = index + 1;
            console.log(tmp + ': ' + element);

        }
        const scelta = await chiedi({ message: 'Menu main, digita il numero della la tua scelta: ', type: 'number', name: 'scelta' });
        switch (scelte[scelta.scelta - 1]) {
            case scelte[0]:
                await tmp.PrintMenu();
                break;
            case scelte[1]:
                await tmp.PrintListaClassi();
                break;
            case scelte[2]:
                await tmp.PrintMenuClassi();
                break;
            default:
                break;
        }
        if (scelta.scelta == 0) {
            console.log("Saluti.");

        } else {
            this.PrintMenu();
        }
    };
    StartExpress() {
        this.serverExpressDecorato.listen(3000);
    }
}