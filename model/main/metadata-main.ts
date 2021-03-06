import { EseguiQueryControllata, GetListaClasseMetaData, IConnectionOption, IGestorePercorsiPath, IRaccoltaPercorsi, ISpawTrigger, ReturnQueryControllata, SalvaListaClasseMetaData, targetTerminale } from "../utility";

import { ListaTerminaleClasse } from "../classe/lista-classe";

import express from "express";
import cookieParser from "cookie-parser";
import fs from "fs";
import swaggerUI from "swagger-ui-express";
import * as http from 'http';
import { ITestAPI, ListaTerminaleTest, ListaTerminaleTestAPI } from "../test-funzionale/lista-test-funzionale";
import { GetListaTestAPIMetaData, GetListaTestMetaData, IReturnTest, ITest, SalvaListaTestAPIMetaData, SalvaListaTestMetaData } from "../test-funzionale/utility-test-funzionale";
import { TerminaleTest } from "../test-funzionale/metadata-test-funzionale";
import { StartMonitoring } from "./utility-main";
import { DropAllTable, TriggerUpdate_updated_at_column } from "../postgres/tabella";

import superagent from "superagent";
import { Role, User } from "../postgres/role";

import httpProxy from "http-proxy";


import nodecache from "node-cache";

/* export class User {
    nome: string;
    option: {
        creaTabelle: boolean,
        creaUser: boolean
    };
    inGroup: string[];
    constructor() {
        this.nome = '';
        this.option = { creaTabelle: false, creaUser: false };
        this.inGroup = [];
    }
} */

export interface ICache { body: object, stato: number }

export class Main implements IGestorePercorsiPath {
    static cache = new nodecache();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static proxyServer: any;
    static portaProxy = 8080;
    static portaProcesso = 8081;
    static vettoreProcessi: { porta: number, nomeVariabile: string, valoreValiabile: string, vettorePossibiliPosizioni: ISpawTrigger[], processo: any }[] = [];
    static pathExe = './dist/index-esempio.js --porta=';
    static isSottoProcesso = false;

