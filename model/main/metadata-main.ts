import { GetListaClasseMetaData, IGestorePercorsiPath, IRaccoltaPercorsi, SalvaListaClasseMetaData, targetTerminale } from "../utility";

import { ListaTerminaleClasse } from "../classe/lista-classe";

import express from "express";
import cookieParser from "cookie-parser";
import fs from "fs";
import swaggerUI from "swagger-ui-express";
import * as http from 'http';
import { ITestAPI, ListaTerminaleTest, ListaTerminaleTestAPI } from "../test-funzionale/lista-test-funzionale";
import { GetListaTestAPIMetaData, GetListaTestMetaData, IReturnTest, ITest, SalvaListaTestAPIMetaData, SalvaListaTestMetaData } from "../test-funzionale/utility-test-funzionale";
import { IstanzaClasse } from "../classe/istanza-classe";
import { TerminaleTest, TerminaleTestAPI } from "../test-funzionale/metadata-test-funzionale";
import { StartMonitoring } from "./utility-main";
import { CreateDataBase, DropAllTable, DropDataBase, EseguiQueryControllata, TriggerUpdate_updated_at_column } from "../classe/metadata-classe";
import { Client } from "pg";



export class Main implements IGestorePercorsiPath {
    percorsi: IRaccoltaPercorsi;
    path: string;
    serverExpressDecorato: express.Express;
    listaTerminaleClassi: ListaTerminaleClasse;
    listaTerminaleTest: ListaTerminaleTest;
    httpServer: any;


    constructor(path: string, server?: express.Express) {
        this.path = path;
        this.percorsi = { pathGlobal: "", patheader: "", porta: 0 };
        if (server == undefined) this.serverExpressDecorato = express();
        else this.serverExpressDecorato = server;
        this.listaTerminaleClassi = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        this.listaTerminaleTest = Reflect.getMetadata(ListaTerminaleTest.nomeMetadataKeyTarget, targetTerminale);
    }

