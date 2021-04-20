import { IDescrivibile, IPrintabile, targetTerminale, TipoParametro } from "../tools";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData, TerminaleClasse } from "./terminale-classe";
import { TypePosizione, TerminaleParametro } from "./terminale-parametro";
import chiedi from "prompts";
import helmet from "helmet";

import superagent, { head } from "superagent";
import express, { Router, Request, Response, NextFunction } from "express";
import { GetListaMiddlewareMetaData, ListaTerminaleMetodo, ListaTerminaleMiddleware, SalvaListaMiddlewareMetaData } from "../liste/lista-terminale-metodo";
import { ListaTerminaleParametro } from "../liste/lista-terminale-parametro";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import cors from 'cors';

export type TypeInterazone = "rotta" | "middleware" | 'ambo';

export interface IReturn {
    body: object;
    stato: number;
}
export interface IResponse {
    body: string
}

export class TerminaleMetodo implements IPrintabile, IDescrivibile {

    static nomeMetadataKeyTarget = "MetodoTerminaleTarget";
    classePath = '';
    listaParametri: ListaTerminaleParametro;
    tipo: TypeMetod;
    tipoInterazione: TypeInterazone;
    nome: string | Symbol;
    metodoAvviabile: any;
    path: string;
    pathGlobal: string;

    cors: any;
    helmet: any;

    middleware: any[] = [];

    descrizione: string;
    sommario: string;

    constructor(nome: string, path: string, classePath: string) {
        this.listaParametri = new ListaTerminaleParametro();
        this.nome = nome;
        this.path = path;
        this.classePath = classePath;
        this.tipo = 'get';
        this.pathGlobal = '';
        this.tipoInterazione = "rotta";

        this.descrizione = "";
        this.sommario = "";
        //this.listaRotteGeneraChiavi = [];
    }

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
        const middlew: any[] = [];
        this.middleware.forEach(element => {

            if (element instanceof TerminaleMetodo) {
                const listaMidd = GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                middlew.push(midd.ConvertiInMiddleare());
            }
        });
        if (this.metodoAvviabile != undefined) {
            var corsOptions = {
            }
            switch (this.tipo) {
                case 'get':
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
                        middlew,
                        async (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            this.InizializzaLogbaseIn(req, this.nome.toString());
                            const tmp = await this.Esegui(req);
                            res.status(tmp.stato).send(tmp.body);
                            this.InizializzaLogbaseOut(res, this.nome.toString());
                            return res;
                        });
                    break;
                case 'post':
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
                        middlew,
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
                case 'delete':
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
                        middlew,
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
                case 'patch':
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
                        middlew,
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
                case 'purge':
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
                        middlew,
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
                case 'put':
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
                        middlew,
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

                default:
                    break;
            }
        }
        return rotte;
    }
    async ChiamaLaRotta(headerpath?: string) {
        try {

            let body: string = "";
            let query: string = "";
            let header: string = "";
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];

                if (element instanceof TerminaleMetodo) {
                    const listaMidd = GetListaMiddlewareMetaData();
                    const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                    const rit = await midd.listaParametri.SoddisfaParamtri();

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
                    if (index + 1 >= this.middleware.length) {
                        const tmp = await this.MetSpalla(body, query, header, headerpath);
                        return tmp;
                    }
                }

            }

        } catch (error) {
            throw new Error("Errore :" + error);

        }
    }
    async MetSpalla(body: string, query: string, header: string, headerpath?: string): Promise<string> {
        try {

            if (headerpath == undefined) headerpath = "http://localhost:3000"
            console.log('chiamata per : ' + headerpath + this.pathGlobal + ' | Verbo: ' + this.tipo);
            let parametri = await this.listaParametri.SoddisfaParamtri();

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
            if (this.tipo) {

                switch (this.tipo) {
                    case 'get':
                        try {
                            ritorno = await superagent
                                .get(headerpath + this.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json')
                                //.auth('my_token', { type: 'bearer' })
                                ;
                            if (ritorno) {
                                return ritorno.body;
                            } else {
                                return '';
                            }
                        } catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    case 'post':
                        try {
                            ritorno = await superagent
                                .post(headerpath + this.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json')
                        /* .set('Authorization', `Bearer ${chiave.body}`) */;
                            if (ritorno) {
                                return ritorno.body;
                            } else {
                                return '';
                            }
                        } catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    case 'purge':
                        try {
                            ritorno = await superagent
                                .purge(headerpath + this.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json')
                        /* .set('Authorization', `Bearer ${chiave.body}`) */;
                            if (ritorno) {
                                return ritorno.body;
                            } else {
                                return '';
                            }
                        } catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    case 'patch':
                        try {
                            ritorno = await superagent
                                .patch(headerpath + this.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json')
                        /* .set('Authorization', `Bearer ${chiave.body}`) */;
                            if (ritorno) {
                                return ritorno.body;
                            } else {
                                return '';
                            }
                        } catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    case 'delete':
                        try {
                            ritorno = await superagent
                                .delete(headerpath + this.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json')
                        /* .set('Authorization', `Bearer ${chiave.body}`) */;
                            if (ritorno) {
                                return ritorno.body;
                            } else {
                                return '';
                            }
                        } catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    default:
                        return '';
                        break;
                }
            }
            else {
                return '';
            }
            /* if (ritorno) {
                ritorno?.body;
                return ritorno.body;
            } else {
                return undefined;
            } */
        } catch (error) {
            throw new Error("Errore:" + error);

        }
    }
    /* async RecuperaChiave(): Promise<IResponse> {
        try {
            console.log("La rotta è protetta, sono state trovate delle funzioni che potrebbero sbloccarla, scegli:");
            for (let index = 0; index < this.listaRotteGeneraChiavi.length; index++) {
                const element = this.listaRotteGeneraChiavi[index];
                console.log(index + ': ' + element.nome);
            }
            const tmp = await chiedi({
                message: 'Scegli: ',
                type: 'number',
                name: 'scelta'
            });
            const ritorno = await this.listaRotteGeneraChiavi[tmp.scelta].ChiamaLaRotta();
            let tmp2: IResponse = { body: '' };
            if (ritorno) {
                tmp2.body = ritorno.body;
            }
            return tmp2;
        } catch (error) {
            return { body: '' };
        }
    } */
    CercaParametroSeNoAggiungi(nome: string, parameterIndex: number, tipoParametro: TipoParametro, posizione: TypePosizione) {
        const tmp = new TerminaleParametro(nome, tipoParametro, posizione, parameterIndex);
        this.listaParametri.push(tmp);//.lista.push({ propertyKey: propertyKey, Metodo: target });
        return tmp;
    }
    async Esegui(req: Request): Promise<IReturn> {
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
    ConvertiInMiddleare() {
        return async (req: Request, res: Response, nex: NextFunction) => {
            const tmp = await this.Esegui(req);
            if (tmp.stato >= 300) {
                throw new Error("Errore : " + tmp.body);
            }
            else {
                return nex;
            }
        };
    }
    SettaSwagger(tipoInterazione: 'rotta' | 'middleware') {
        let ritorno = '';
        if (tipoInterazione == 'middleware') {
            //questo deve restituire un oggetto
            let tmp = {};
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    ritorno = ritorno + tt;
                    if (index == 0 && index + 1 != this.listaParametri.length) {
                        ritorno = ritorno + ', ';
                    }
                }
            }
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                const tt = element.SettaSwagger();
                ritorno = ritorno + tt;
                if (index == 0 && index + 1 != this.listaParametri.length) {
                    ritorno = ritorno + ', ';
                }
                /* if (index + 1 == this.listaParametri.length) {
                    ritorno = ritorno + ' }'
                } */
            }
        }
        else {
            ritorno =
                `"${this.pathGlobal}": {
            "${this.tipo}": {
                "summary": "${this.sommario}",
                "description": "${this.descrizione}",                
                "parameters": [`;
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    ritorno = ritorno + tt;
                    if (index == 0 && index + 1 != this.listaParametri.length) {
                        ritorno = ritorno + ', ';
                    }
                }
            }
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                const tt = element.SettaSwagger();
                ritorno = ritorno + tt;
                if (index == 0 && index + 1 != this.listaParametri.length) {
                    ritorno = ritorno + ', ';
                }
                /* if (index + 1 == this.listaParametri.length) {
                    ritorno = ritorno + ' }'
                } */
            }
            ritorno = ritorno + ` 
                ],
                "responses": {
                    "200":{
                        "description":"ok"
                    }
                },
            },
        },`;
        }

        try {
            JSON.parse(ritorno)
        } catch (error) {
            console.log(error);
        }
        return ritorno;
    }
}

