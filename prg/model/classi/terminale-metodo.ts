import { IDescrivibile, InizializzaLogbaseIn, InizializzaLogbaseOut, IPrintabile, targetTerminale, TipoParametro } from "../tools";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData, TerminaleClasse } from "./terminale-classe";
import { TypePosizione, TerminaleParametro, IParametro } from "./terminale-parametro";
import chiedi from "prompts";
import helmet from "helmet";

import superagent, { head } from "superagent";
import express, { Router, Request, Response, NextFunction } from "express";
import { GetListaMiddlewareMetaData, ListaTerminaleMetodo, ListaTerminaleMiddleware, SalvaListaMiddlewareMetaData } from "../liste/lista-terminale-metodo";
import { INonTrovato, IParametriEstratti, ListaTerminaleParametro } from "../liste/lista-terminale-parametro";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import cors from 'cors';
import { IRaccoltaPercorsi } from "./terminale-main";

export type TypeInterazone = "rotta" | "middleware" | 'ambo';

export interface IReturn {
    body: object | string;
    stato: number;
    nonTrovati?: INonTrovato[];
    inErrore?: IRitornoValidatore[];
}
export interface IResponse {
    body: string
}
export interface ITerminaleMetodo {

}
export class TerminaleMetodo implements IPrintabile, IDescrivibile {

    static nomeMetadataKeyTarget = "MetodoTerminaleTarget";

    percorsi: IRaccoltaPercorsi;
    classePath = '';
    listaParametri: ListaTerminaleParametro;
    tipo: TypeMetod;
    tipoInterazione: TypeInterazone;
    nome: string | Symbol;
    metodoAvviabile: any;
    path: string;

    cors: any;
    helmet: any;

    middleware: any[] = [];

    descrizione: string;
    sommario: string;
    nomiClassiDiRiferimento: string[] = [];

    onChiamataCompletata?: (logOn: string, result: any, logIn: string) => void;
    onParametriNonTrovati?: (nonTrovati?: INonTrovato[]) => void;

    Validatore?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => IRitornoValidatore;
    onPrimaDiEseguireMetodo?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => any[];
    onPrimaDiTerminareLaChiamata?: (res: IReturn) => IReturn;
    onPrimaDiEseguireExpress?: () => void;
    onPrimaDirestituireResponseExpress?: () => void;

    constructor(nome: string, path: string, classePath: string) {
        this.listaParametri = new ListaTerminaleParametro();
        this.nome = nome;
        this.path = path;
        this.classePath = classePath;
        this.tipo = 'get';
        this.tipoInterazione = "rotta";

        this.descrizione = "";
        this.sommario = "";
        this.nomiClassiDiRiferimento = [];

        this.percorsi = { pathGlobal: '', patheader: '', porta: 0 };
        //this.listaRotteGeneraChiavi = [];
    }

