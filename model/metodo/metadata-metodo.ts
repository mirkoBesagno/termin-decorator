import { IContieneRaccoltaPercorsi, IHtml, IRaccoltaPercorsi, IReturn, IRitornoValidatore, tipo, TypeInterazone, TypePosizione } from "../utility";
import { IClasseRiferimento, IMetodo, IMetodoEventi, IMetodoLimitazioni, IMetodoParametri, IMetodoVettori, Risposta, RispostaControllo, SanificatoreCampo, TypeMetod } from "./utility-metodo";

import slowDown, { Options as OptSlowDows } from "express-slow-down";
import rateLimit, { Options as OptRateLimit } from "express-rate-limit";
import { NextFunction, Request, Response } from "express";

import fs from "fs";
import helmet from "helmet";
import cors from 'cors';
import memorycache from "memory-cache";
import superagent from "superagent";

import { cacheMiddleware, CalcolaChiaveMemoryCache, redisClient } from "../express-cache";

import { Options as OptionsCache } from "express-redis-cache";
import { ListaTerminaleParametro } from "../parametro/lista-parametro";
import { IParametriEstratti } from "../parametro/utility-parametro";
import { InizializzaLogbaseIn, SalvaListaClasseMetaData } from "../utility-function";
import { TerminaleParametro } from "../parametro/metadata-parametro";
import { ErroreMio } from "../errore";
import { ListaTerminaleClasse } from "../classe/lista-classe";
import { ConstruisciErrore, GetListaMiddlewareMetaData, InizializzaLogbaseOut, IsJsonString, Rispondi, SalvaListaMiddlewareMetaData, SostituisciRicorsivo } from "./utility-function-metodo";

class MetodoEventi implements IMetodoEventi {

    onChiamataInErrore?: (logOut: any, result: any, logIn: any, errore: any) => IReturn;
    onPrimaDiEseguireMetodo?: (parametri: IParametriEstratti) => IParametriEstratti | Promise<IParametriEstratti>;

    onChiamataCompletata?: (logOut: any, result: any, logIn: any, errore: any) => void;
    onLog?: (logOut: any, result: any, logIn: any, errore: any) => void;

    onRispostaControllatePradefinita?: (dati: IReturn) => IReturn | Promise<IReturn>;
    onPrimaDiTerminareLaChiamata?: (res: IReturn) => IReturn;
    onDopoAverTerminatoLaFunzione?: (item: any) => any;
    onPrimaDiEseguire?: (req: Request) => Request | Promise<Request>;


    Validatore?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => IRitornoValidatore | void;

    Istanziatore?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => any;

    constructor() {
        console.log("");
    }
    InitMetodoEventi(init: IMetodoEventi) {
        if (init.onChiamataCompletata != null) this.onChiamataCompletata = init.onChiamataCompletata;
        if (init.onLog != null) this.onLog = init.onLog;
        if (init.onChiamataInErrore) this.onChiamataCompletata = init.onChiamataCompletata;
        if (init.onPrimaDiEseguireMetodo) this.onPrimaDiEseguireMetodo = init.onPrimaDiEseguireMetodo;
        if (init.onLog) this.onLog = init.onLog;
        if (init.onRispostaControllatePradefinita) this.onRispostaControllatePradefinita = init.onRispostaControllatePradefinita;
        if (init.onPrimaDiTerminareLaChiamata) this.onPrimaDiTerminareLaChiamata = init.onPrimaDiTerminareLaChiamata;
        if (init.onDopoAverTerminatoLaFunzione) this.onDopoAverTerminatoLaFunzione = init.onDopoAverTerminatoLaFunzione;
        if (init.onPrimaDiEseguire) this.onPrimaDiEseguire = init.onPrimaDiEseguire;
        if (init.Validatore != null) this.Validatore = init.Validatore;
        if (init.Istanziatore != null && init.Istanziatore != undefined) this.Istanziatore = init.Istanziatore;
    }
}
class MetodoParametri extends MetodoEventi implements IMetodoParametri {
    percorsoIndipendente: boolean;
    tipo: TypeMetod;
    path: string;
    interazione: TypeInterazone;
    descrizione: string;
    sommario: string;
    constructor() {
        super();
        this.percorsoIndipendente = false;
        this.tipo = 'get';
        this.path = '';
        this.interazione = 'rotta';
        this.descrizione = '';
        this.sommario = '';
    }
    InitMetodoParametri(init: IMetodoParametri, numeroParametri: number, nomeMetodo: string) {
        if (init.percorsoIndipendente) this.percorsoIndipendente = init.percorsoIndipendente;
        else this.percorsoIndipendente = false;

        if (init.tipo != undefined) this.tipo = init.tipo;
        else if (init.tipo == undefined && numeroParametri == 0) this.tipo = 'get';
        else if (init.tipo == undefined && numeroParametri > 0) this.tipo = 'post';
        else this.tipo = 'get';

        if (init.descrizione != undefined) this.descrizione = init.descrizione;
        else this.descrizione = '';

        if (init.sommario != undefined) this.sommario = init.sommario;
        else this.sommario = '';

        if (init.interazione != undefined) this.interazione = init.interazione;
        else this.interazione = 'rotta';

        if (init.path == undefined) this.path = nomeMetodo;
        else this.path = init.path;

        
    }
    InitMiddleware(init: IMetodoParametri, descriptor: any, nomeMetodo: string, listaParametri:any){
        
        if (init.interazione == 'middleware' || init.interazione == 'ambo') { 
            const listaMidd = GetListaMiddlewareMetaData();
            const midd = listaMidd.CercaConNomeSeNoAggiungi(nomeMetodo);
            midd.metodoAvviabile = descriptor.value;
            midd.listaParametri = listaParametri;
            SalvaListaMiddlewareMetaData(listaMidd);
        }
    }
}
class MetodoLimitazioni extends MetodoParametri implements IMetodoLimitazioni {
    slow_down: OptSlowDows;
    rate_limit: OptRateLimit;
    cors: any;
    helmet: any;
    middleware: any[];

