import { InizializzaLogbaseIn, InizializzaLogbaseOut, IPrintabile, targetTerminale } from "../tools";
import chiedi from "prompts";

import superagent from "superagent";
import express from "express";
import { Request, Response } from "express";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import * as bodyParser from 'body-parser';
import swaggerUI from "swagger-ui-express";
import { SalvaListaClasseMetaData, TerminaleClasse } from "./terminale-classe";
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
export interface IRaccoltaPercorsi {
    pathGlobal: string, patheader: string, porta: number
}
export class Main {
    percorsi: IRaccoltaPercorsi;
    path: string;
    serverExpressDecorato: express.Express;
    listaTerminaleClassi: ListaTerminaleClasse;
    constructor(path: string, server?: express.Express) {
        this.path = path;
        this.percorsi = { pathGlobal: "", patheader: "", porta: 0 };
        if (server == undefined) this.serverExpressDecorato = express();
        else this.serverExpressDecorato = server;
        this.listaTerminaleClassi = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
    }

    Inizializza(patheader: string, porta: number, rottaBase: boolean) {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        this.percorsi.patheader = patheader;
        this.percorsi.porta = porta;
        const pathGlobal = /* this.percorsi.patheader + this.percorsi.porta + */ '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;

        this.serverExpressDecorato.use(bodyParser.urlencoded({ 'extended': true })); // parse application/x-www-form-urlencoded
        this.serverExpressDecorato.use(bodyParser.json()); // parse application/json
        this.serverExpressDecorato.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

        this.serverExpressDecorato.route
        for (let index = 0; index < tmp.length; index++) {
            const element = tmp[index];
            /* this.serverExpressDecorato.use(bodyParser.json({
                limit: '50mb',
                verify(req: any, res, buf, encoding) {
                    req.rawBody = buf;
                }
            })); */
            element.SettaPathRoot_e_Global(this.path, this.percorsi, this.serverExpressDecorato);

            //this.serverExpressDecorato.use(element.GetPath, element.rotte);
        }
        /* if (rottaBase)
            this.serverExpressDecorato.all('/*', (req: Request, res: Response) => {
                console.log('Risposta a chiamata : ' + '/*');
                InizializzaLogbaseIn(req, 'IN_GENERICA');
                res.status(555).send('No found');
                InizializzaLogbaseOut(res, 'OUT_GENERICA');
                return res;
            }); */

        SalvaListaClasseMetaData(tmp);
    }
    GetJSONSwagger() {
        const swaggerJson = ``;

        let tmp2: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        let ritorno = '';
        let rr: object = {};
        /* let rr: object = {
            openapi: "3.0.0",
            servers: [
                {
                    url: "https://staisicuro.medicaltech.it/",
                    variables: {},
                    description: "indirizzo principale"
                },
                {
                    url: "http://ss-test.medicaltech.it/",
                    description: "indirizzo secondario nel caso quello principale non dovesse funzionare."
                }
            ],
            info: {
                description: "Documentazione delle API con le quali interrogare il server dell'applicazione STAI sicuro, per il momento qui troverai solo le api con le quali interfacciarti alla parte relativa al paziente. \nSe vi sono problemi sollevare degli issues o problemi sulla pagina di github oppure scrivere direttamente una email.",
                version: "1.0.0",
                title: "STAI sicuro",
                termsOfService: "https://github.com/MedicaltechTM/STAI_sicuro",
                contact: {
                    email: "mirkopizzini93@gmail.com",
                    name: "mirko pizzini",
                    url: "-"
                },
                license: {
                    name: "MIT",
                    url: "https://opensource.org/licenses/MIT"
                }
            }
        }; */

        for (let index = 0; index < tmp2.length; index++) {
            const element: TerminaleClasse = tmp2[index];
            const tt = element.SettaSwagger();
            /* rr = { rr, th }; */
            if (index == 0) ritorno = tt;
            else ritorno = ritorno + ',' + tt;
        }

        let tmp = `{
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
            },
            "tags": [

            ],   
        `+ ritorno +
            '}';

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
            },
            "tags": [

            ],
            paths: {

            }
        };
        try {
            const hhh = tmp.toString();
            console.log(hhh);

            JSON.parse(tmp)
        } catch (error) {
            console.log(error);
        }
        return tmp;
    }
    AggiungiSwagger(path: string) {
        const swaggerDocument = this.GetJSONSwagger();

        this.serverExpressDecorato.use('/' + path, swaggerUI.serve, swaggerUI.setup(JSON.parse(swaggerDocument)));
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

        var httpServer = http.createServer(this.serverExpressDecorato);
        httpServer.listen(this.percorsi.porta);
        //this.serverExpressDecorato.listen(this.percorsi.porta);
    }
}

import * as http from 'http';