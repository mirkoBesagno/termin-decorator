import { IPrintabile, IType, targetTerminale } from "../tools";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData, TerminaleClasse } from "./terminale-classe";
import { EPosizione, TerminaleParametro } from "./terminale-parametro";
import chiedi from "prompts";
import helmet from "helmet";

import superagent, { head } from "superagent";
import express, { Router, Request, Response } from "express";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleParametro } from "../liste/lista-terminale-parametro";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import cors from 'cors';

export enum ERuolo {
    bloccato, chiave
}
export type TypeRuolo = "bloccato" | "chiavegen" | "chiavevalid"
export interface IReturn {
    body: object;
    stato: number;
}
export interface IResponse {
    body: string
}

export class TerminaleMetodo implements IPrintabile {
    static ListaRotteGeneraChiavi: TerminaleMetodo[] = [];
    static ListaRotteValidaChiavi: TerminaleMetodo[] = [];

    classePath = '';
    static nomeMetadataKeyTarget = "MetodoTerminaleTarget";
    private _listaParametri: ListaTerminaleParametro;
    tipo: TypeMetodo;

    private _nome: string | Symbol;
    metodoAvviabile: any;
    private _path: string;
    pathGlobal: string;
    ruolo: TypeRuolo;

    cors: any;
    helmet: any;
    middleware: any[] = [];
    constructor(nome: string, path: string, classePath: string, protetto: TypeRuolo) {
        this._listaParametri = new ListaTerminaleParametro();
        this._nome = nome;
        this._path = path;
        this.classePath = classePath;
        this.tipo = TypeMetodo.indefinita;
        this.pathGlobal = '';
        this.ruolo = protetto
    }
    /* start : get e set */
    public get nome(): string | Symbol {
        return this._nome;
    }
    public set nome(value: string | Symbol) {
        this._nome = value;
    }
    public get path(): string {
        return this._path;
    }
    public set path(value: string) {
        this._path = value;
    }
    public get listaParametri(): ListaTerminaleParametro {
        return this._listaParametri;
    }
    public set listaParametri(value: ListaTerminaleParametro) {
        this._listaParametri = value;
    }
    /* end : get e ste */
    async PrintMenu() {
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            element.PrintMenu();
        }
    }
    PrintCredenziali(pathRoot?: string) {
        const tab = '\t\t\t';
        let parametri = "";
        console.log(tab + 'TerminaleMetodo' + '->' + 'PrintCredenziali');
        console.log(tab + this.nome + ' | ' + this.path + ' ;');

        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        if (pathRoot != undefined) console.log(tab + this.nome + ' | ' + '/' + pathRoot + '/' + this.path + '  |  ' + parametri);
        else console.log(tab + this.nome + ' | ' + "/" + this.path + '  |  ' + parametri);
        console.log(this.pathGlobal);


    }
    PrintStamp() {
        let parametri = "";
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        const tmp = this.nome + ' | ' + '/' + this.pathGlobal + '/' + this.path + '  |  ' + parametri;
        //console.log(tmp);
        return tmp;
    }
    ConfiguraRotta(rotte: Router, pathglobal: string): Router {
        this.pathGlobal = pathglobal + '/' + this.path;
        if (this.metodoAvviabile != undefined) {
            if (this.ruolo == "bloccato") {

            }
            var corsOptions = {
            }
            switch (this.tipo) {
                case TypeMetodo.get:
                    (<IReturn>this.metodoAvviabile).body;

                    /* const options: cors.CorsOptions = {
                        allowedHeaders: [
                          'Origin',
                          'X-Requested-With',
                          'Content-Type',
                          'Accept',
                          'X-Access-Token',
                        ],
                        credentials: true,
                        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
                        origin: API_URL,
                        preflightContinue: false,
                      }; */

                    corsOptions = {
                        methods: "GET"
                    }
                    if (this.helmet == undefined) {
                        this.helmet = helmet();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors(corsOptions);
                    }
                    rotte.get("/" + this.path.toString(),
                        cors(this.cors),
                        helmet(this.helmet),
                        this.middleware,
                        async (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                            let tmp: IReturn;
                            try {
                                tmp = this.metodoAvviabile.apply(this, parametri);
                            } catch (error) {
                                console.log("Errore : \n" + error);
                                tmp = {
                                    body: { "Errore Interno filtrato ": 'internal error!!!!' },
                                    stato: 500
                                }
                            }   */
                            this.InizializzaLogbaseIn(req, this.nome.toString());
                            const tmp = await this.Esegui(req);
                            res.status(tmp.stato).send(tmp.body);
                            this.InizializzaLogbaseOut(res, this.nome.toString());
                            return res;
                        });
                    break;
                case TypeMetodo.post:
                    corsOptions = {
                        methods: "POST"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors(corsOptions);
                    }
                    (<IReturn>this.metodoAvviabile).body;
                    rotte.post("/" + this.path.toString(),
                        cors(this.cors),
                        helmet(this.helmet),
                        this.middleware,
                        async (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                            const tmp = this.metodoAvviabile.apply(this, parametri); */
                            this.InizializzaLogbaseIn(req, this.nome.toString());
                            const tmp = await this.Esegui(req);
                            res.status(tmp.stato).send(tmp.body);
                            this.InizializzaLogbaseOut(res, this.nome.toString());
                            return res;
                        });
                    break;
                case TypeMetodo.delete:
                    (<IReturn>this.metodoAvviabile).body;
                    corsOptions = {
                        methods: "DELETE"
                    }
                    if (this.helmet == undefined) {
                        this.helmet = helmet();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors(corsOptions);
                    }
                    rotte.delete("/" + this.path.toString(),
                        cors(this.cors),
                        helmet(this.helmet),
                        this.middleware,
                        async (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                            const tmp = this.metodoAvviabile.apply(this, parametri); */
                            this.InizializzaLogbaseIn(req, this.nome.toString());
                            const tmp = await this.Esegui(req);
                            res.status(tmp.stato).send(tmp.body);
                            this.InizializzaLogbaseOut(res, this.nome.toString());
                            return res;
                        });
                    break;
                case TypeMetodo.patch:
                    corsOptions = {
                        methods: "PATCH"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors(corsOptions);
                    }
                    (<IReturn>this.metodoAvviabile).body;
                    rotte.patch("/" + this.path.toString(),
                        cors(this.cors),
                        helmet(this.helmet),
                        this.middleware,
                        async (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                            const tmp = this.metodoAvviabile.apply(this, parametri); */
                            this.InizializzaLogbaseIn(req, this.nome.toString());
                            const tmp = await this.Esegui(req);
                            res.status(tmp.stato).send(tmp.body);
                            this.InizializzaLogbaseOut(res, this.nome.toString());
                            return res;
                        });
                    break;
                case TypeMetodo.purge:
                    corsOptions = {
                        methods: "PURGE"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors(corsOptions);
                    }
                    (<IReturn>this.metodoAvviabile).body;
                    rotte.purge("/" + this.path.toString(),
                        cors(this.cors),
                        helmet(this.helmet),
                        this.middleware,
                        async (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                            const tmp = this.metodoAvviabile.apply(this, parametri); */
                            this.InizializzaLogbaseIn(req, this.nome.toString());
                            const tmp = await this.Esegui(req);
                            res.status(tmp.stato).send(tmp.body);
                            this.InizializzaLogbaseOut(res, this.nome.toString());
                            return res;
                        });
                    break;
                case TypeMetodo.put:
                    corsOptions = {
                        methods: "PUT"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors(corsOptions);
                    }
                    (<IReturn>this.metodoAvviabile).body;
                    rotte.put("/" + this.path.toString(),
                        cors(this.cors),
                        helmet(this.helmet),
                        this.middleware,
                        async (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                            const tmp = this.metodoAvviabile.apply(this, parametri); */
                            this.InizializzaLogbaseIn(req, this.nome.toString());
                            const tmp = await this.Esegui(req);
                            res.status(tmp.stato).send(tmp.body);
                            this.InizializzaLogbaseOut(res, this.nome.toString());
                            return res;
                        });
                    break;
                case TypeMetodo.indefinita:
                    break;
                default:
                    break;
            }
        }
        return rotte;
    }
    async ChiamaLaRotta(headerpath?: string) {
        let chiave: IResponse = { body: '' };
        if (this.ruolo == 'bloccato') {
            console.log();
            chiave = await this.RecuperaChiave();
            chiave.body;
        }
        if (headerpath == undefined) headerpath = "http://localhost:3000"
        console.log('chiamata per : ' + headerpath + this.pathGlobal + ' | Verbo: ' + this.tipo);
        const parametri = await this.listaParametri.SoddisfaParamtri();
        let ritorno;
        switch (this.tipo) {
            case TypeMetodo.get:
                try {
                    ritorno = await superagent
                        .get(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json')
                        .set('Authorization', `Bearer ${chiave.body}`);
                } catch (error) {
                    console.log(error);
                }
                break;
            case TypeMetodo.post:
                try {
                    ritorno = await superagent
                        .post(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json')
                        .set('Authorization', `Bearer ${chiave.body}`);
                } catch (error) {
                    console.log(error);
                }
                break;
            case TypeMetodo.purge:
                try {
                    ritorno = await superagent
                        .purge(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json')
                        .set('Authorization', `Bearer ${chiave.body}`);
                } catch (error) {
                    console.log(error);
                }
                break;
            case TypeMetodo.patch:
                try {
                    ritorno = await superagent
                        .patch(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json')
                        .set('Authorization', `Bearer ${chiave.body}`);
                } catch (error) {
                    console.log(error);
                }
                break;
            case TypeMetodo.delete:
                try {
                    ritorno = await superagent
                        .delete(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json')
                        .set('Authorization', `Bearer ${chiave.body}`);
                } catch (error) {
                    console.log(error);
                }
                break;
            default:
                break;
        }
        ritorno?.body;
        return ritorno;
    }
    async RecuperaChiave(): Promise<IResponse> {
        try {
            console.log("La rotta è protetta, sono state trovate delle funzioni che potrebbero sbloccarla, scegli:");
            for (let index = 0; index < TerminaleMetodo.ListaRotteGeneraChiavi.length; index++) {
                const element = TerminaleMetodo.ListaRotteGeneraChiavi[index];
                console.log(index + ': ' + element.nome);
            }
            const tmp = await chiedi({
                message: 'Scegli: ',
                type: 'number',
                name: 'scelta'
            });
            const ritorno = await TerminaleMetodo.ListaRotteGeneraChiavi[tmp.scelta].ChiamaLaRotta();
            let tmp2: IResponse = { body: '' };
            if (ritorno) {
                tmp2.body = ritorno.body;
            }
            return tmp2;
        } catch (error) {
            return { body: '' };
        }
    }
    CercaParametroSeNoAggiungi(nome: string, parameterIndex: number, tipoParametro: IType, posizione: EPosizione) {
        this.listaParametri.push(new TerminaleParametro(nome, tipoParametro, posizione, parameterIndex))//.lista.push({ propertyKey: propertyKey, Metodo: target });                                           
    }
    Esegui(req: Request): IReturn {
        console.log('Risposta a chiamata : ' + this.pathGlobal);
        const parametri = this.listaParametri.EstraiParametriDaRequest(req);
        let tmp: IReturn;
        try {
            tmp = this.metodoAvviabile.apply(this, parametri);
        } catch (error) {
            console.log("Errore : \n" + error);
            tmp = {
                body: { "Errore Interno filtrato ": 'internal error!!!!' },
                stato: 500
            };
        }
        return tmp;
    }


    InizializzaLogbaseIn(req: Request, nomeMetodo?: string): string {
        console.log("Arrivato in : " + nomeMetodo + "\n"
            + "Data : " + new Date(Date.now()) + "\n"
            + "url : " + req.originalUrl + "\n"
            + "query : " + JSON.stringify(req.query) + "\n"
            + "body : " + JSON.stringify(req.body) + "\n"
            + "header : " + JSON.stringify(req.headers) + "\n"
            + "soket : " + "\n"
            + "local : " + req.socket.localAddress + " : " + req.socket.localPort + "\n"
            + "remote : " + req.socket.remoteAddress + " : " + req.socket.remotePort + "\n"
        );
        const body = req.body;
        const data = new Date(Date.now());
        const header = JSON.parse(JSON.stringify(req.headers));
        const local = req.socket.localAddress + " : " + req.socket.localPort;
        const remote = req.socket.remoteAddress + " : " + req.socket.remotePort;
        const url = req.originalUrl;

        const tmp = "Arrivato in : " + nomeMetodo + "\n"
            + "Data : " + new Date(Date.now()) + "\n"
            + "url : " + req.originalUrl + "\n"
            + "query : " + JSON.stringify(req.query) + "\n"
            + "body : " + JSON.stringify(req.body) + "\n"
            + "header : " + JSON.stringify(req.headers) + "\n"
            + "soket : " + "\n"
            + "local : " + req.socket.localAddress + " : " + req.socket.localPort + "\n"
            + "remote : " + req.socket.remoteAddress + " : " + req.socket.remotePort + "\n";
        return tmp;
    }
    InizializzaLogbaseOut(req: Response, nomeMetodo?: string): string {

        var t1 = '', t2 = '';
        if (req.socket != undefined) {
            t1 = req.socket.localAddress + " : " + req.socket.localPort;
            t2 = req.socket.remoteAddress + " : " + req.socket.remotePort;
        }
        console.log("Arrivato in : " + nomeMetodo + "\n"
            + "Data : " + new Date(Date.now()) + "\n"
            + "headersSent : " + req.headersSent + "\n"
            // + "json : " + req.json + "\n"
            // + "send : " + req.send + "\n"
            + "sendDate : " + req.sendDate + "\n"
            + "statusCode : " + req.statusCode + '\n'
            + "statuMessage : " + req.statusMessage + '\n'
            + "soket : " + "\n"
            + "local : " + t1 + "\n"
            + "remote : " + t2 + "\n"
        );


        const tmp = "Arrivato in : " + nomeMetodo + "\n"
            + "Data : " + new Date(Date.now()) + "\n"
            + "headersSent : " + req.headersSent + "\n"
            + "json : " + req.json + "\n"
            + "send : " + req.send + "\n"
            + "sendDate : " + req.sendDate + "\n"
            + "statusCode : " + req.statusCode + '\n'
            + "statuMessage : " + req.statusMessage + '\n'
            + "soket : " + "\n"
            + "local : " + t1 + "\n"
            + "remote : " + t2 + "\n";
        return tmp;
    }
}

export function CheckMetodoMetaData(nomeMetodo: string, classe: TerminaleClasse, ruolo: TypeRuolo) {
    let tmp: ListaTerminaleMetodo = Reflect.getMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni
    if (tmp == undefined) {//se non c'è 
        tmp = new ListaTerminaleMetodo(classe.rotte);//lo creo
        Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale);//e lo aggiungo a i metadata
    }
    let terminale = tmp.CercaConNome(nomeMetodo, classe.path); //cerca la mia funzione
    if (terminale == undefined)/* se non c'è */ {
        terminale = new TerminaleMetodo(nomeMetodo, "", classe.nome, ruolo); // creo la funzione
    }
    return terminale;
}

export enum TypeMetodo {
    get, put, post, patch, purge, delete, indefinita
}
export type TypeMetod = "get" | "put" | "post" | "patch" | "purge" | "delete";

function decoratoreMetodo(tipo: TypeMetod, path?: string, ruolo?: TypeRuolo): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());

        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;
            metodo.tipo = TypeMetodo[tipo];
            if (ruolo == undefined) metodo.ruolo = 'bloccato';
            else metodo.ruolo = ruolo;

            if (path == undefined) metodo.path = propertyKey.toString();
            else metodo.path = path;

            if (metodo.ruolo == 'chiavegen') {
                classe.listaMetodiGeneraKey.push(metodo);
                TerminaleMetodo.ListaRotteGeneraChiavi.push(metodo);
            } else if (metodo.ruolo == 'chiavevalid') {
                classe.listaMetodiValidaKey.push(metodo);
            }

            SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    }
}

export function mpAddCors(cors: any): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());

        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.cors = cors;
            SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    }
}
export function mpAddHelmet(helmet: any): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());

        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.helmet = helmet;
            SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    }
}
export function mpAddMiddle(item: any): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());

        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.middleware.push(item);
            SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    }
}

export { decoratoreMetodo as mpMetRev };
export { decoratoreMetodo as mpMet };
export { decoratoreMetodo as mpM };
export { decoratoreMetodo as mpMetodo };
export { decoratoreMetodo as mpDecoratoreMetodo };
export { decoratoreMetodo as mpDecMetodo };
export { decoratoreMetodo as mpDecMet };


export { decoratoreMetodo as MPMetRev };
export { decoratoreMetodo as MPM };
export { decoratoreMetodo as MPMetodo };
export { decoratoreMetodo as MPDecoratoreMetodo };
export { decoratoreMetodo as MPDecMetodo };
export { decoratoreMetodo as MPDecMet };