    cacheOptionRedis: OptionsCache;
    cacheOptionMemory: { durationSecondi: number };
    constructor() {
        super();
        this.slow_down = {
            windowMs: 3 * 60 * 1000, // 15 minutes
            delayAfter: 100, // allow 100 requests per 15 minutes, then...
            delayMs: 500, // begin adding 500ms of delay per request above 100:
            onLimitReached: (req: Request, res: Response, options: OptSlowDows) => {
                res.status(555).send("rate_limit : onLimitReached")
                throw new Error("Errore: rate_limit : onLimitReached");
            }
        };
        this.rate_limit = {
            windowMs: 3 * 60 * 1000, // 15 minutes
            max: 100,
            onLimitReached: (req: Request, res: Response, options: OptRateLimit) => {
                res.status(555).send("rate_limit : onLimitReached")
                throw new Error("Errroe: rate_limit : onLimitReached");
            }
        };
        this.cors = cors();
        this.helmet = helmet();
        this.middleware = [];

        this.cacheOptionRedis = { expire: 1 /* secondi */, client: redisClient };
        this.cacheOptionMemory = { durationSecondi: 1 };
    }
    InitMetodoLimitazioni(init: IMetodoLimitazioni) {
        if (init.slow_down) this.slow_down = init.slow_down;
        if (init.rate_limit) this.rate_limit = init.rate_limit;
        if (init.cacheOptionMemory) this.cacheOptionMemory = init.cacheOptionMemory ?? { durationSecondi: 1 };
    }
}
class MetodoVettori extends MetodoLimitazioni implements IMetodoVettori {
    ListaSanificatori?: SanificatoreCampo[];
    RisposteDiControllo?: RispostaControllo[];
    swaggerClassi: string[];
    nomiClasseRiferimento?: IClasseRiferimento[];
    listaTest: {
        body: any,
        query: any,
        header: any
    }[];
    listaHtml: IHtml[];

    constructor() {
        super();
        this.swaggerClassi = [];
        this.listaTest = [];
        this.RisposteDiControllo = [];
        this.ListaSanificatori = [];
        this.nomiClasseRiferimento = [];
        this.listaHtml = [];
    }
    InitMetodoVettori(init: IMetodoVettori) {
        if (init.listaTest) this.listaTest = init.listaTest;
        if (init.nomiClasseRiferimento != undefined) this.nomiClasseRiferimento = init.nomiClasseRiferimento;
        if (init.ListaSanificatori) this.ListaSanificatori = init.ListaSanificatori;
        if (init.RisposteDiControllo) this.RisposteDiControllo = init.RisposteDiControllo;
        if (init.swaggerClassi != undefined) this.swaggerClassi = init.swaggerClassi;
        if (init.listaHtml) {
            for (let index = 0; index < init.listaHtml.length; index++) {
                const element = init.listaHtml[index];
                if (element.percorsoIndipendente == undefined) element.percorsoIndipendente = false;

                if (element.html != undefined && element.htmlPath == undefined
                    && this.listaHtml.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    this.listaHtml.push({
                        contenuto: element.html,
                        path: element.path,
                        percorsoIndipendente: element.percorsoIndipendente
                    });
                    // this.html?.contenuto = element.html;
                } else if (element.html == undefined && element.htmlPath != undefined
                    && this.listaHtml.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    this.listaHtml.push({
                        contenuto: fs.readFileSync(element.htmlPath).toString(),
                        path: element.path,
                        percorsoIndipendente: element.percorsoIndipendente
                    });
                    // this.html?.contenuto = fs.readFileSync(element.htmlPath).toString();
                }
            }
        }
    }
}
class MetodoRaccoltaPercorsi extends MetodoVettori implements IContieneRaccoltaPercorsi {

