import { Response, Request } from "express";
import { IHtml, ILogbase, IReturn, IRitornoValidatore, tipo } from "../utility";

import { IParametriEstratti } from "../parametro/utility-parametro";
import { ListaTerminaleParametro } from "../parametro/lista-parametro";

export type TypeMetod = "get" | "put" | "post" | "patch" | "purge" | "delete";

export type TypeInterazone = "rotta" | "middleware" | 'ambo';

export type TypePosizione = "body" | "query" | 'header';

import slowDown, { Options as OptSlowDows } from "express-slow-down";
import rateLimit, { Options as OptRateLimit } from "express-rate-limit";
import { Options as OptionsCache } from "express-redis-cache";

export class SanificatoreCampo {
    campoDaCercare: string;
    valoreFuturo: string;
    constructor() {
        this.campoDaCercare = '';
        this.valoreFuturo = '';
    }
}

export class RispostaControllo {
    trigger: number;
    risposta?: Risposta;
    onModificaRisposta?: (dati: IReturn) => IReturn | Promise<IReturn>;
    constructor() {
        this.trigger = 0;
    }
}

/**
 * Specifica il tipo, questo puo essere: "get" | "put" | "post" | "patch" | "purge" | "delete" 
 * tipo?: TypeMetod,
 * specifica il percorso di una particolare, se non impostato prende il nome della classe 
 * path?: string,
 * l'interazione è come viene gestito il metodo, puo essere : "rotta" | "middleware" | "ambo" 
 * interazione?: TypeInterazone,
 * la descrizione è utile piu nel menu o in caso di output 
 * descrizione?: string,
 * il sommario è una versione piu semplice della descrizione 
 * sommario?: string,
 * questa è la strada per andare ad assegnare questa funzione è piu classi o sotto percorsi
 * nomiClasseRiferimento?: IClasseRiferimento[],

 * onChiamataCompletata?: (logOn: string, result: any, logIn: string) => void

 * Validatore?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => IRitornoValidatore;
 */
export interface IMetodo extends IMetodoParametri, IMetodoEventi, IMetodoLimitazioni, IMetodoVettori {

}
export interface IMetodoParametri {

    //schemaSwagger?: any;
    /**Specifica se il percorso dato deve essere concatenato al percorso della classe o se è da prendere singolarmente di default è falso e quindi il percorso andra a sommarsi al percorso della classe */
    percorsoIndipendente?: boolean,
    /** Specifica il tipo, questo puo essere: "get" | "put" | "post" | "patch" | "purge" | "delete" */
    tipo?: TypeMetod,
    /** specifica il percorso di una particolare, se non impostato prende il nome della classe */
    path?: string,
    /** l'interazione è come viene gestito il metodo, puo essere : "rotta" | "middleware" | "ambo" */
    interazione?: TypeInterazone,
    /** la descrizione è utile piu nel menu o in caso di output */
    descrizione?: string,
    /** il sommario è una versione piu semplice della descrizione */
    sommario?: string,
    /** questa è la strada per andare ad assegnare questa funzione è piu classi o sotto percorsi
     */
}
export interface IMetodoVettori {
    ListaSanificatori?: SanificatoreCampo[];
    RisposteDiControllo?: RispostaControllo[];
    swaggerClassi?: string[];
    nomiClasseRiferimento?: IClasseRiferimento[];
    listaTest?: {
        /* nomeTest?:string, 
        posizione?:number,
        nomeTestGenerico?:string, */
        body: any,
        query: any,
        header: any
    }[];
    listaHtml?: IHtml[];
}
export interface IMetodoEventi {
    /**
     * se impostata permette di determinare cosa succedera nel momento dell'errore
     */
    onChiamataInErrore?: (logOut: string, result: any, logIn: string, errore: any) => IReturn;
    onPrimaDiEseguireMetodo?: (parametri: IParametriEstratti) => IParametriEstratti | Promise<IParametriEstratti>;
    /**
     * se impostata permette di  verificare lo stato quando il metodo va a buon fine.
     */
    onChiamataCompletata?: (logOut: string, result: any, logIn: string, errore: any) => void;
    onLog?: (logOut: string, result: any, logIn: string, errore: any) => void;

    Validatore?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => IRitornoValidatore | void;

    Istanziatore?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => any;

    onRispostaControllatePradefinita?: (dati: IReturn) => IReturn | Promise<IReturn>;

    onPrimaDiTerminareLaChiamata?: (res: IReturn) => IReturn;

    onDopoAverTerminatoLaFunzione?: (item: any) => any;

    onPrimaDiEseguire?: (req: Request) => Request | Promise<Request>;
}
export interface IMetodoLimitazioni {
    slow_down?: OptSlowDows;
    rate_limit?: OptRateLimit;
    cors?: any;
    helmet?: any;
    middleware?: any[];

    cacheOptionRedis?: OptionsCache;
    cacheOptionMemory?: { durationSecondi: number };
}


export class Risposta {
    stato: number;
    descrizione: string;
    valori: {
        nome: string,
        tipo: tipo,
        note?: string
    }[];

    trigger?: { nome: string, valore: any, posizione: TypePosizione };
    htmlPath?: string;
    html?: string;
    isHandlebars?: boolean;

    constructor() {
        this.stato = 200;
        this.descrizione = '';
        this.valori = [];
        this.isHandlebars = false;
    }
}

export interface IClasseRiferimento {
    nome: string,
    listaMiddleware?: any[]
}

