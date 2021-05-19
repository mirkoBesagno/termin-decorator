import { InizializzaLogbaseIn, InizializzaLogbaseOut, IPrintabile, targetTerminale } from "../tools";
import chiedi from "prompts";

import superagent from "superagent";
import express from "express";
import { Request, Response } from "express";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import { urlencoded, json as BodyParseJson } from 'body-parser';
import { SalvaListaClasseMetaData, TerminaleClasse } from "./terminale-classe";
//const swaggerUI = require('swagger-ui-express');
import fs from "fs";

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
/**
 * questa interfaccia aggrega le varie parti di un percorso
 */
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

    Inizializza(patheader: string, porta: number, rottaBase: boolean, creaFile?: boolean) {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        this.percorsi.patheader = patheader;
        this.percorsi.porta = porta;
        const pathGlobal =  '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;

        this.serverExpressDecorato.use(urlencoded({ 'extended': true })); // parse application/x-www-form-urlencoded

        this.serverExpressDecorato.use(BodyParseJson({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

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

        SalvaListaClasseMetaData(tmp);
    }
    /**
     * !! assolutamente da vedere, rifare !
     * @returns 
     */
    GetJSONSwagger() {
        const swaggerJson = ``;

        const tmp2: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        let ritorno = '';
        const rr: object = {};
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

        //this.serverExpressDecorato.use('/' + path, swaggerUI.serve, swaggerUI.setup(JSON.parse(swaggerDocument)));
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
    }

    StartExpress() {
        this.AggiungiHTML();
        var httpServer = http.createServer(this.serverExpressDecorato);
        httpServer.listen(this.percorsi.porta);
        //this.serverExpressDecorato.listen(this.percorsi.porta);
    }
    AggiungiHTML() {
        this.serverExpressDecorato.get("/server", function (req, res) {
            let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
            const text = tmp.GeneraHTML();
            res.status(200).send(text);
        });
    }
    StartExpressConsole(porta: number, header: string) {
        console.log('Inizializzazione inizio .....');

        this.Inizializza(header + ":", porta, true, true);
        this.StartExpress();
        this.PrintMenu();
        
    }
    GeneraStruttura(path: string) {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        var dir = path + '/component-main';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        tmp.GeneraStruttura(dir);
    }

    InizializzaInterattivamente() {
        console.log('Inizializzazione inizio .....');

        chiedi([{
            message: 'Quale porta usare?(default=3030) : ',
            type: 'number', name: 'porta'
        }, {
            message: 'Quale indirizzo esporre?(http://localhost) : ',
            type: 'text', name: 'header'
        }]).then((scelta2) => {
            if (scelta2.porta == undefined || scelta2.porta == 0) scelta2.porta = 3030;
            if (scelta2.header == undefined || scelta2.header == 0) scelta2.header = 'http://localhost';
            this.Inizializza(scelta2.header + ":", scelta2.porta, true, true);
            console.log('..... Inizializzazione fine.');
            const vett: string[] = [
                'express',
                'superagent',
                'aggiungi swagger',
                'express + superagent',
                'todo'
            ];
            console.log('Menu');
            for (let index = 0; index < vett.length; index++) {
                const element = vett[index];
                console.log(index + ' :' + element);
            }

            chiedi({
                message: 'Scegli: ',
                type: 'number',
                name: 'scelta'
            }).then((item) => {
                if (item.scelta == 0) {
                    this.StartExpress();
                } else if (item.scelta == 1) {
                    this.PrintMenu();
                } else if (item.scelta == 2) {
                    const scelta = chiedi({
                        message: 'Rotta dove renderli visibili: ',
                        type: 'text', name: 'scelta'
                    }).then((ris) => {
                        this.AggiungiSwagger(ris.scelta);
                        this.StartExpress();
                    })
                } else if (item.scelta == 3) {
                    this.StartExpress();
                    chiedi({
                        message: 'Rotta dove renderli visibili: ',
                        type: 'text', name: 'scelta'
                    }).then((ris) => {
                        this.PrintMenu();
                    })
                } else {
                    console.log('Ciao ciao ...');
                }

            }).catch(err => {
                console.log(err);

            });
        })
    }
}

import * as http from 'http';