    ConfiguraRottaApplicazione(app: any, percorsi: IRaccoltaPercorsi) {
        this.percorsi.patheader = percorsi.patheader;
        this.percorsi.porta = percorsi.porta;
        const pathGlobal = percorsi.pathGlobal + '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
        const middlew: any[] = [];
        this.middleware.forEach(element => {

            if (element instanceof TerminaleMetodo) {
                const listaMidd = GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                middlew.push(midd.ConvertiInMiddleare());
            }
        });
        if (this.metodoAvviabile != undefined) {
            var corsOptions = {};
            /* var corsOptions = {
                methods: this.tipo
            }

            if (this.helmet == undefined) {
                this.helmet = helmet();
            }
            if (this.cors == undefined) {
                this.cors = cors(corsOptions);
            }
            app.all("/" + this.percorsi.pathGlobal,
                cors(this.cors),
                //helmet(this.helmet),
                //middlew,
                async (req: Request, res: Response) => {
                    console.log('Risposta a chiamata : ' + this.percorsi.pathGlobal);
                    InizializzaLogbaseIn(req, this.nome.toString());
                    const tmp = await this.Esegui(req);
                    res.status(tmp.stato).send(tmp.body);
                    InizializzaLogbaseOut(res, this.nome.toString());
                    return res;
                }); */

            /*  */
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
                    if (this.cors == undefined) {
                        this.cors = cors(corsOptions);
                    }
                    if (this.helmet == undefined) {
                        this.helmet = helmet();
                    }
                    app.get(this.percorsi.pathGlobal /* this.path */,
                        this.cors,
                        this.helmet,
                        middlew,
                        async (req: Request, res: Response) => {
                            return await this.ChiamataGenerica(req, res);
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
                        this.cors = cors(corsOptions);
                    }
                    (<IReturn>this.metodoAvviabile).body;
                    app.post(this.percorsi.pathGlobal,
                        this.cors,
                        this.helmet,
                        middlew,
                        async (req: Request, res: Response) => {
                            return await this.ChiamataGenerica(req, res);
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
                    app.delete(this.percorsi.pathGlobal,
                        this.cors,
                        this.helmet,
                        middlew,
                        async (req: Request, res: Response) => {
                            return await this.ChiamataGenerica(req, res);
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
                    app.patch(this.percorsi.pathGlobal,
                        this.cors,
                        this.helmet,
                        middlew,
                        async (req: Request, res: Response) => {
                            return await this.ChiamataGenerica(req, res);
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
                    app.purge(this.percorsi.pathGlobal,
                        this.cors,
                        this.helmet,
                        middlew,
                        async (req: Request, res: Response) => {
                            return await this.ChiamataGenerica(req, res);
                        });
                    break;
                case 'put':
                    corsOptions = {
                        methods: "PUT"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet();
                        if (this.cors == undefined) {
                            this.cors = cors(corsOptions);
                        }
                        (<IReturn>this.metodoAvviabile).body;
                        app.put(this.percorsi.pathGlobal,
                            this.cors,
                            this.helmet,
                            middlew,
                            async (req: Request, res: Response) => {
                                return await this.ChiamataGenerica(req, res);
                            });
                        break;
                    }
            }
        }
    }
    async ChiamataGenerica(req: Request, res: Response) {
        try {
            console.log('Risposta a chiamata : ' + this.percorsi.pathGlobal);
            const logIn = InizializzaLogbaseIn(req, this.nome.toString());
            let tmp: IReturn = await this.Esegui(req);
            if (this.onParametriNonTrovati) this.onParametriNonTrovati(tmp.nonTrovati);
            if (this.onPrimaDiTerminareLaChiamata) tmp = this.onPrimaDiTerminareLaChiamata(tmp);
            res.status(tmp.stato).send(tmp.body);
            const logOit = InizializzaLogbaseOut(res, this.nome.toString());
            if (this.onChiamataCompletata) {
                this.onChiamataCompletata(logIn, tmp, logOit);
            }
            return res;
        } catch (error) {
            if (this.onChiamataCompletata) {
                this.onChiamataCompletata('', { stato: 500, body: error }, '');
            }
            res.status(500).send(error);
            return res;
        }
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
                }
            }

            if (headerpath == undefined) headerpath = "http://localhost:3000";
            console.log('chiamata per : ' + this.percorsi.pathGlobal + ' | Verbo: ' + this.tipo);
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
            let gg = this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal
            /*  */
            /* ritorno = await axios({
                method: this.tipo,
                url: gg,
                headers: header,
                params: query,
                data: '{' + body + '}'
            }); */

            /*  */

            /* // Build the post string from an object
            var post_data = qs.stringify({
                'compilation_level': 'ADVANCED_OPTIMIZATIONS',
                'output_format': 'json',
                'output_info': 'compiled_code',
                'warning_level': 'QUIET',
                'js_code': JSON.parse('{ ' + body + ' }')
            });

            var post_options = {
                host: this.percorsi.patheader,
                port: this.percorsi.porta,
                path: this.percorsi.pathGlobal,
                method: this.tipo,
                query: JSON.parse('{ ' + query + ' }'),
                header: Object.assign({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(post_data),
                }, JSON.parse('{ ' + header + ' }'))
            };

            // Set up the request
            var post_req = await http.request(post_options);
             , function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        }); 

            // post the data
            post_req.write(post_data);
            post_req.end(); */

            switch (this.tipo) {
                case 'get':
                    try {
                        // Send a POST request
                        ritorno = await superagent
                            .get(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                            .query(JSON.parse('{ ' + query + ' }'))
                            .send(JSON.parse('{ ' + body + ' }'))
                            .set(JSON.parse('{ ' + header + ' }'))
                            .set('accept', 'json')
                            //.auth('my_token', { type: 'bearer' })
                            ;
                    } catch (error) {
                        console.log(error);
                        throw new Error("Errore:" + error);
                    }
                    break;
                case 'post':
                    try {
                        ritorno = await superagent
                            .post(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                            .query(JSON.parse('{ ' + query + ' }'))
                            .send(JSON.parse('{ ' + body + ' }'))
                            .set(JSON.parse('{ ' + header + ' }'))
                            .set('accept', 'json')
                    /* .set('Authorization', `Bearer ${chiave.body}`) */;
                    } catch (error) {
                        console.log(error);
                        throw new Error("Errore:" + error);
                    }
                    break;
                case 'purge':
                    try {
                        ritorno = await superagent
                            .purge(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                            .query(JSON.parse('{ ' + query + ' }'))
                            .send(JSON.parse('{ ' + body + ' }'))
                            .set(JSON.parse('{ ' + header + ' }'))
                            .set('accept', 'json')
                    /* .set('Authorization', `Bearer ${chiave.body}`) */;
                    } catch (error) {
                        console.log(error);
                        throw new Error("Errore:" + error);
                    }
                    break;
                case 'patch':
                    try {
                        ritorno = await superagent
                            .patch(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                            .query(JSON.parse('{ ' + query + ' }'))
                            .send(JSON.parse('{ ' + body + ' }'))
                            .set(JSON.parse('{ ' + header + ' }'))
                            .set('accept', 'json')
                    /* .set('Authorization', `Bearer ${chiave.body}`) */;
                    } catch (error) {
                        console.log(error);
                        throw new Error("Errore:" + error);
                    }
                    break;
                case 'delete':
                    try {
                        ritorno = await superagent
                            .delete(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                            .query(JSON.parse('{ ' + query + ' }'))
                            .send(JSON.parse('{ ' + body + ' }'))
                            .set(JSON.parse('{ ' + header + ' }'))
                            .set('accept', 'json')
                    /* .set('Authorization', `Bearer ${chiave.body}`) */;
                    } catch (error) {
                        console.log(error);
                        throw new Error("Errore:" + error);
                    }
                    break;
                default:
                    return '';
                    break;
            }

            if (ritorno) {
                return ritorno.body;
            } else {
                return '';
            };
            /*  */
        } catch (error) {
            throw new Error("Errore :" + error);
        }
    }
    CercaParametroSeNoAggiungi(nome: string, parameterIndex: number, tipoParametro: TipoParametro, posizione: TypePosizione) {
        const tmp = new TerminaleParametro(nome, tipoParametro, posizione, parameterIndex);
        this.listaParametri.push(tmp);//.lista.push({ propertyKey: propertyKey, Metodo: target });
        return tmp;
    }
    async Esegui(req: Request): Promise<IReturn> {
        try {
            console.log('Risposta a chiamata : ' + this.percorsi.pathGlobal);
            const parametri = this.listaParametri.EstraiParametriDaRequest(req);
            let valido: IRitornoValidatore | undefined = { approvato: true, stato: 200, messaggio: '' };
            if (this.Validatore) valido = this.Validatore(parametri, this.listaParametri);
            else valido = undefined;
            if ((valido && valido.approvato) || (!valido && parametri.errori.length == 0)) {
                let tmp: IReturn = {
                    body: {}, nonTrovati: parametri.nontrovato,
                    inErrore: parametri.errori, stato: 200
                };
                try {
                    let parametriTmp = parametri.valoriParametri;
                    if (this.onPrimaDiEseguireMetodo) parametriTmp = this.onPrimaDiEseguireMetodo(parametri,
                        this.listaParametri);
                    const tmpReturn = this.metodoAvviabile.apply(this, parametriTmp);
                    if ('body' in tmpReturn) tmp.body = tmpReturn.body;
                    else tmp.body = tmpReturn;
                    if ('stato' in tmpReturn) tmp.stato = tmpReturn.stato;

                } catch (error) {
                    console.log("Errore : \n" + error);
                    tmp = {
                        body: { "Errore Interno filtrato ": 'internal error!!!!' },
                        stato: 500,
                        nonTrovati: parametri.nontrovato
                    };
                }
                return tmp;
            }
            else {
                let tmp: IReturn = {
                    body: parametri.errori,
                    nonTrovati: parametri.nontrovato,
                    inErrore: parametri.errori,
                    stato: 500
                };
                if (valido) {
                    tmp = {
                        body: valido.messaggio,
                        stato: 500,
                    }
                } else {
                    tmp = {
                        body: parametri.errori,
                        nonTrovati: parametri.nontrovato,
                        inErrore: parametri.errori,
                        stato: 500
                    };
                }
                return tmp;
            }
        } catch (error) {
            console.log("Errore : ", error);
            return {
                body: { "Errore Interno filtrato ": 'internal error!!!!' },
                stato: 500
            };
        }
    }

    ConvertiInMiddleare() {
        return async (req: Request, res: Response, nex: NextFunction) => {
            try {
                const tmp = await this.Esegui(req);
                if (tmp.stato >= 300) {
                    throw new Error("Errore : " + tmp.body);
                }
                else {
                    nex();
                    return nex;
                }
            } catch (error) {
                res.status(555).send("Errore : " + error);
            }
        };
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
        console.log(this.percorsi.pathGlobal);


    }
    PrintStamp() {
        let parametri = "";
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        const tmp = this.nome + ' | ' + this.percorsi.pathGlobal + '/' + this.path + '  |  ' + parametri;
        //console.log(tmp);
        return tmp;
    }
    GeneraHTML() {
        let listaNomi = `
            <table>
                <tr>
                    <th>nome</th>
                    <th>posizione</th>
                    <th>sommario</th>
                    <th>descrizione</th>
                    <th>indexParameter</th>
                    <th>tipo</th>
                    <th>#INPUT#</th>
                </tr>`;
        let tt = `</table>`

        let param = ``;
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            let inputhtml = '';
            let bodyStart = '';
            switch (element.tipoParametro) {
                case 'text':
                    inputhtml = '<input type="text" name="" id="">';
                    break;
                case 'date':
                    inputhtml = '<input type="date" name="" id="">';
                    break;
                case 'number':
                    inputhtml = '<input type="number" name="" id="">';
                    break;
            }
            param = param + `
                <tr>
                    <td>${element.nomeParametro}</td>
                    <td>${element.posizione}</td>
                    <td>${element.sommario}</td>
                    <td>${element.descrizione}</td>
                    <td>${element.indexParameter}</td>
                    <td>${element.tipoParametro}</td>
                    <td>${inputhtml}</td>
                </tr>`
                ;
            bodyStart = `<script type="text/javascript">
            function UserAction() {
                var passw = document.getElementById("password").value;
                if (passw.length >= 8) {
    
                    var x = document.URL;
                    var vettore = x.split('/');
                    var body = vettore[vettore.length - 1];
                    var gg = body.split('?', 2);
                    gg = gg[1].substring(3);
                    var xhttp = new XMLHttpRequest();
                    let url
                    if (process.env.NODE_ENV == "test") {
                        url = new URL('https://ss-test.medicaltech.it/api/medico/reimposta-password-medico');
                    }
                    else if (process.env.NODE_ENV == "production") {
                        url = new URL('https://staisicuro.medicaltech.it/api/medico/reimposta-password-medico');
                    }
                    let json = JSON.stringify({
                        password: passw,
                        token: gg
                    });
    
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            alert('Richiesta accettata. 4\n' + this.responseText);
                            window.close();
                        }
                        if (this.readyState == 4 && this.status == 500) {
                            alert("Richiesta respinta. 4\n" + this.responseText);
                        }
                        if (this.readyState == 4 && this.status == 502) {
                            alert("Richiesta potrebbe essere accettata ma c'è stato un errore nel proxy.");
                            window.close();
                        }
                    };
    
                    xhttp.open("POST", url, true);
                    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
                    xhttp.send(json);
                    //window.close();   
                }
                else {
                    alert("Attenzione almeno 8 caratteri");
                }
            }
        </script>`;
        }
        param = param + tt;
        listaNomi = listaNomi + '\n' + param;
        return listaNomi;
    }
    SettaSwagger(tipoInterazione: 'rotta' | 'middleware') {

        if (tipoInterazione == 'middleware') {
            //questo deve restituire un oggetto
            let tmp: any[] = [];
            let primo: boolean = false;
            let ritorno = '';
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    /* tmp.push(tt); */
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
                /* tmp.push(tt); */
                if (index == 0)
                    if (primo == false) ritorno = tt;
                    else ritorno = ritorno + ',' + tt;
                else ritorno = ritorno + ',' + tt;
                if (primo == false) primo = true;
            }
            ritorno = ritorno;
            try {
                JSON.parse(ritorno)
            } catch (error) {
                console.log(error);
            }
            if (primo) return undefined;
            else return ritorno;
        }
        else {
            let primo: boolean = false;
            let ritornoTesta = `"${this.percorsi.pathGlobal}" : { 
                "${this.tipo}" : 
                {
                    "tags": [
                    ],
                    "summary": "${this.sommario}",
                    "description": "${this.descrizione}",
                    "parameters": [ `;
            let ritornoCoda = `
                ]
            }
        }
`;
            let ritorno = '';
            let tmp2: any[] = [];
            const gg = this.percorsi.pathGlobal;

            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    /* tmp2.push(tt); */
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
                /* tmp2.push(tt); */
                if (index == 0)
                    if (primo == false) ritorno = tt;
                    else ritorno = ritorno + ',' + tt;
                else ritorno = ritorno + ',' + tt;
                if (primo == false) primo = true;
            }
            ritorno = ritornoTesta + ritorno + ritornoCoda;
            try {
                JSON.parse('{' + ritorno + '}')
            } catch (error) {
                console.log(error);
            }
            let tmp = {
                gg: {
                    "summary": this.sommario,
                    "description": this.descrizione,
                    "parameters": tmp2
                }
            };

            let tmp3 = `${gg}: {
                "summary": ${this.sommario},
                "description": ${this.descrizione},
                "parameters": [${tmp2}]
            }`;
            /* if (primo) return undefined;
            else return ritorno; */

            return ritorno;
        }
    }

    SettaHTML(tipoInterazione: 'rotta' | 'middleware') {

        if (tipoInterazione == 'middleware') {
            //questo deve restituire un oggetto
            let tmp: any[] = [];
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];

            }
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];

            }
        }
        else {
            let primo: boolean = false;
            let ritornoTesta = `"${this.percorsi.pathGlobal}" : { 
                "${this.tipo}" : 
                {
                    "tags": [
                    ],
                    "summary": "${this.sommario}",
                    "description": "${this.descrizione}",
                    "parameters": [ `;
            let ritornoCoda = `
                ]
            }
        }
`;
            let ritorno = '';
            let tmp2: any[] = [];
            const gg = this.percorsi.pathGlobal;

            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    /* tmp2.push(tt); */
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
                /* tmp2.push(tt); */
                if (index == 0)
                    if (primo == false) ritorno = tt;
                    else ritorno = ritorno + ',' + tt;
                else ritorno = ritorno + ',' + tt;
                if (primo == false) primo = true;
            }
            ritorno = ritornoTesta + ritorno + ritornoCoda;
            try {
                JSON.parse('{' + ritorno + '}')
            } catch (error) {
                console.log(error);
            }
            let tmp = {
                gg: {
                    "summary": this.sommario,
                    "description": this.descrizione,
                    "parameters": tmp2
                }
            };

            let tmp3 = `${gg}: {
                "summary": ${this.sommario},
                "description": ${this.descrizione},
                "parameters": [${tmp2}]
            }`;
            /* if (primo) return undefined;
            else return ritorno; */

            return ritorno;
        }
    }
}


