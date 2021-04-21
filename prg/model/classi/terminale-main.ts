import { IPrintabile, targetTerminale } from "../tools";
import chiedi from "prompts";


import superagent from "superagent";
import express from "express";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import * as bodyParser from 'body-parser';
import swaggerUI from "swagger-ui-express";
import { TerminaleClasse } from "./terminale-classe";
//const swaggerUI = require('swagger-ui-express');

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
    GetJSONSwagger() {
        const swaggerJson = ``;

        let tmp2: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        let ritorno = {};
        let rr = {};
        for (let index = 0; index < tmp2.length; index++) {
            const element: TerminaleClasse = tmp2[index];
            const th = element.SettaSwagger();
            rr = { rr, th };
        }

        let gg = {
            "openapi": "3.0.0",
            "servers": [
                {
                    "url": "https://staisicuro.medicaltech.it/",
                    "variables": {},
                    "description": "indirizzo principale"
                },
                {
                    "url": "http://ss-test.medicaltech.it/",
                    "description": "indirizzo secondario nel caso quello principale non dovesse funzionare."
                }
            ],
            "info": {
                "description": "Documentazione delle API con le quali interrogare il server dell'applicazione STAI sicuro, per il momento qui troverai solo le api con le quali interfacciarti alla parte relativa al paziente. \nSe vi sono problemi sollevare degli issues o problemi sulla pagina di github oppure scrivere direttamente una email.",
                "version": "1.0.0",
                "title": "STAI sicuro",
                "termsOfService": "https://github.com/MedicaltechTM/STAI_sicuro"
            }
        };
        ritorno = { gg, rr };
        return ritorno;
    }
    AggiungiSwagger(path: string) {
        const swaggerDocument: object = this.GetJSONSwagger();

        this.serverExpressDecorato.use('/' + path, swaggerUI.serve, swaggerUI.setup(swaggerDocument));
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