export function CheckMetodoMetaData(nomeMetodo: string, classe: TerminaleClasse) {
    let tmp: ListaTerminaleMetodo = Reflect.getMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni
    if (tmp == undefined) {//se non c'è 
        tmp = new ListaTerminaleMetodo(classe.rotte);//lo creo
        Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale);//e lo aggiungo a i metadata
    }
    let terminale = tmp.CercaConNome(nomeMetodo, classe.path); //cerca la mia funzione
    if (terminale == undefined)/* se non c'è */ {
        terminale = new TerminaleMetodo(nomeMetodo, "", classe.nome); // creo la funzione
    }
    return terminale;
}

export type TypeMetod = "get" | "put" | "post" | "patch" | "purge" | "delete";

export interface IMetodo {
    tipo?: TypeMetod,
    path?: string,
    interazione?: TypeInterazone,
    descrizione?: string,
    sommario?: string
}
function decoratoreMetodo(parametri: IMetodo
): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());

        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;

            if (parametri.tipo != undefined) metodo.tipo = parametri.tipo;
            else metodo.tipo = 'get';

            if (parametri.descrizione != undefined) metodo.descrizione = parametri.descrizione;
            else metodo.descrizione = '';

            if (parametri.sommario != undefined) metodo.sommario = parametri.sommario;
            else metodo.sommario = '';

            if (parametri.interazione != undefined) metodo.tipoInterazione = parametri.interazione;
            else metodo.tipoInterazione = 'rotta';

            if (parametri.path == undefined) metodo.path = propertyKey.toString();
            else metodo.path = parametri.path;


            if (parametri.interazione == 'middleware' || parametri.interazione == 'ambo') {

                const listaMidd = GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(propertyKey.toString());
                midd.metodoAvviabile = descriptor.value;
                midd.listaParametri = metodo.listaParametri;
                SalvaListaMiddlewareMetaData(listaMidd);
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

        let midd = undefined;
        const listaMidd = GetListaMiddlewareMetaData();
        if (typeof item === 'string' || item instanceof String) {
            midd = listaMidd.CercaConNomeSeNoAggiungi(String(item));
            SalvaListaMiddlewareMetaData(listaMidd);
        }
        else {
            midd = item;
        }


        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.middleware.push(midd);
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