    percorsi: IRaccoltaPercorsi;
    constructor() {
        super();
        this.percorsi = { pathGlobal: '', patheader: '', porta: 0 };
    }
    InitPercorsi(percorsi: IRaccoltaPercorsi, path: string, percorsoIndipendente: boolean) {
        this.percorsi.patheader = percorsi.patheader;
        this.percorsi.porta = percorsi.porta;
        if (percorsoIndipendente)
            this.percorsi.pathGlobal = '/' + path;
        else
            this.percorsi.pathGlobal = percorsi.pathGlobal + '/' + path;
    }
}
export class TerminaleMetodo
    extends MetodoRaccoltaPercorsi
    implements IMetodo/* , IGestorePercorsiPath, IMetodoParametri */ {

    private schemaSwagger?: any;

    private htmlHandlebars: {
        percorso: string, contenuto: string, percorsoIndipendente?: boolean,
        listaParametri?: { nome: string, valore: string }[]
    }[] = [];

    static nomeMetadataKeyTarget = "MetodoTerminaleTarget";

    classePath = '';
    listaParametri: ListaTerminaleParametro;
    // eslint-disable-next-line @typescript-eslint/ban-types
    nome: string | Symbol;
    metodoAvviabile: any;

    constructor(nome: string, path: string, classePath: string) {
        super();
        this.listaParametri = new ListaTerminaleParametro();
        this.nome = nome;
        this.path = path;
        this.classePath = classePath;
    }
    /**
     * punto di inizio per la costruzione del server express con le retto 
     * presenti
     * @param app 
     * @param percorsi 
     */
    ConfiguraRottaApplicazione(app: any, percorsi: IRaccoltaPercorsi) {
        this.InitPercorsi(percorsi, this.path, this.percorsoIndipendente);

        const middlew: any[] = [];
        this.middleware.forEach(element => {
            if (element instanceof TerminaleMetodo) {
                const listaMidd = GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                middlew.push(midd.ConvertiInMiddleare());
            }
        });

        if (this.metodoAvviabile != undefined) {
            this.ConfiguraRotteSwitch(app, this.percorsi.pathGlobal, middlew);
        }

        if (this.listaHtml) {
            let percorsoTmp = '';
            for (let index = 0; index < this.listaHtml.length; index++) {
                const element = this.listaHtml[index];
                if (element.percorsoIndipendente) percorsoTmp = '/' + element.path;
                else percorsoTmp = this.percorsi.pathGlobal + '/' + element.path;

                if (this.metodoAvviabile != undefined) {
                    this.ConfiguraRotteHtml(app, percorsoTmp, element.contenuto);
                }
            }

        }

    }
    /**
     * configura le rotte del server express, 
     * @param app : dovra avere l'istanza di express
     * @param percorsoTmp : il percorso, questo dovra essere alimentato anche con il nome del metodo nel caso sia chiamato tramite ConfiguraRotteSwitch
     * @param middlew : la lista dei middleware
     */
    private ConfiguraRotteSwitch(app: any, percorsoTmp: string, middlew: any[]) {
        let corsOptions = {};
        const apiRateLimiter = rateLimit(this.rate_limit);
        const apiSpeedLimiter = slowDown(this.slow_down);
        //const csrfProtection = csrf({ cookie: true }) 
        switch (this.tipo) {
            case 'get':
                (<IReturn>this.metodoAvviabile).body;
                corsOptions = {
                    methods: 'GET',
                }
                if (this.cors == undefined) {
                    this.cors = cors(corsOptions);
                }
                if (this.helmet == undefined) {
                    this.helmet = helmet();
                }
                app.get(percorsoTmp,
                    this.cors,
                    this.helmet,
                    middlew,
                    cacheMiddleware.route(this.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                    apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                    async (req: Request, res: Response) => {
                        //console.log("GET");
                        await this.ChiamataGenerica(req, res);
                    });
                break;
            case 'post':
                corsOptions = {
                    methods: 'POST'
                }
                if (this.helmet == undefined) {
                    this.helmet = helmet();
                }
                if (this.cors == undefined) {
                    this.cors = cors(corsOptions);
                }
                (<IReturn>this.metodoAvviabile).body;
                app.post(percorsoTmp,
                    this.cors,
                    this.helmet,
                    middlew,
                    cacheMiddleware.route(this.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                    apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                    async (req: Request, res: Response) => {
                        //console.log("POST");
                        await this.ChiamataGenerica(req, res);
                    });
                break;
            case 'delete':
                (<IReturn>this.metodoAvviabile).body;
                corsOptions = {
                    methods: "DELETE"
                }
                if (this.helmet == undefined) {
                    this.helmet = helmet();
                }
                if (this.cors == undefined) {
                    this.cors = cors(corsOptions);
                }
                app.delete(percorsoTmp,
                    this.cors,
                    this.helmet,
                    middlew,
                    cacheMiddleware.route(this.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                    apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                    async (req: Request, res: Response) => {
                        //console.log("DELETE");
                        await this.ChiamataGenerica(req, res);
                    });
                break;
            case 'patch':
                corsOptions = {
                    methods: "PATCH"
                };
                if (this.helmet == undefined) {
                    this.helmet = helmet();
                }
                if (this.cors == undefined) {
                    this.cors = cors(corsOptions);
                }
                (<IReturn>this.metodoAvviabile).body;
                app.patch(percorsoTmp,
                    this.cors,
                    this.helmet,
                    middlew,
                    cacheMiddleware.route(this.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                    apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                    async (req: Request, res: Response) => {
                        //console.log("PATCH");
                        await this.ChiamataGenerica(req, res);
                    });
                break;
            case 'purge':
                corsOptions = {
                    methods: "PURGE"
                };
                if (this.helmet == undefined) {
                    this.helmet = helmet();
                }
                if (this.cors == undefined) {
                    this.cors = cors(corsOptions);
                }
                (<IReturn>this.metodoAvviabile).body;
                app.purge(percorsoTmp,
                    this.cors,
                    this.helmet,
                    middlew,
                    cacheMiddleware.route(this.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                    apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                    async (req: Request, res: Response) => {
                        //console.log("PURGE");
                        await this.ChiamataGenerica(req, res);
                    });
                break;
            case 'put':
                corsOptions = {
                    methods: "PUT"
                };
                if (this.helmet == undefined) {
                    this.helmet = helmet();
                }
                if (this.cors == undefined) {
                    this.cors = cors(corsOptions);
                }
                (<IReturn>this.metodoAvviabile).body;
                app.put(percorsoTmp,
                    this.cors,
                    this.helmet,
                    middlew,
                    cacheMiddleware.route(this.cacheOptionRedis ?? {}),
                    apiRateLimiter,
                    apiSpeedLimiter,/*csrfProtection,*/
                    async (req: Request, res: Response) => {
                        //console.log("PUT");
                        await this.ChiamataGenerica(req, res);
                    });
                break;
        }
    }
    private ConfiguraRotteHtml(app: any, percorsoTmp: string, contenuto: string) {
        (<IReturn>this.metodoAvviabile).body;
        let corsOptions = {};
        corsOptions = {
            methods: 'GET',
        }
        if (this.cors == undefined) {
            this.cors = cors(corsOptions);
        }
        if (this.helmet == undefined) {
            this.helmet = helmet();
        }
        app.get(percorsoTmp,
            /* this.cors,
            this.helmet, */
            async (req: Request, res: Response) => {
                if (this.listaHtml)
                    res.send(contenuto);
                else
                    res.sendStatus(404);
            });
    }
    /**
     * Rappresenta la chiamata express
     * @param req 
     * @param res 
     */
    async ChiamataGenerica(req: Request, res: Response) {
        let passato = false;
        let logIn: any;
        let logOut: any;
        let tmp: IReturn | undefined;
        const key = this.cacheOptionMemory != undefined ? CalcolaChiaveMemoryCache(req) : undefined;
        const durationSecondi = this.cacheOptionMemory != undefined ? this.cacheOptionMemory.durationSecondi : undefined;
        try {
            //console.log('Inizio Chiamata generica per : ' + this.percorsi.pathGlobal);
            logIn = InizializzaLogbaseIn(req, this.nome.toString());
            if (this.onPrimaDiEseguire) req = await this.onPrimaDiEseguire(req);
            const cachedBody = memorycache.get(key)
            if (cachedBody == undefined || cachedBody == null) {
                tmp = await this.Esegui(req);
                if (tmp != undefined) {
                    if (this.onRispostaControllatePradefinita && this.VerificaPresenzaRispostaControllata(tmp) == false) {
                        const rispostaPilotata = await this.onRispostaControllatePradefinita(tmp)
                        Rispondi(res, rispostaPilotata, key, durationSecondi);
                        //throw new Error("Attenzione, cosa stai facendo?");
                    }
                    else {
                        try {
                            if (!this.VerificaTrigger(req)) {
                                if (this.VerificaPresenzaRispostaControllata(tmp) && this.EseguiRispostaControllata) {
                                    tmp = await this.EseguiRispostaControllata(tmp);
                                }
                                Rispondi(res, tmp ?? ConstruisciErrore('Attenzione! Rimpiazzato.'), key, durationSecondi);
                            }
                            else {
                                const risposta = this.CercaRispostaConTrigger(req);
                                if (risposta) {
                                    let source = "";
                                    if (risposta.stato >= 1 && risposta.stato < 600) {
                                        if (risposta.htmlPath != undefined)
                                            source = fs.readFileSync(risposta.htmlPath).toString();
                                        else if (risposta.html != undefined)
                                            source = risposta.html;
                                        else
                                            throw new Error("Errorissimo");
                                    } else {
                                        Rispondi(res, tmp, key, durationSecondi);
                                        passato = true;
                                    }
                                }
                                else {
                                    throw new Error("Errore nel trigger");
                                }
                            }
                        } catch (errore: any) {
                            const err = ConstruisciErrore(errore);
                            err.stato = 598;
                            Rispondi(res, err, key, durationSecondi);
                        }
                    }
                    //if (this.onPrimaDiTerminareLaChiamata) tmp = this.onPrimaDiTerminareLaChiamata(tmp);
                }
                else {
                    throw new Error("Attenzione qualcosa è andato storto nell'Esegui(req), guarda @mpMet");
                }
            }
            else {
                const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                let valido: IRitornoValidatore | undefined = undefined;
                if (this.Validatore) {
                    valido = this.Validatore(parametri, this.listaParametri) ?? undefined;
                    if (valido && valido?.approvato == true && this.Istanziatore) {
                        await this.Istanziatore(parametri, this.listaParametri);
                        res.setHeader('Content-Type', 'application/json');
                        res.status(cachedBody.stato).send(cachedBody.body)
                    }
                    else {
                        res.status(555).send({ errore: 'Errore cache.' });
                    }
                }
                else if (parametri.errori.length > 0) {
                    valido = { approvato: false, stato: 400, messaggio: 'Parametri in errore.'/* parametri.errori.toString() */ };
                    res.status(555).send({ errore: 'Errore cache.' });
                }
                else {
                    valido = { approvato: true, stato: 200, messaggio: '' };
                    res.setHeader('Content-Type', 'application/json');
                    res.status(cachedBody.stato).send(cachedBody.body)
                }
            }

            logOut = InizializzaLogbaseOut(res, this.nome.toString());
            if (this.onChiamataCompletata) {
                this.onChiamataCompletata(logIn, tmp, logOut, undefined);
            }
            if (this.onLog) {
                this.onLog(logIn, tmp, logOut, undefined);
            }
        } catch (error) {
            if (this.onChiamataInErrore) {
                tmp = await this.onChiamataInErrore(logIn, tmp, logOut, error);
                /* let num = 0;
                num = tmp.stato;
                res.statusCode = Number.parseInt('' + num);
                res.send(tmp.body); */
                Rispondi(res, tmp, key, durationSecondi);
            }
            else if (passato == false) {
                if (error instanceof ErroreMio) {
                    //console.log("ciao");
                    /* return <IReturn>{
                        stato: (<ErroreMio>error).codiceErrore,
                        body: {
                            errore: (<ErroreMio>error).message
                        }
                    }; */

                    Rispondi(res, {
                        stato: (<ErroreMio>error).codiceErrore,
                        body: { errore: (<ErroreMio>error).message }
                    }, key, durationSecondi);
                } else {
                    Rispondi(res, {
                        stato: 500,
                        body: {
                            error: error,
                            passato: passato,
                            info: ''
                        }
                    }, key, durationSecondi);
                }
            }
            else {
                Rispondi(res, {
                    stato: 500,
                    body: {
                        error: error,
                        passato: passato,
                        info: ''
                    }
                }, key, durationSecondi);
            }
            if (this.onLog) {
                this.onLog(logIn, tmp, logOut, error);
            }
        }
    }
    private VerificaPresenzaRispostaControllata(item: IReturn | undefined): boolean {
        if (this.RisposteDiControllo != undefined) {
            for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                const element = this.RisposteDiControllo[index];
                if (element.trigger == item?.stato) {
                    return true;
                }
            }
        }
        return false;
    }
    async EseguiRispostaControllata(item: IReturn | undefined): Promise<IReturn> {
        if (this.RisposteDiControllo != undefined) {
            for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                const element = this.RisposteDiControllo[index];
                if ((element).trigger == item?.stato) {
                    if ((element).onModificaRisposta && element) {
                        const tmp = await element.onModificaRisposta(item);
                        if (tmp)
                            return tmp;
                        else {
                            return ConstruisciErrore('Attenzione errore!');
                        }
                    }
                    else {
                        return item;
                    }
                }
            }
        }
        if (item)
            return item;
        else {
            return ConstruisciErrore('Attenzione errore!');
        }
    }
    private VerificaTrigger(richiesta: Request): boolean {

        let tmp = undefined;

        if (this.RisposteDiControllo) {
            for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                const element = this.RisposteDiControllo[index].risposta;
                if (element && element.trigger) {
                    if (element.trigger.posizione == 'body')
                        tmp = richiesta.body[element.trigger.nome];
                    if (element.trigger.posizione == 'header')
                        tmp = richiesta.headers[element.trigger.nome];
                    if (element.trigger.posizione == 'query')
                        tmp = richiesta.query[element.trigger.nome];
                    if (tmp == element.trigger.valore) return true;
                }
            }
        }

        return false;
    }
    private CercaRispostaConTrigger(richiesta: Request): Risposta | undefined {

        let tmp = undefined;

        if (this.RisposteDiControllo) {
            for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                const element = this.RisposteDiControllo[index].risposta;
                if (element && element.trigger) {
                    if (element.trigger.posizione == 'body')
                        tmp = richiesta.body[element.trigger.nome];
                    if (element.trigger.posizione == 'header')
                        tmp = richiesta.headers[element.trigger.nome];
                    if (element.trigger.posizione == 'query')
                        tmp = richiesta.query[element.trigger.nome];
                    if (tmp == element.trigger.valore) return element;
                }
            }
        }
        return undefined;
    }
    CercaParametroSeNoAggiungi(nome: string, parameterIndex: number, tipo: tipo, posizione: TypePosizione) {
        let presente = false;
        for (let index = 0; index < this.listaParametri.length && presente == false; index++) {
            const element = this.listaParametri[index];
            if (element.indexParameter == parameterIndex) presente = true;
        }
        if (presente == false) {
            const tmp = new TerminaleParametro(nome, tipo, posizione, parameterIndex);
            this.listaParametri.push(tmp);//.lista.push({ propertyKey: propertyKey, Metodo: target });
            return tmp;
        }
        else {
            const tmp = this.listaParametri[parameterIndex - 1];
            return tmp;
        }
    }
    async Esegui(req: Request): Promise<IReturn | undefined> {
        try {
            const parametri = this.listaParametri.EstraiParametriDaRequest(req);
            /*!!!
            Qui bisogna che ci metto qualcosa per convertire i parametri in una chimata, quindi 
            connettermi al db ed estrarli con una query.
            i parametri devono essere segnalati come tali.
            come fare a gestire il ritorno, perche io cosi facendo sto eseguendo una select
            come eseguire una delete o una set? 
            */
            let valido: IRitornoValidatore | undefined = undefined;
            if (this.Validatore) {
                valido = this.Validatore(parametri, this.listaParametri) ?? undefined;
            }
            else if (parametri.errori.length > 0) {
                valido = { approvato: false, stato: 400, messaggio: 'Parametri in errore.'/* parametri.errori.toString() */ };
            }
            else {
                valido = { approvato: true, stato: 200, messaggio: '' };
            }
            /* verifico che il metodo possa essere eseguito come volevasi ovvero approvato = true o undefiend */
            if ((valido && (valido.approvato == undefined || valido.approvato == true))
                || (!valido && parametri.errori.length == 0)) {
                let tmp: IReturn = {
                    body: {}, nonTrovati: parametri.nontrovato,
                    inErrore: parametri.errori, stato: 200
                };
                try {
                    const tmpRitorno = await this.EseguiMetodo(parametri);
                    const tmpReturn: any = tmpRitorno.result;
                    if (IsJsonString(tmpReturn)) {
                        if (tmpReturn.name === "ErroreMio" || tmpReturn.name === "ErroreGenerico") {
                            //console.log("ciao");
                        }
                        if ('body' in tmpReturn) { tmp.body = tmpReturn.body; }
                        else {
                            if (typeof tmpReturn === 'object' && tmpReturn !== null)
                                tmp.body = tmpReturn;
                            else {
                                tmp.body = { tmpReturn };
                            }
                        }
                        if ('stato' in tmpReturn) { tmp.stato = tmpReturn.stato; }
                        else { tmp.stato = 298; }
                    }
                    else {
                        if (typeof tmpReturn === 'object' && tmpReturn !== null &&
                            'stato' in tmpReturn && 'body' in tmpReturn) {
                            // eslint-disable-next-line prefer-const
                            for (let attribut in tmpReturn.body) {
                                (<any>tmp.body)[attribut] = tmpReturn.body[attribut];
                            }
                            tmp.body = Object.assign({}, tmpReturn.body);
                            tmp.stato = tmpReturn.stato;
                        }
                        else if (tmpReturn) {
                            tmp.body = tmpReturn;
                            tmp.stato = 200//299;
                        }
                        else {
                            tmp = {
                                body: { "Errore Interno filtrato ": 'internal error!!!!' },
                                stato: 599,
                                nonTrovati: parametri.nontrovato
                            };
                        }
                    }
                    tmp.attore = tmpRitorno.attore;
                    return tmp;
                } catch (error) {
                    if (error instanceof ErroreMio) {
                        throw error;
                        /* tmp = {
                            body: {
                                "Errore Interno filtrato ": 'filtrato 404 !!!',
                                'Errore originale': (<ErroreMio>error).message,
                                'Stack errore': (<Error>error).stack
                            },
                            stato: (<ErroreMio>error).codiceErrore
                        }; */
                    }
                    else {
                        throw new ErroreMio({
                            codiceErrore: 598,
                            messaggio: (<Error>error).message,
                            percorsoErrore: (<Error>error).stack,
                        })
                        /* tmp = {
                            body: {
                                "Errore Interno filtrato ": 'internal error!!!!',
                                'Errore originale': (<Error>error).message,
                                'Stack errore': (<Error>error).stack,
                                nonTrovati: parametri.nontrovato
                            },
                            stato: 598
                        }; */
                    }
                    return tmp;
                }
            }/* altrimenti lo vado a costruire */
            else {
                let tmp: IReturn = {
                    body: parametri.errori,
                    nonTrovati: parametri.nontrovato,
                    inErrore: parametri.errori,
                    stato: 597
                };
                if (valido) {
                    if (valido.body != undefined) {
                        tmp = {
                            body: valido.body,
                            stato: valido.stato ?? 596,
                        }
                    }
                    else {
                        tmp = {
                            body: tmp.body,
                            stato: valido.stato ?? 595,
                        }
                    }
                }
                return tmp;
            }
            return undefined;
            throw new Error("Attenzione qualcosa è andato storto.");
        } catch (error: any) {
            console.log('ciao');
            throw error;
        }
    }
    async EseguiMetodo(parametri: IParametriEstratti) {
        let tmpReturn: any = '';
        let attore = undefined;
        if (this.onPrimaDiEseguireMetodo)
            parametri = await this.onPrimaDiEseguireMetodo(parametri);
        /* let count = 0; */
        if (this.Istanziatore) {
            const classeInstanziata = await this.Istanziatore(parametri, this.listaParametri);
            attore = classeInstanziata;
            // eslint-disable-next-line prefer-spread
            tmpReturn = await classeInstanziata[this.nome.toString()].apply(classeInstanziata, parametri.valoriParametri);
        }
        else {
            tmpReturn = await this.metodoAvviabile.apply(this.metodoAvviabile, parametri.valoriParametri);
        }

        if (this.ListaSanificatori && 'length' in this.ListaSanificatori && this.ListaSanificatori.length > 0)
            tmpReturn = SostituisciRicorsivo(this.ListaSanificatori, tmpReturn);


        if (this.onDopoAverTerminatoLaFunzione) tmpReturn = this.onDopoAverTerminatoLaFunzione(tmpReturn);
        return {
            attore: attore,
            result: tmpReturn
        };
    }
    private ConvertiInMiddleare() {
        return async (req: Request, res: Response, nex: NextFunction) => {
            try {
                const tmp = await this.Esegui(req);
                if (tmp) {
                    if (tmp.stato >= 300) {
                        throw new Error("Errore : " + tmp.body);
                    }
                    else {
                        nex();
                        return nex;
                    }
                }
                else {
                    throw new Error("Attenzione qualcosa è andato storto nell'Esegui(req), guarda @mpMet")
                }
            } catch (error) {
                return res.status(555).send("Errore : " + error);
            }
        };
    }
    /************************************************************************* */
    PrintStamp(): string {
        let parametri = "";
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        const tmp = this.nome + ' | ' + this.percorsi.pathGlobal + '\n\t' + parametri;
        ////console.log(tmp);
        return tmp;
    }
    PrintStruttura(): string {
        let parametri = "";
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintStruttura() + '\n';
        }

        if (this.onChiamataCompletata) parametri = parametri + '\tonChiamataCompletata :' + this.onChiamataCompletata.toString() + '\n';
        if (this.onPrimaDiEseguireMetodo) parametri = parametri + '\tonLog :' + this.onPrimaDiEseguireMetodo.toString() + '\n';
        if (this.onChiamataInErrore) parametri = parametri + '\tonChiamataInErrore :' + this.onChiamataInErrore.toString() + '\n';
        if (this.onLog) parametri = parametri + '\tonLog :' + this.onLog.toString() + '\n';
        if (this.Validatore) parametri = parametri + '\tonLog :' + this.Validatore.toString() + '\n';
        if (this.Istanziatore) parametri = parametri + '\tonLog :' + this.Istanziatore.toString() + '\n';
        if (this.onPrimaDiEseguireMetodo) parametri = parametri + '\tonPrimaDiEseguireMetodo :' + this.onPrimaDiEseguireMetodo.toString() + '\n';
        if (this.onPrimaDiTerminareLaChiamata) parametri = parametri + '\tonPrimaDiTerminareLaChiamata :' + this.onPrimaDiTerminareLaChiamata.toString() + '\n';
        if (this.onRispostaControllatePradefinita) parametri = parametri + '\tonRispostaControllatePradefinita :' + this.onRispostaControllatePradefinita.toString() + '\n';
        if (this.onDopoAverTerminatoLaFunzione) parametri = parametri + '\tonLog :' + this.onDopoAverTerminatoLaFunzione.toString() + '\n';
        if (this.onPrimaDiEseguire) parametri = parametri + '\tonLog :' + this.onPrimaDiEseguire.toString() + '\n';

        const tmp = this.nome + ' | ' + this.percorsi.pathGlobal + '\n' + parametri + '\n';
        
        return tmp;
    }
    async ChiamaLaRotta(headerpath?: string) {
        try {

            let body = "";
            let query = "";
            let header = "";
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];

                if (element instanceof TerminaleMetodo) {
                    const listaMidd = GetListaMiddlewareMetaData();
                    const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                    const rit = await midd.listaParametri.SoddisfaParamtri('middleware');

                    if (rit.body != "") {
                        if (body != "") {
                            body = body + ", " + rit.body;
                        } else {
                            body = rit.body;
                        }
                    }
                    if (rit.query != "") {
                        if (query != "") {
                            query = query + ", " + rit.query;
                        } else
                            query = rit.query;
                    }
                    if (rit.header != "") {
                        if (header != "") {
                            header = header + ", " + rit.header;
                        } else
                            header = rit.header;
                    }
                }
            }

            if (headerpath == undefined) headerpath = "localhost:3000";
            //console.log('chiamata per : ' + this.percorsi.pathGlobal + ' | Verbo: ' + this.tipo);
            const parametri = await this.listaParametri.SoddisfaParamtri('rotta');

            if (parametri.body != "") {
                if (body != "") {
                    body = body + ", " + parametri.body;
                } else {
                    body = parametri.body;
                }
            }
            if (parametri.query != "") {
                if (query != "") {
                    query = query + ", " + parametri.query;
                } else
                    query = parametri.query;
            }
            if (parametri.header != "") {
                if (header != "") {
                    header = header + ", " + parametri.header;
                } else
                    header = parametri.header;
            }

            let ritorno;
            // let gg = this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal
            try {
                ritorno = await superagent(this.tipo, this.percorsi.patheader + ':' + this.percorsi.porta + this.percorsi.pathGlobal)
                    .query(JSON.parse('{ ' + query + ' }'))
                    .send(JSON.parse('{ ' + body + ' }'))
                    .set(JSON.parse('{ ' + header + ' }'))
                    .set('accept', 'json')
                    ;
            } catch (error: any) {
                //console.log(error);
                if ('response' in error) {
                    return (<any>error).response.body;
                }
                throw new Error("Errore:" + error);
            }
            if (ritorno) {
                return ritorno.body;
            } else {
                return '';
            }
            /*  */
        } catch (error) {
            throw new Error("Errore :" + error);
        }
    }
    async ChiamaLaRottaConParametri(body: any, query: any, header: any) {
        try {
            let ritorno;
            // let gg = this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal
            try {
                ritorno = await superagent(this.tipo, this.percorsi.patheader + ':' + this.percorsi.porta + this.percorsi.pathGlobal)
                    .query(query)
                    .send(body)
                    .set(header)
                    .set('accept', 'json')
                    ;
            } catch (error: any) {
                //console.log(error);
                if ('response' in error) {
                    return (<any>error).response.body;
                }
                throw new Error("Errore:" + error);
            }
            if (ritorno) {
                return ritorno.body;
            } else {
                return '';
            }
            /*  */
        } catch (error) {
            throw new Error("Errore :" + error);
        }
    }
    SettaSwagger() {

        if (this.interazione == 'middleware') {
            //questo deve restituire un oggetto
            /* let primo = false;
            let ritorno = '';
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    if (primo == false && tt != undefined) {
                        primo = true;
                        ritorno = tt + '';
                    } else if (tt != undefined) {
                        ritorno = ritorno + ',' + tt;
                    }
                }
            }
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                const tt = element.SettaSwagger(); 
                if (index == 0)
                    if (primo == false) ritorno = tt;
                    else ritorno = ritorno + ',' + tt;
                else ritorno = ritorno + ',' + tt;
                if (primo == false) primo = true;
            }
            //ritorno = ritorno;
            try {
                JSON.parse(ritorno)
            } catch (error) {
                console.log(error);
            }
            if (primo) return undefined;
            else return ritorno; */
            return undefined;
        }
        else {
            let schema = ``;
            let parameters = ``;
            let tags = '"' + this.nome + '"';
            for (let index = 0; this.swaggerClassi && index < this.swaggerClassi.length; index++) {
                const element = this.swaggerClassi[index];
                tags = tags + ', ';
                tags = tags + '"' + element + '"';
            }

            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                if (index > 0) schema = schema + ', ';
                schema = schema + `"${element.nome}": {
                "${element.nome}":{
                    "type": "${element.tipo}"
                }
            }`;
            }

            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];

                let properties = '';
                if (element.tipo == 'array' && element.schemaSwagger) {
                    for (let index2 = 0; index2 < element.schemaSwagger.length; index2++) {
                        const element2 = element.schemaSwagger[index2];
                        if (index2 > 0) properties = properties + ', ';
                        properties = properties +
                            `"${element2.nome}": {
                                "type": "${element2.tipo}",
                                "example": "${element2.valoreEsempio}"
                            }`;
                    }

                }
                const tipoArray = `"items": {
                "type": "object",
                "properties": {
                    ${properties}
                }
            }`;
                if (index > 0) parameters = parameters + ', ';
                if (element.tipo == 'array' && element.schemaSwagger) {
                    if (element.obbligatorio) {
                        parameters = parameters +
                            `{
                        "in": "${element.posizione}",
                        "name": "${element.nome}",
                        "description": "Obbligatorio: ${element.obbligatorio}.${element.descrizione}",
                        "required": "${element.obbligatorio}",
                        "schema": {
                            "type": "array",
                            ${tipoArray}
                        }
                    }`;
                    } else {
                        parameters = parameters +
                            `{
                        "in": "${element.posizione}",
                        "name": "${element.nome}",
                        "description": "Obbligatorio: ${element.obbligatorio}.${element.descrizione}",
                        "schema": {
                            "type": "array",
                            ${tipoArray}
                        }
                    }`;
                    }
                    /* parameters = parameters + `{
                    "in": "${element.posizione}",
                    "name": "${element.nome}",
                    "description": "${element.descrizione}. Il parametro è obbligatorio: ${element.obbligatorio}",
                    "schema": {
                        "required": "${element.obbligatorio}",
                        "type": "array",
                        ${tipoArray}
                    }
                }`; */
                }
                else {
                    if (element.obbligatorio) {
                        parameters = parameters +
                            `{
                        "in": "${element.posizione}",
                        "name": "${element.nome}",
                        "description": "Obbligatorio: ${element.obbligatorio}.${element.descrizione}",
                        "required": "${element.obbligatorio}",
                        "schema": {
                            "type": "${element.tipo}"
                        }
                    }`;
                    } else {
                        parameters = parameters +
                            `{
                        "in": "${element.posizione}",
                        "name": "${element.nome}",
                        "description": "Obbligatorio: ${element.obbligatorio}.${element.descrizione}",
                        "schema": {
                            "type": "${element.tipo}"
                        }
                    }`;
                    }
                    /* parameters = parameters + `{
                    "in": "${element.posizione}",
                    "name": "${element.nome}",
                    "description": "${element.descrizione}. Il parametro è obbligatorio: ${element.obbligatorio}",
                    "schema": {
                        "required": "${element.obbligatorio}",
                        "type": "${element.tipo}"
                    }
                }
                `; */
                }

            }
            let risposte = "";
            if (this.RisposteDiControllo) {
                for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                    const element = this.RisposteDiControllo[index].risposta;
                    let tt = '';
                    if (element) {
                        for (let indexj = 0; indexj < element.valori.length; indexj++) {
                            const element2 = element.valori[indexj];
                            if (indexj > 0) tt = tt + ', ';
                            tt = tt +
                                `"${element2.nome}": {
                        "type": "${element2.tipo}"
                    }`;
                        }
                        if (index > 0) risposte = risposte + ', ';
                        risposte = risposte + `"${element.stato}": {
                    "description": "${element.descrizione}",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    ${tt}
                                }
                            }
                        }
                    }
                }`;

                    }
                }
            }

            const ritorno = `"${this.percorsi.pathGlobal}": {
            "${this.tipo}":{
                "tags": [
                    ${tags}
                ],
                "summary": "${this.sommario}",
                "description": "${this.descrizione}",
                "operationId": "${this.nome}",
                "parameters": [
                    ${parameters}
                ],
                "responses": {
                    ${risposte}
                }
            }                
        }`;

            return ritorno;
        }
    }
    Setta(parametri: IMetodo, propertyKey: string | symbol, descriptor: PropertyDescriptor, list: ListaTerminaleClasse) {
        this.InitMetodoVettori(parametri);
        this.InitMetodoLimitazioni(parametri);
        this.InitMetodoEventi(parametri);
        const tmpLength: number = this.listaParametri != undefined ? this.listaParametri.length != undefined ? this.listaParametri.length : 0 : 0;
        this.InitMetodoParametri(parametri, tmpLength, propertyKey.toString());
        this.metodoAvviabile = descriptor.value;
        /* configuro i middleware */
        if (parametri.interazione == 'middleware' || parametri.interazione == 'ambo') {

            const listaMidd = GetListaMiddlewareMetaData();
            const midd = listaMidd.CercaConNomeSeNoAggiungi(propertyKey.toString());
            midd.metodoAvviabile = descriptor.value;
            midd.listaParametri = this.listaParametri;
            SalvaListaMiddlewareMetaData(listaMidd);
        }
        if (parametri.nomiClasseRiferimento != undefined && parametri.nomiClasseRiferimento.length > 0) {
            for (let index = 0; index < parametri.nomiClasseRiferimento.length; index++) {
                const element = parametri.nomiClasseRiferimento[index];
                const classeTmp = list.CercaConNomeSeNoAggiungi(element.nome);
                const metodoTmp = classeTmp.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
                /* configuro il metodo */
                if (metodoTmp && metodoTmp.metodoAvviabile == undefined && descriptor != undefined && descriptor.value != undefined)
                    metodoTmp.metodoAvviabile = descriptor.value;
                metodoTmp.InitMetodoParametri(parametri, 0, propertyKey.toString());

                for (let index = 0; index < this.listaParametri.length; index++) {
                    const element = this.listaParametri[index];
                    /* configuro i parametri */
                    const paramestro = metodoTmp.CercaParametroSeNoAggiungi(element.nome, element.indexParameter,
                        element.tipo, element.posizione);
                    /*  */
                    if (parametri.descrizione != undefined) paramestro.descrizione = element.descrizione;
                    else paramestro.descrizione = '';
                    /*  */
                    if (parametri.sommario != undefined) paramestro.sommario = element.sommario;
                    else paramestro.sommario = '';
                }
                if (element.listaMiddleware) {
                    for (let index = 0; index < element.listaMiddleware.length; index++) {
                        const middlewareTmp = element.listaMiddleware[index];
                        let midd = undefined;
                        const listaMidd = GetListaMiddlewareMetaData();
                        if (typeof middlewareTmp === 'string' || middlewareTmp instanceof String) {
                            midd = listaMidd.CercaConNomeSeNoAggiungi(String(middlewareTmp));
                            SalvaListaMiddlewareMetaData(listaMidd);
                        }
                        else {
                            midd = middlewareTmp;
                        }
                        //se non funziona rispostare dopo il richiamo della funzione nella funzione di decorazione
                        if (metodoTmp != undefined && list != undefined && classeTmp != undefined) {
                            metodoTmp.middleware.push(midd);
                            SalvaListaClasseMetaData(list);
                        }
                        else {
                            //console.log("Errore mio!");
                        }
                    }
                }
            }
        }

    }
}