export type TypeMetod = "get" | "put" | "post" | "patch" | "purge" | "delete";
export interface IRitornoValidatore {
    approvato: boolean,
    stato: number,
    messaggio: string,
    terminale?: IParametro
}
/**
 * 
 */
export interface IMetodo {
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
     *! momentaneamente non testata
     */
    nomiClasseRiferimento?: string[],

    onChiamataCompletata?: (logOn: string, result: any, logIn: string) => void

    Validatore?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => IRitornoValidatore;
}
/**
 * Decoratore di metodo,
 * @param parametri 
 * @returns 
 */
function decoratoreMetodo(parametri: IMetodo): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        /* inizio a lavorare sul metodo */
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;//la prendo come riferimento 
            if (parametri.nomiClasseRiferimento != undefined)
                metodo.nomiClassiDiRiferimento = parametri.nomiClasseRiferimento;

            if (parametri.tipo != undefined) metodo.tipo = parametri.tipo;
            else if (parametri.tipo == undefined && metodo.listaParametri.length == 0) metodo.tipo = 'get';
            else if (parametri.tipo == undefined && metodo.listaParametri.length > 0) metodo.tipo = 'post';
            //else if (parametri.tipo == undefined && metodo.listaParametri.length < 0) metodo.tipo = 'post';
            else metodo.tipo = 'get';
            
            if (parametri.descrizione != undefined) metodo.descrizione = parametri.descrizione;
            else metodo.descrizione = '';

            if (parametri.sommario != undefined) metodo.sommario = parametri.sommario;
            else metodo.sommario = '';

            if (parametri.interazione != undefined) metodo.tipoInterazione = parametri.interazione;
            else metodo.tipoInterazione = 'rotta';

            if (parametri.path == undefined) metodo.path = propertyKey.toString();
            else metodo.path = parametri.path;

            if (parametri.onChiamataCompletata != null) metodo.onChiamataCompletata = parametri.onChiamataCompletata;

            if (parametri.Validatore != null) metodo.Validatore = parametri.Validatore;

            /* configuro i middleware */
            if (parametri.interazione == 'middleware' || parametri.interazione == 'ambo') {

                const listaMidd = GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(propertyKey.toString());
                midd.metodoAvviabile = descriptor.value;
                midd.listaParametri = metodo.listaParametri;
                SalvaListaMiddlewareMetaData(listaMidd);
            }
            if (parametri.nomiClasseRiferimento != undefined && parametri.nomiClasseRiferimento.length > 0) {
                for (let index = 0; index < parametri.nomiClasseRiferimento.length; index++) {
                    const element = parametri.nomiClasseRiferimento[index];
                    const classeTmp = list.CercaConNomeSeNoAggiungi(element);
                    const metodoTmp = classeTmp.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
                    for (let index = 0; index < metodo.listaParametri.length; index++) {
                        const element = metodo.listaParametri[index];
                        /* configuro i parametri */
                        const paramestro = metodoTmp.CercaParametroSeNoAggiungi(element.nomeParametro, element.indexParameter,
                            element.tipoParametro, element.posizione);
                        if (parametri.descrizione != undefined) paramestro.descrizione = element.descrizione;
                        else paramestro.descrizione = '';

                        if (parametri.sommario != undefined) paramestro.sommario = element.sommario;
                        else paramestro.sommario = '';
                        /* configuro il metodo */
                        metodoTmp.metodoAvviabile = descriptor.value;

                        if (parametri.tipo != undefined) metodoTmp.tipo = parametri.tipo;
                        else metodoTmp.tipo = 'get';

                        if (parametri.descrizione != undefined) metodoTmp.descrizione = parametri.descrizione;
                        else metodoTmp.descrizione = '';

                        if (parametri.sommario != undefined) metodoTmp.sommario = parametri.sommario;
                        else metodoTmp.sommario = '';

                        if (parametri.interazione != undefined) metodoTmp.tipoInterazione = parametri.interazione;
                        else metodoTmp.tipoInterazione = 'rotta';

                        if (parametri.path == undefined) metodoTmp.path = propertyKey.toString();
                        else metodoTmp.path = parametri.path;
                    }
                }
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
        if (metodo != undefined && list != undefined && classe != undefined && metodo.nomiClassiDiRiferimento.length > 0) {
            for (let index = 0; index < metodo.nomiClassiDiRiferimento.length; index++) {
                const element = metodo.nomiClassiDiRiferimento[index];
                const classe2 = list.CercaConNomeSeNoAggiungi(element);
                const metodo2 = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
                if (metodo2 != undefined && list != undefined && classe2 != undefined) {
                    metodo2.cors = cors;
                }
                else {
                    console.log("Errore mio!");
                }
            }
        }
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.cors = cors;
        }
        else {
            console.log("Errore mio!");
        }
        SalvaListaClasseMetaData(list);
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
        if (metodo != undefined && list != undefined && classe != undefined && metodo.nomiClassiDiRiferimento.length > 0) {
            for (let index = 0; index < metodo.nomiClassiDiRiferimento.length; index++) {
                const element = metodo.nomiClassiDiRiferimento[index];
                const classe2 = list.CercaConNomeSeNoAggiungi(element);
                const metodo2 = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
                if (metodo2 != undefined && list != undefined && classe2 != undefined) {
                    metodo.helmet = helmet;
                }
                else {
                    console.log("Errore mio!");
                }
            }
        }
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.helmet = helmet;
        }
        else {
            console.log("Errore mio!");
        }
        SalvaListaClasseMetaData(list);
    }
}
export function mpAddMiddle(item: any): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
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


export { decoratoreMetodo as mpMet };
