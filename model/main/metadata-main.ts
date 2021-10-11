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
import { CreateDataBase, DropAllTable, DropDataBase, EseguiQueryControllata, TriggerUpdate_updated_at_column } from "../postgres/tabella";
import { Client } from "pg";

import superagent from "superagent";
import { Role, User } from "../postgres/role";

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
    async InizializzaORM(/* client: Client */elencoQuery: string[], nomeDatabase?: string, listaRuoli?: Role[], listaUser?: User[]) {
        const ritorno = '';
        elencoQuery.push(`CREATE EXTENSION plv8;`);

        elencoQuery.push(DropAllTable());

        elencoQuery.push(TriggerUpdate_updated_at_column());
        this.InizializzaRuoli(elencoQuery, listaRuoli);
        this.InizializzaUser(elencoQuery, listaUser);
        /*  */

        for await (const element of this.listaTerminaleClassi) {
            await element.CostruisciCreazioneDB(elencoQuery, true);
        }
        for await (const element of this.listaTerminaleClassi) {
            await element.CostruisciCreazioneDB(elencoQuery, false);
        }
        for await (const element of this.listaTerminaleClassi) {
            await element.CostruisciRelazioniDB(elencoQuery);
        }
        for await (const element of this.listaTerminaleClassi) {
            await element.CostruisceGrant(element.grants ?? [], elencoQuery);
        }

        for await (const element of this.listaTerminaleClassi) {
            if (element.listaPolicy)
                await element.listaPolicy.CostruiscePolicySicurezza(elencoQuery);
        }

        this.InizializzaRuoliGrantGenerale(elencoQuery, listaRuoli);
        this.InizializzaUserGrantGenerale(elencoQuery, listaUser);
        return ritorno;
    }

    InizializzaRuoli(/* client: Client */elencoQuery: string[], listaRuoli?: Role[]) {
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
    InizializzaRuoliGrantGenerale(/* client: Client */elencoQuery: string[], listaRuoli?: Role[]) {
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
    InizializzaUser(/* client: Client */elencoQuery: string[], listaUser?: User[]) {
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
    InizializzaUserGrantGenerale(/* client: Client */elencoQuery: string[], listaUser?: User[]) {
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
    CostruisciRuoli(item: string[]) {
        let ritorno = '';
        for (let index = 0; index < item.length; index++) {
            const element = item[index];
            if (index + 1 < item.length) ritorno = ritorno + ', ' + element;
            else ritorno = ritorno + ' ' + element;
        }
        return ritorno;
    }

    async StartTestAPI() {
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
                    } catch (error: any) {
                        //console.log(error);
                        if ('response' in error) {
                            risposta = (<any>error).response.body;
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