    Inizializza(patheader: string, porta: number, rottaBase: boolean, creaFile?: boolean, pathDoveScrivereFile?: string) {
        //const tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);

        const tmp = GetListaClasseMetaData();

        console.log('');
        if (tmp.length > 0) {
            this.percorsi.patheader = patheader;
            this.percorsi.porta = porta;
            const pathGlobal = '/' + this.path;
            this.percorsi.pathGlobal = pathGlobal;

            (<any>this.serverExpressDecorato).use(express.json());
            (<any>this.serverExpressDecorato).use(cookieParser())

            tmp.ConfiguraListaRotteApplicazione(this.path, this.percorsi, this.serverExpressDecorato);

            this.httpServer = http.createServer(this.serverExpressDecorato);

            SalvaListaClasseMetaData(tmp);

            if (pathDoveScrivereFile)
                this.ScriviFile(pathDoveScrivereFile);
        }
        else {
            console.log("Attenzione non vi sono rotte e quantaltro.");
        }

        const list = GetListaClasseMetaData();
        console.log('');
    }
    InizializzaClassi(lista: IstanzaClasse[]) {
        return true;
    }
    async InizializzaORM(client: Client, nomeDatabase?: string) {
        let ritorno = '';
        let ritornoTmp = '';
        if (nomeDatabase)
            ritornoTmp = ritornoTmp + DropAllTable() + '\n';
        EseguiQueryControllata(client, ritornoTmp);
        ritorno = ritornoTmp;
        ritornoTmp = '';
        
        ritornoTmp = ritornoTmp + TriggerUpdate_updated_at_column() + '\n';
        EseguiQueryControllata(client, ritornoTmp);

        ritorno = ritornoTmp;
        ritornoTmp = '';
        for await (const element of this.listaTerminaleClassi) {
            ritorno = ritorno + await element.CostruisciCreazioneDB(client);
        }
        return ritorno;
    }
    async StartTestAPI() {
        for (let index2 = 0; index2 < this.listaTerminaleClassi.length; index2++) {
            const tmpClasse = this.listaTerminaleClassi[index2];
            console.log('Classe :' + tmpClasse);
            for (let index = 0; index < tmpClasse.listaMetodi.length; index++) {
                const tmpMetodo = tmpClasse.listaMetodi[index];
                if (tmpMetodo.listaTest) {
                    for (let index = 0; index < tmpMetodo.listaTest.length; index++) {
                        const element = tmpMetodo.listaTest[index];
                        if (tmpMetodo.interazione == 'rotta' || tmpMetodo.interazione == 'ambo') {
                            const risposta = await tmpMetodo.ChiamaLaRottaConParametri(
                                element.body, element.query, element.header
                            );
                            if (risposta == undefined) {
                                console.log("Risposta undefined!");
                            } else {
                                console.log(risposta)
                            }
                        }
                    }
                }
            }
        }

    }
    StartHttpServer() {
        this.httpServer.listen(this.percorsi.porta);
        StartMonitoring();
    }
    StartExpress() {


        /* this.serverExpressDecorato.use(function (req, res) {
            res.send(404);
        });

        this.serverExpressDecorato.all('*', function (req, res) {
            res.redirect('/');
        }); */

        //

        this.serverExpressDecorato.listen(this.percorsi.porta)

        StartMonitoring();
    }
    async StartTest(numeroRootTest?: number) {

        if (this.listaTerminaleTest) {
            this.listaTerminaleTest.sort((x: TerminaleTest, y: TerminaleTest) => {
                if (x.test.numeroRootTest < x.test.numeroRootTest) return -1;
                else if (x.test.numeroRootTest > x.test.numeroRootTest) return 1;
                else {
                    if (x.test.numero < x.test.numero) return -1;
                    else if (x.test.numero > x.test.numero) return 1;
                    else return 0;
                }
            });
            const risultati = [];
            for (let index = 0; index < this.listaTerminaleTest.length; index++) {
                const test = this.listaTerminaleTest[index];
                if (test.test &&
                    ((numeroRootTest == undefined) || (numeroRootTest == test.test.numeroRootTest))) {
                    console.log("Inizio lista test con nome : " + test.test.nome + ', numero :' + test.test.numero + ' :!:');
                    try {
                        let risultato: IReturnTest | undefined = undefined;
                        if (test.test.testUnita.FunzioniCreaAmbienteEsecuzione) {
                            risultato = await test.test.testUnita.FunzioniCreaAmbienteEsecuzione();
                        }
                        if (test.test.testUnita.FunzioniDaTestare) {
                            risultato = await test.test.testUnita.FunzioniDaTestare();
                        }
                        if (test.test.testUnita.FunzioniDiPulizia) {
                            risultato = await test.test.testUnita.FunzioniDiPulizia();
                        }
                        if (risultato) {
                            if (risultato.passato) {
                                console.log("TEST PASSATO.");
                                risultati.push("Test con nome : " + test.test.nome + ',| numero :' + test.test.numero + ',| passato :PASSATO' + ' :!:');
                            }
                            else {
                                console.log("TEST NON PASSATO.");
                                risultati.push("Test con nome : " + test.test.nome + ',| numero :' + test.test.numero + ',| passato :NON PASSATO' + ' :!:');
                            }
                        } else {
                            console.log("TEST NESSUN RISULTATO.");
                            risultati.push("Test con nome : " + test.test.nome + ',| numero :' + test.test.numero + ',| passato :NESSUN RISULTATO' + ' :!:');
                        }
                    } catch (error) {
                        console.log(error);
                        console.log("TEST IN ERRORE.");
                        risultati.push("Test con nome : " + test.test.nome + ',| numero :' + test.test.numero + ',| passato :TEST IN ERRORE' + ' :!:');
                    }
                    console.log("Fine test con nome : " + test.test.nome + ',| numero :' + test.test.numero + ' :!:');
                }
            }
            console.log('********************************************************************************************************************')
            console.log('********************************************************************************************************************')
            console.log('********************************************************************************************************************')
            console.log('\n\n\n');
            risultati.forEach(element => {
                console.log(element);

            });
            console.log('\n\n\n');
            console.log('********************************************************************************************************************')
            console.log('********************************************************************************************************************')
            console.log('********************************************************************************************************************')
        }
    }
    GetTest() {
        const ritorno: number[] = [];
        if (this.listaTerminaleTest) {
            this.listaTerminaleTest.sort((x: TerminaleTest, y: TerminaleTest) => {
                if (x.test.numeroRootTest < x.test.numeroRootTest) return -1;
                else if (x.test.numeroRootTest > x.test.numeroRootTest) return 1;
                else {
                    if (x.test.numero < x.test.numero) return -1;
                    else if (x.test.numero > x.test.numero) return 1;
                    else return 0;
                }
            });
            for (let index = 0; index < this.listaTerminaleTest.length; index++) {
                const element = this.listaTerminaleTest[index];
                if (ritorno.find(x => { if (x == element.test.numeroRootTest) return true; else return false; }) == undefined) {
                    ritorno.push(element.test.numeroRootTest);
                }
            }
            return ritorno;
        }
        return ritorno;
    }
    AggiungiTest(parametri: ITest[]) {
        const tmp: ListaTerminaleTest = GetListaTestMetaData();
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            tmp.AggiungiElemento(new TerminaleTest(element));
        }
        SalvaListaTestMetaData(tmp);
        this.listaTerminaleTest = Reflect.getMetadata(ListaTerminaleTest.nomeMetadataKeyTarget, targetTerminale);
    }
    AggiungiTestAPI(parametri: ITestAPI[]) {

        const tmp: ListaTerminaleTestAPI = GetListaTestAPIMetaData();
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            tmp.AggiungiElemento((element));
        }
        SalvaListaTestAPIMetaData(tmp);
        this.listaTerminaleTest = Reflect.getMetadata(ListaTerminaleTest.nomeMetadataKeyTarget, targetTerminale);
    }
    /* InizializzaHandlebars() {
        //  this.serverExpressDecorato.engine('handlebars', exphbs());
        // this.serverExpressDecorato.set('view engine', 'handlebars'); 
        ///////////////////////////////////////////////////////////////////////////////////////
        // Configure template Engine and Main Template File
        this.serverExpressDecorato.engine('hbs', exphbs({
            defaultLayout: 'main',
            extname: '.hbs'
        }));
        // Setting template Engine
        this.serverExpressDecorato.set('view engine', 'hbs');

        // routes
        this.serverExpressDecorato.get('/', (req, res) => {
            res.render('home', { msg: 'This is home page' });
        });
        this.serverExpressDecorato.get('/about-us', (req, res) => {
            res.render('about-us');
        });
    } */
    InizializzaSwagger(testo?: string) {
        let ritorno = '';
        try {
            let swaggerClassePath = '';
            for (let index = 0; index < this.listaTerminaleClassi.length; index++) {
                const element = this.listaTerminaleClassi[index];
                const tmp = element.SettaSwagger();
                if (index > 0 && tmp != undefined && tmp != undefined && tmp != '')
                    swaggerClassePath = swaggerClassePath + ', ';
                if (tmp != undefined && tmp != undefined && tmp != '')
                    swaggerClassePath = swaggerClassePath + tmp;
            }
            ritorno = ` {
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
                "description": "Documentazione delle API con le quali interrogare il server dell'applicazione STAI sicuro, per il momento qui troverai solo le api con le quali interfacciarti alla parte relativa al paziente.Se vi sono problemi sollevare degli issues o problemi sulla pagina di github oppure scrivere direttamente una email.",
                "version": "1.0.0",
                "title": "STAI sicuro",
                "termsOfService": "https://github.com/MedicaltechTM/STAI_sicuro"
            },
            "tags": [],
            "paths": {
                ${swaggerClassePath}
            },
            "externalDocs": {
                "description": "Per il momento non vi sono documentazione esterne.",
                "url": "-"
            },
            "components": {
                "schemas": {},
                "securitySchemes": {},
                "links": {},
                "callbacks": {}                
            },
            "security": []
        }`;

            this.serverExpressDecorato.use("/api-docs", swaggerUI.serve, swaggerUI.setup(JSON.parse(ritorno)));

            return ritorno;
        } catch (error) {
            return ritorno;
        }
    }
    /************************************** */
    async PrintMenu() {
        const tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        //console.log("Menu main, digita il numero della la tua scelta: ");
        await tmp.PrintMenuClassi();

    }
    ScriviFile(pathDoveScrivereFile: string) {

        fs.mkdirSync(pathDoveScrivereFile + '/FileGenerati_MP', { recursive: true });

        let ritorno = '';
        try {
            let swaggerClassePath = '';
            for (let index = 0; index < this.listaTerminaleClassi.length; index++) {
                const element = this.listaTerminaleClassi[index];
                const tmp = element.SettaSwagger();
                if (index > 0 && tmp != undefined && tmp != undefined && tmp != '')
                    swaggerClassePath = swaggerClassePath + ', ';
                if (tmp != undefined && tmp != undefined && tmp != '')
                    swaggerClassePath = swaggerClassePath + tmp;
            }
            ritorno = ` {
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
                "description": "Documentazione delle API con le quali interrogare il server dell'applicazione STAI sicuro, per il momento qui troverai solo le api con le quali interfacciarti alla parte relativa al paziente.Se vi sono problemi sollevare degli issues o problemi sulla pagina di github oppure scrivere direttamente una email.",
                "version": "1.0.0",
                "title": "STAI sicuro",
                "termsOfService": "https://github.com/MedicaltechTM/STAI_sicuro"
            },
            "tags": [],
            "paths": {
                ${swaggerClassePath}
            },
            "externalDocs": {
                "description": "Per il momento non vi sono documentazione esterne.",
                "url": "-"
            },
            "components": {
                "schemas": {},
                "securitySchemes": {},
                "links": {},
                "callbacks": {}                
            },
            "security": []
        }`;
        } catch (error) {
            return ritorno;
        }
        fs.writeFileSync(pathDoveScrivereFile + '/FileGenerati_MP' + '/swagger', ritorno);

        ritorno = '';
        try {
            for (let index = 0; index < this.listaTerminaleClassi.length; index++) {
                const classe = this.listaTerminaleClassi[index];
                for (let index = 0; index < classe.listaMetodi.length; index++) {
                    const metodo = classe.listaMetodi[index];
                    ritorno = ritorno + '' + metodo.PrintStruttura() + '';
                }
            }
            fs.writeFileSync(pathDoveScrivereFile + '/FileGenerati_MP' + '/api', ritorno);
        } catch (error) {
            return ritorno;
        }
        ritorno = '';
        return ritorno;
    }
}