    /* isMultiProcesso = false; */
    percorsi: IRaccoltaPercorsi;
    path: string;
    serverExpressDecorato: express.Express;
    listaTerminaleClassi: ListaTerminaleClasse;
    listaTerminaleTest: ListaTerminaleTest;
    listaRuoli?: Role[];
    listaUser?: User[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpServer: any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpProxy: any;


    constructor(path: string, server?: express.Express, isMultiProcesso?: boolean) {
        if (isMultiProcesso) {
            Main.isSottoProcesso = isMultiProcesso;
            //this.isMultiProcesso = isMultiProcesso;
        }
        this.path = path;
        this.percorsi = { pathGlobal: "", patheader: "", porta: 0 };
        if (server == undefined) this.serverExpressDecorato = express();
        else this.serverExpressDecorato = server;
        this.listaTerminaleClassi = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        this.listaTerminaleTest = Reflect.getMetadata(ListaTerminaleTest.nomeMetadataKeyTarget, targetTerminale);
    }

    InizializzaPathExe(item: string): void {
        Main.pathExe = item;
    }

    Inizializza(patheader: string, porta: number, /* rottaBase: boolean, creaFile?: boolean, */
        pathDoveScrivereFile?: string, sottoprocesso?: boolean): void {
        //const tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        if (sottoprocesso) Main.isSottoProcesso = sottoprocesso
        const tmp = GetListaClasseMetaData();
        console.log('');
        if (tmp.length > 0) {
            this.percorsi.patheader = patheader;
            this.percorsi.porta = porta;
            const pathGlobal = '/' + this.path;
            this.percorsi.pathGlobal = pathGlobal;

            (this.serverExpressDecorato).use(express.json());
            (this.serverExpressDecorato).use(cookieParser());

            tmp.ConfiguraListaRotteApplicazione(this.path, this.percorsi, this.serverExpressDecorato);

            this.httpServer = http.createServer(this.serverExpressDecorato);

            SalvaListaClasseMetaData(tmp);

            if (pathDoveScrivereFile)
                this.ScriviFile(pathDoveScrivereFile);
        }
        else {
            console.log("Attenzione non vi sono rotte e quantaltro.");
        }

        //const list = GetListaClasseMetaData();
        console.log('');
    }
    InizializzaORM(/* client: Client */elencoQuery: string[], listaRuoli?: Role[], listaUser?: User[]): string {
        const ritorno = '';
        if (listaRuoli) this.listaRuoli = listaRuoli;
        if (listaUser) this.listaUser = listaUser;

        elencoQuery.push(`CREATE EXTENSION plv8;`);

        elencoQuery.push(DropAllTable());

        elencoQuery.push(TriggerUpdate_updated_at_column());
        this.InizializzaRuoli(elencoQuery, listaRuoli);
        this.InizializzaUser(elencoQuery, listaUser);
        /*  */

        for (const element of this.listaTerminaleClassi) {
            element.CostruisciCreazioneDB(elencoQuery, true);
        }
        for (const element of this.listaTerminaleClassi) {
            element.CostruisciCreazioneDB(elencoQuery, false);
        }
        for (const element of this.listaTerminaleClassi) {
            element.CostruisciRelazioniDB(elencoQuery);
        }
        for (const element of this.listaTerminaleClassi) {
            element.CostruisceGrant(element.grants ?? [], elencoQuery);
        }

        for (const element of this.listaTerminaleClassi) {
            if (element.listaPolicy)
                element.listaPolicy.CostruiscePolicySicurezza(elencoQuery);
        }

        this.InizializzaRuoliGrantGenerale(elencoQuery, listaRuoli);
        this.InizializzaUserGrantGenerale(elencoQuery, listaUser);
        return ritorno;
    }
    async EseguiListaQuery(clientConnection: IConnectionOption, querys: string[]): Promise<ReturnQueryControllata[]> {
        const tmp = await EseguiQueryControllata(clientConnection, querys);
        return tmp;
    }

    private InizializzaRuoli(/* client: Client */elencoQuery: string[], listaRuoli?: Role[]) {
        let ritornoTmp = '';
        if (listaRuoli) {
            for (let index = 0; index < listaRuoli.length; index++) {
                const element = listaRuoli[index];
                const faxs = `CREATE ROLE ${element.nome} WITH 
                ${element.option.isSuperUser != undefined && element.option.isSuperUser == true ? 'SUPERUSER' : 'NOSUPERUSER'} 
                ${element.option.creaDB != undefined && element.option.creaDB == true ? 'CREATEDB' : 'NOCREATEDB'}
                ${element.option.creaUser != undefined && element.option.creaUser == true ? 'CREATEROLE' : 'NOCREATEROLE'} 
                INHERIT 
                ${element.option.login != undefined && element.option.login == true ? 'LOGIN' : 'NOLOGIN'} 
                NOREPLICATION   
                NOBYPASSRLS 
                ENCRYPTED PASSWORD '${element.password}' 
                ${element.option.connectionLimit != undefined ? 'CONNECTION LIMIT ' + element.option.connectionLimit : ''} 
                ; \n`;
                const faxsDrop = `DROP ROLE IF EXISTS ${element.nome};`;
                elencoQuery.push(faxsDrop);
                elencoQuery.push(faxs);
                ritornoTmp = faxs;
            }
        }
        return ritornoTmp;
    }
    private InizializzaRuoliGrantGenerale(/* client: Client */elencoQuery: string[], listaRuoli?: Role[]) {
        let ritornoTmp = '';
        if (listaRuoli) {
            for (let index = 0; index < listaRuoli.length; index++) {
                const element = listaRuoli[index];
                const faxSchema = `GRANT USAGE
                ON ALL SEQUENCES IN SCHEMA public
                TO ${element.nome} ;`;
                elencoQuery.push(faxSchema);
                const faxFunction = `GRANT EXECUTE
                ON ALL functions IN SCHEMA public
                    TO ${element.nome};`;
                elencoQuery.push(faxFunction);
                ritornoTmp = faxSchema;
            }
        }
        return ritornoTmp;
    }
    private InizializzaUser(/* client: Client */elencoQuery: string[], listaUser?: User[]) {
        let ritornoTmp = '';
        if (listaUser) {
            for (let index = 0; index < listaUser.length; index++) {
                const element = listaUser[index];
                const costruisciRuoli = this.CostruisciRuoli(element.inRole);
                const faxs = `CREATE USER ${element.nome} WITH 
                ${element.option.isSuperUser != undefined && element.option.isSuperUser == true ? 'SUPERUSER' : 'NOSUPERUSER'} 
                ${element.option.creaDB != undefined && element.option.creaDB == true ? 'CREATEDB' : 'NOCREATEDB'}
                ${element.option.creaUser != undefined && element.option.creaUser == true ? 'CREATEROLE' : 'NOCREATEROLE'} 
                INHERIT 
                ${element.option.login != undefined && element.option.login == true ? 'LOGIN' : 'NOLOGIN'} 
                NOREPLICATION  
                NOBYPASSRLS 
                PASSWORD '${element.password}' 
                ${element.option.connectionLimit != undefined ? 'CONNECTION LIMIT ' + element.option.connectionLimit : ''} 
                IN ROLE ${costruisciRuoli}
                ; \n`;

                const faxsDrop = `DROP USER IF EXISTS ${element.nome};`;
                elencoQuery.push(faxsDrop);
                elencoQuery.push(faxs);

                ritornoTmp = ritornoTmp + faxs;
            }
        }
        return ritornoTmp;
    }
    private InizializzaUserGrantGenerale(/* client: Client */elencoQuery: string[], listaUser?: User[]) {
        let ritornoTmp = '';
        if (listaUser) {
            for (let index = 0; index < listaUser.length; index++) {
                const element = listaUser[index];

                const faxSchema = `GRANT USAGE
                ON ALL SEQUENCES IN SCHEMA public
                TO ${element.nome} ;`;
                elencoQuery.push(faxSchema);
                const faxFunction = `GRANT EXECUTE
                ON ALL functions IN SCHEMA public
                    TO ${element.nome};`;
                elencoQuery.push(faxFunction);

                ritornoTmp = ritornoTmp + faxSchema;
            }
        }
        return ritornoTmp;
    }
    private CostruisciRuoli(item: string[]) {
        let ritorno = '';
        for (let index = 0; index < item.length; index++) {
            const element = item[index];
            if (index + 1 <= item.length && index != 0) ritorno = ritorno + ', ' + element;
            else ritorno = ritorno + ' ' + element;
        }
        return ritorno;
    }

    async StartTestAPI(): Promise<void> {
        const tmp: ListaTerminaleTestAPI = GetListaTestAPIMetaData();
        tmp.sort((x: ITestAPI, y: ITestAPI) => {
            if (x.numeroSequenza < y.numeroSequenza) return -1;
            else if (x.numeroSequenza > y.numeroSequenza) return 1;
            else {
                if (x.numeroSequenza < y.numeroSequenza) return -1;
                else if (x.numeroSequenza > y.numeroSequenza) return 1;
                else return 0;
            }
        });
        for (let index2 = 0; index2 < tmp.length; index2++) {
            const tmpTest = tmp[index2];
            console.log('Classe :' + tmpTest);
            console.log("Inizio lista test con nome : " + tmpTest.nomeTest + ',| numero :' + tmpTest.numeroSequenza + ' :!:');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let risposta: any;
            try {
                try {
                    try {
                        risposta = await superagent(tmpTest.verbo, tmpTest.path)
                            .query(tmpTest.query)
                            .send(tmpTest.body)
                            .set(tmpTest.header)
                            .set('accept', 'json')
                            ;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        //console.log(error);
                        if ('response' in error) {
                            risposta = (error).response.body;
                        }
                        throw new Error("Errore:" + error);
                    }
                    if (risposta) {
                        risposta.body;
                    } else {
                        risposta = '';
                    }
                    /*  */
                } catch (error) {
                    throw new Error("Errore :" + error);
                }
                if (tmpTest.Controllo)
                    tmpTest.Controllo(risposta ?? '');
            } catch (error) {
                risposta = '' + error;
            }
            if (risposta == undefined) {
                console.log("Risposta undefined!");
            } else {
                console.log(risposta)
            }
            console.log("Fine test con nome : " + tmpTest.nomeTest + ',| numero :' + tmpTest.numeroSequenza + ' :!:');
        }

    }
    StartHttpServer(): void {

        try {
            if (Main.vettoreProcessi.length > 0) {
                /* qui non arrivero mai! Perche il processo che viene avviato ?? un processo figlio, 
                questo vuol dire che sara con una porta gia definita */
                let resto = true;
                let tmp = this.percorsi.porta + parseInt((Math.random() * (Math.random() * 10)).toString());
                while (resto) {
                    if (tmp > 9999) tmp = 5000;
                    let esco = false;
                    tmp = tmp + parseInt((Math.random() * (Math.random() * 10)).toString());
                    for (let index = 0; index < Main.vettoreProcessi.length && esco == false; index++) {
                        const element = Main.vettoreProcessi[index];
                        if (element.porta == tmp) {
                            esco = true;
                        }
                    }
                    if (esco == false)
                        resto = false;
                }
                this.percorsi.porta = tmp;
                this.httpServer.listen(this.percorsi.porta);
                StartMonitoring();
            }
            else {
                if (Main.isSottoProcesso == true) {
                    this.httpServer.listen(this.percorsi.porta);
                } else {
                    Main.portaProxy = this.percorsi.porta;
                    Main.portaProcesso = this.percorsi.porta + 1;
                    this.httpServer.listen(Main.portaProcesso);
                    StartMonitoring();
                    /*  */
                    const proxy = httpProxy.createProxyServer();
                    //httpProxy.createProxyServer({ target: 'http://localhost:3001' }).listen(3333);

                    Main.proxyServer = http.createServer(function (req, res) {
                        // You can define here your custom logic to handle the request
                        // and then proxy the request.
                        // const variabileValore = '1';
                        let esco = false;
                        for (let index = 0; index < Main.vettoreProcessi.length && esco == false; index++) {
                            const processo = Main.vettoreProcessi[index];

                            processo.vettorePossibiliPosizioni;
                            /*  */
                            //devo estrarre il dato per poterlo verificare con la variabile
                            let ritorno: string | string[] | undefined = undefined;

                            for (let index = 0; index < processo.vettorePossibiliPosizioni.length && esco == false; index++) {
                                const element = processo.vettorePossibiliPosizioni[index];
                                /* if (richiesta..body[element.nome] != undefined && element.posizione == 'body') {
                                    tmp = richiesta.body[element.nome];
                                }
                                else if (richiesta.query[element.nome] != undefined && element.posizione == 'query') {
                                    tmp = richiesta.query[element.nome];
                                }
                                else */ if (req.headers[element.nome] != undefined && element.posizione == 'header') {
                                    ritorno = req.headers[element.nome];
                                    if (processo.valoreValiabile == req.headers[element.nome]) {
                                        res.setHeader("proxy", "->http://localhost:" + processo.porta);
                                        proxy.web(req, res, { target: 'http://localhost:' + processo.porta });
                                        esco = true;
                                    }
                                }
                            }
                            console.log(ritorno);
                            /*  */

                            /* if (element.valoreValiabile == variabileValore) {
                                res.setHeader("proxy", "->http://localhost:" + element.porta);
                                proxy.web(req, res, { target: 'http://localhost:' + element.porta });
                                esco = true;
                            } */
                        }
                        if (esco == false) {
                            res.setHeader("proxy", "->http://localhost:" + Main.portaProcesso);
                            proxy.web(req, res, { target: 'http://localhost:' + Main.portaProcesso });
                        }
                    });
                    Main.proxyServer.listen(Main.portaProxy);
                    /*  */
                }
            }
        } catch (error) {
            if (Main.vettoreProcessi.length > 0) {
                let resto = true;
                let tmp = this.percorsi.porta + parseInt((Math.random() * (Math.random() * 10)).toString());
                while (resto) {
                    if (tmp > 9999) tmp = 5000;
                    let esco = false;
                    tmp = tmp + parseInt((Math.random() * (Math.random() * 10)).toString());
                    for (let index = 0; index < Main.vettoreProcessi.length && esco == false; index++) {
                        const element = Main.vettoreProcessi[index];
                        if (element.porta == tmp) {
                            esco = true;
                        }
                    }
                    if (esco == false)
                        resto = false;
                }
                this.percorsi.porta = tmp;
                this.httpServer.listen(this.percorsi.porta);
                StartMonitoring();
            }
            else {
                throw error;
            }
        }
    }

    EstraiParametriDaRequest(richiesta: http.IncomingMessage, possibiliPosizioni: ISpawTrigger[]): string | string[] | undefined {
        let ritorno: string | string[] | undefined = undefined;

        for (let index = 0; index < possibiliPosizioni.length; index++) {
            const element = possibiliPosizioni[index];
            element.nome
            /* if (richiesta..body[element.nome] != undefined && element.posizione == 'body') {
                tmp = richiesta.body[element.nome];
            }
            else if (richiesta.query[element.nome] != undefined && element.posizione == 'query') {
                tmp = richiesta.query[element.nome];
            }
            else */ if (richiesta.headers[element.nome] != undefined && element.posizione == 'header') {
                ritorno = richiesta.headers[element.nome];
            }
        }
        return ritorno;
    }
    async StartTest(numeroRootTest?: number): Promise<void> {

        if (this.listaTerminaleTest) {
            this.listaTerminaleTest.sort((x: TerminaleTest, y: TerminaleTest) => {
                if (x.test.numeroRootTest < y.test.numeroRootTest) return -1;
                else if (x.test.numeroRootTest > y.test.numeroRootTest) return 1;
                else {
                    if (x.test.numero < y.test.numero) return -1;
                    else if (x.test.numero > y.test.numero) return 1;
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
                        console.log('\n*****\n' + error + '\n********\n\n');
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
    GetTest(): number[] {
        const ritorno: number[] = [];
        if (this.listaTerminaleTest) {
            this.listaTerminaleTest.sort((x: TerminaleTest, y: TerminaleTest) => {
                if (x.test.numeroRootTest < y.test.numeroRootTest) return -1;
                else if (x.test.numeroRootTest > y.test.numeroRootTest) return 1;
                else {
                    if (x.test.numero < y.test.numero) return -1;
                    else if (x.test.numero > y.test.numero) return 1;
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
    AggiungiTest(parametri: ITest[]): void {
        const tmp: ListaTerminaleTest = GetListaTestMetaData();
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            tmp.AggiungiElemento(new TerminaleTest(element));
        }
        SalvaListaTestMetaData(tmp);
        this.listaTerminaleTest = Reflect.getMetadata(ListaTerminaleTest.nomeMetadataKeyTarget, targetTerminale);
    }
    AggiungiTestAPI(parametri: ITestAPI[]): void {

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
    InizializzaSwagger(testo?: string): string {
        console.log(testo);
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
    async PrintMenu(): Promise<void> {
        const tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        //console.log("Menu main, digita il numero della la tua scelta: ");
        await tmp.PrintMenuClassi();

    }
    ScriviFile(pathDoveScrivereFile: string): string {

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
        try {
            const query: string[] = [];
            for (let index = 0; index < this.InizializzaORM(query, this.listaRuoli, this.listaUser).length; index++) {
                const classe = this.listaTerminaleClassi[index];
                for (let index = 0; index < classe.listaMetodi.length; index++) {
                    const metodo = classe.listaMetodi[index];
                    ritorno = ritorno + '' + metodo.PrintStruttura() + '';
                }
            } for (let index = 0; index < query.length; index++) {
                const element = query[index];
                fs.mkdirSync(pathDoveScrivereFile + '/FileGenerati_MP/lista_query_' + new Date().toLocaleDateString(), { recursive: true });
                fs.writeFileSync(pathDoveScrivereFile + '/FileGenerati_MP/lista_query' + '/query_' + index, element);
            }
        } catch (error) {
            return ritorno;
        }
        ritorno = '';
        return ritorno;
    }
}