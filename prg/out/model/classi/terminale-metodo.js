"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPDecMet = exports.MPDecMetodo = exports.MPDecoratoreMetodo = exports.MPMetodo = exports.MPM = exports.MPMetRev = exports.mpDecMet = exports.mpDecMetodo = exports.mpDecoratoreMetodo = exports.mpMetodo = exports.mpM = exports.mpMet = exports.mpMetRev = exports.mpAddMiddle = exports.mpAddHelmet = exports.mpAddCors = exports.TerminaleMetodo = void 0;
const tools_1 = require("../tools");
const terminale_classe_1 = require("./terminale-classe");
const terminale_parametro_1 = require("./terminale-parametro");
const helmet_1 = __importDefault(require("helmet"));
const superagent_1 = __importDefault(require("superagent"));
const lista_terminale_metodo_1 = require("../liste/lista-terminale-metodo");
const lista_terminale_parametro_1 = require("../liste/lista-terminale-parametro");
const cors_1 = __importDefault(require("cors"));
class TerminaleMetodo {
    constructor(nome, path, classePath) {
        this.classePath = '';
        this.middleware = [];
        this.nomiClassiDiRiferimento = [];
        this.listaParametri = new lista_terminale_parametro_1.ListaTerminaleParametro();
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
    ConfiguraRottaApplicazione(app, percorsi) {
        this.percorsi.patheader = percorsi.patheader;
        this.percorsi.porta = percorsi.porta;
        const pathGlobal = percorsi.pathGlobal + '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
        const middlew = [];
        this.middleware.forEach(element => {
            if (element instanceof TerminaleMetodo) {
                const listaMidd = lista_terminale_metodo_1.GetListaMiddlewareMetaData();
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
                    this.metodoAvviabile.body;
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
                    };
                    if (this.cors == undefined) {
                        this.cors = cors_1.default(corsOptions);
                    }
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    app.get(this.percorsi.pathGlobal /* this.path */, this.cors, this.helmet, middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.ChiamataGenerica(req, res);
                    }));
                    break;
                case 'post':
                    corsOptions = {
                        methods: "POST"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors = cors_1.default(corsOptions);
                    }
                    this.metodoAvviabile.body;
                    app.post(this.percorsi.pathGlobal, this.cors, this.helmet, middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.ChiamataGenerica(req, res);
                    }));
                    break;
                case 'delete':
                    this.metodoAvviabile.body;
                    corsOptions = {
                        methods: "DELETE"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors = cors_1.default(corsOptions);
                    }
                    app.delete(this.percorsi.pathGlobal, this.cors, this.helmet, middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.ChiamataGenerica(req, res);
                    }));
                    break;
                case 'patch':
                    corsOptions = {
                        methods: "PATCH"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors = cors_1.default(corsOptions);
                    }
                    this.metodoAvviabile.body;
                    app.patch(this.percorsi.pathGlobal, this.cors, this.helmet, middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.ChiamataGenerica(req, res);
                    }));
                    break;
                case 'purge':
                    corsOptions = {
                        methods: "PURGE"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors = cors_1.default(corsOptions);
                    }
                    this.metodoAvviabile.body;
                    app.purge(this.percorsi.pathGlobal, this.cors, this.helmet, middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.ChiamataGenerica(req, res);
                    }));
                    break;
                case 'put':
                    corsOptions = {
                        methods: "PUT"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                        if (this.cors == undefined) {
                            this.cors = cors_1.default(corsOptions);
                        }
                        this.metodoAvviabile.body;
                        app.put(this.percorsi.pathGlobal, this.cors, this.helmet, middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.ChiamataGenerica(req, res);
                        }));
                        break;
                    }
            }
        }
    }
    ChiamataGenerica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Risposta a chiamata : ' + this.percorsi.pathGlobal);
                const logIn = tools_1.InizializzaLogbaseIn(req, this.nome.toString());
                let tmp = yield this.Esegui(req);
                if (this.onParametriNonTrovati)
                    this.onParametriNonTrovati(tmp.nonTrovati);
                if (this.onPrimaDiTerminareLaChiamata)
                    tmp = this.onPrimaDiTerminareLaChiamata(tmp);
                res.status(tmp.stato).send(tmp.body);
                const logOit = tools_1.InizializzaLogbaseOut(res, this.nome.toString());
                if (this.onChiamataCompletata) {
                    this.onChiamataCompletata(logIn, tmp, logOit);
                }
                return res;
            }
            catch (error) {
                if (this.onChiamataCompletata) {
                    this.onChiamataCompletata('', { stato: 500, body: error }, '');
                }
                res.status(500).send(error);
                return res;
            }
        });
    }
    ChiamaLaRotta(headerpath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let body = "";
                let query = "";
                let header = "";
                for (let index = 0; index < this.middleware.length; index++) {
                    const element = this.middleware[index];
                    if (element instanceof TerminaleMetodo) {
                        const listaMidd = lista_terminale_metodo_1.GetListaMiddlewareMetaData();
                        const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                        const rit = yield midd.listaParametri.SoddisfaParamtri();
                        if (rit.body != "") {
                            if (body != "") {
                                body = body + ", " + rit.body;
                            }
                            else {
                                body = rit.body;
                            }
                        }
                        if (rit.query != "") {
                            if (query != "") {
                                query = query + ", " + rit.query;
                            }
                            else
                                query = rit.query;
                        }
                        if (rit.header != "") {
                            if (header != "") {
                                header = header + ", " + rit.header;
                            }
                            else
                                header = rit.header;
                        }
                    }
                }
                if (headerpath == undefined)
                    headerpath = "http://localhost:3000";
                console.log('chiamata per : ' + this.percorsi.pathGlobal + ' | Verbo: ' + this.tipo);
                let parametri = yield this.listaParametri.SoddisfaParamtri();
                if (parametri.body != "") {
                    if (body != "") {
                        body = body + ", " + parametri.body;
                    }
                    else {
                        body = parametri.body;
                    }
                }
                if (parametri.query != "") {
                    if (query != "") {
                        query = query + ", " + parametri.query;
                    }
                    else
                        query = parametri.query;
                }
                if (parametri.header != "") {
                    if (header != "") {
                        header = header + ", " + parametri.header;
                    }
                    else
                        header = parametri.header;
                }
                let ritorno;
                let gg = this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal;
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
                            ritorno = yield superagent_1.default
                                .get(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json');
                        }
                        catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    case 'post':
                        try {
                            ritorno = yield superagent_1.default
                                .post(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json');
                        }
                        catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    case 'purge':
                        try {
                            ritorno = yield superagent_1.default
                                .purge(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json');
                        }
                        catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    case 'patch':
                        try {
                            ritorno = yield superagent_1.default
                                .patch(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json');
                        }
                        catch (error) {
                            console.log(error);
                            throw new Error("Errore:" + error);
                        }
                        break;
                    case 'delete':
                        try {
                            ritorno = yield superagent_1.default
                                .delete(this.percorsi.patheader + this.percorsi.porta + this.percorsi.pathGlobal)
                                .query(JSON.parse('{ ' + query + ' }'))
                                .send(JSON.parse('{ ' + body + ' }'))
                                .set(JSON.parse('{ ' + header + ' }'))
                                .set('accept', 'json');
                        }
                        catch (error) {
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
                }
                else {
                    return '';
                }
                ;
                /*  */
            }
            catch (error) {
                throw new Error("Errore :" + error);
            }
        });
    }
    CercaParametroSeNoAggiungi(nome, parameterIndex, tipoParametro, posizione) {
        const tmp = new terminale_parametro_1.TerminaleParametro(nome, tipoParametro, posizione, parameterIndex);
        this.listaParametri.push(tmp); //.lista.push({ propertyKey: propertyKey, Metodo: target });
        return tmp;
    }
    Esegui(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Risposta a chiamata : ' + this.percorsi.pathGlobal);
                const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                let valido = { approvato: true, stato: 200, messaggio: '' };
                if (this.Validatore)
                    valido = this.Validatore(parametri, this.listaParametri);
                else
                    valido = undefined;
                if ((valido && valido.approvato) || (!valido && parametri.errori.length == 0)) {
                    let tmp = {
                        body: {}, nonTrovati: parametri.nontrovato,
                        inErrore: parametri.errori, stato: 200
                    };
                    try {
                        let parametriTmp = parametri.valoriParametri;
                        if (this.onPrimaDiEseguireMetodo)
                            parametriTmp = this.onPrimaDiEseguireMetodo(parametri, this.listaParametri);
                        const tmpReturn = this.metodoAvviabile.apply(this, parametriTmp);
                        if ('body' in tmpReturn)
                            tmp.body = tmpReturn.body;
                        else
                            tmp.body = tmpReturn;
                        if ('stato' in tmpReturn)
                            tmp.stato = tmpReturn.stato;
                    }
                    catch (error) {
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
                    let tmp = {
                        body: parametri.errori,
                        nonTrovati: parametri.nontrovato,
                        inErrore: parametri.errori,
                        stato: 500
                    };
                    if (valido) {
                        tmp = {
                            body: valido.messaggio,
                            stato: 500,
                        };
                    }
                    else {
                        tmp = {
                            body: parametri.errori,
                            nonTrovati: parametri.nontrovato,
                            inErrore: parametri.errori,
                            stato: 500
                        };
                    }
                    return tmp;
                }
            }
            catch (error) {
                console.log("Errore : ", error);
                return {
                    body: { "Errore Interno filtrato ": 'internal error!!!!' },
                    stato: 500
                };
            }
        });
    }
    ConvertiInMiddleare() {
        return (req, res, nex) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tmp = yield this.Esegui(req);
                if (tmp.stato >= 300) {
                    throw new Error("Errore : " + tmp.body);
                }
                else {
                    nex();
                    return nex;
                }
            }
            catch (error) {
                res.status(555).send("Errore : " + error);
            }
        });
    }
    PrintMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                element.PrintMenu();
            }
        });
    }
    PrintCredenziali(pathRoot) {
        const tab = '\t\t\t';
        let parametri = "";
        console.log(tab + 'TerminaleMetodo' + '->' + 'PrintCredenziali');
        console.log(tab + this.nome + ' | ' + this.path + ' ;');
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        if (pathRoot != undefined)
            console.log(tab + this.nome + ' | ' + '/' + pathRoot + '/' + this.path + '  |  ' + parametri);
        else
            console.log(tab + this.nome + ' | ' + "/" + this.path + '  |  ' + parametri);
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
        let tt = `</table>`;
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
                </tr>`;
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
    SettaSwagger(tipoInterazione) {
        if (tipoInterazione == 'middleware') {
            //questo deve restituire un oggetto
            let tmp = [];
            let primo = false;
            let ritorno = '';
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    /* tmp.push(tt); */
                    if (primo == false && tt != undefined) {
                        primo = true;
                        ritorno = tt + '';
                    }
                    else if (tt != undefined) {
                        ritorno = ritorno + ',' + tt;
                    }
                }
            }
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                const tt = element.SettaSwagger();
                /* tmp.push(tt); */
                if (index == 0)
                    if (primo == false)
                        ritorno = tt;
                    else
                        ritorno = ritorno + ',' + tt;
                else
                    ritorno = ritorno + ',' + tt;
                if (primo == false)
                    primo = true;
            }
            ritorno = ritorno;
            try {
                JSON.parse(ritorno);
            }
            catch (error) {
                console.log(error);
            }
            if (primo)
                return undefined;
            else
                return ritorno;
        }
        else {
            let primo = false;
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
            let tmp2 = [];
            const gg = this.percorsi.pathGlobal;
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    /* tmp2.push(tt); */
                    if (primo == false && tt != undefined) {
                        primo = true;
                        ritorno = tt + '';
                    }
                    else if (tt != undefined) {
                        ritorno = ritorno + ',' + tt;
                    }
                }
            }
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                const tt = element.SettaSwagger();
                /* tmp2.push(tt); */
                if (index == 0)
                    if (primo == false)
                        ritorno = tt;
                    else
                        ritorno = ritorno + ',' + tt;
                else
                    ritorno = ritorno + ',' + tt;
                if (primo == false)
                    primo = true;
            }
            ritorno = ritornoTesta + ritorno + ritornoCoda;
            try {
                JSON.parse('{' + ritorno + '}');
            }
            catch (error) {
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
    SettaHTML(tipoInterazione) {
        if (tipoInterazione == 'middleware') {
            //questo deve restituire un oggetto
            let tmp = [];
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
            }
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
            }
        }
        else {
            let primo = false;
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
            let tmp2 = [];
            const gg = this.percorsi.pathGlobal;
            for (let index = 0; index < this.middleware.length; index++) {
                const element = this.middleware[index];
                if (element instanceof TerminaleMetodo) {
                    const tt = element.SettaSwagger('middleware');
                    /* tmp2.push(tt); */
                    if (primo == false && tt != undefined) {
                        primo = true;
                        ritorno = tt + '';
                    }
                    else if (tt != undefined) {
                        ritorno = ritorno + ',' + tt;
                    }
                }
            }
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                const tt = element.SettaSwagger();
                /* tmp2.push(tt); */
                if (index == 0)
                    if (primo == false)
                        ritorno = tt;
                    else
                        ritorno = ritorno + ',' + tt;
                else
                    ritorno = ritorno + ',' + tt;
                if (primo == false)
                    primo = true;
            }
            ritorno = ritornoTesta + ritorno + ritornoCoda;
            try {
                JSON.parse('{' + ritorno + '}');
            }
            catch (error) {
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
exports.TerminaleMetodo = TerminaleMetodo;
TerminaleMetodo.nomeMetadataKeyTarget = "MetodoTerminaleTarget";
/**
 * Decoratore di metodo,
 * @param parametri
 * @returns
 */
function decoratoreMetodo(parametri) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        /* inizio a lavorare sul metodo */
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value; //la prendo come riferimento 
            if (parametri.nomiClasseRiferimento != undefined)
                metodo.nomiClassiDiRiferimento = parametri.nomiClasseRiferimento;
            if (parametri.tipo != undefined)
                metodo.tipo = parametri.tipo;
            else
                metodo.tipo = 'get';
            if (parametri.descrizione != undefined)
                metodo.descrizione = parametri.descrizione;
            else
                metodo.descrizione = '';
            if (parametri.sommario != undefined)
                metodo.sommario = parametri.sommario;
            else
                metodo.sommario = '';
            if (parametri.interazione != undefined)
                metodo.tipoInterazione = parametri.interazione;
            else
                metodo.tipoInterazione = 'rotta';
            if (parametri.path == undefined)
                metodo.path = propertyKey.toString();
            else
                metodo.path = parametri.path;
            if (parametri.onChiamataCompletata != null)
                metodo.onChiamataCompletata = parametri.onChiamataCompletata;
            if (parametri.Validatore != null)
                metodo.Validatore = parametri.Validatore;
            /* configuro i middleware */
            if (parametri.interazione == 'middleware' || parametri.interazione == 'ambo') {
                const listaMidd = lista_terminale_metodo_1.GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(propertyKey.toString());
                midd.metodoAvviabile = descriptor.value;
                midd.listaParametri = metodo.listaParametri;
                lista_terminale_metodo_1.SalvaListaMiddlewareMetaData(listaMidd);
            }
            if (parametri.nomiClasseRiferimento != undefined && parametri.nomiClasseRiferimento.length > 0) {
                for (let index = 0; index < parametri.nomiClasseRiferimento.length; index++) {
                    const element = parametri.nomiClasseRiferimento[index];
                    const classeTmp = list.CercaConNomeSeNoAggiungi(element);
                    const metodoTmp = classeTmp.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
                    for (let index = 0; index < metodo.listaParametri.length; index++) {
                        const element = metodo.listaParametri[index];
                        /* configuro i parametri */
                        const paramestro = metodoTmp.CercaParametroSeNoAggiungi(element.nomeParametro, element.indexParameter, element.tipoParametro, element.posizione);
                        if (parametri.descrizione != undefined)
                            paramestro.descrizione = element.descrizione;
                        else
                            paramestro.descrizione = '';
                        if (parametri.sommario != undefined)
                            paramestro.sommario = element.sommario;
                        else
                            paramestro.sommario = '';
                        /* configuro il metodo */
                        metodoTmp.metodoAvviabile = descriptor.value;
                        if (parametri.tipo != undefined)
                            metodoTmp.tipo = parametri.tipo;
                        else
                            metodoTmp.tipo = 'get';
                        if (parametri.descrizione != undefined)
                            metodoTmp.descrizione = parametri.descrizione;
                        else
                            metodoTmp.descrizione = '';
                        if (parametri.sommario != undefined)
                            metodoTmp.sommario = parametri.sommario;
                        else
                            metodoTmp.sommario = '';
                        if (parametri.interazione != undefined)
                            metodoTmp.tipoInterazione = parametri.interazione;
                        else
                            metodoTmp.tipoInterazione = 'rotta';
                        if (parametri.path == undefined)
                            metodoTmp.path = propertyKey.toString();
                        else
                            metodoTmp.path = parametri.path;
                    }
                }
            }
            terminale_classe_1.SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    };
}
exports.mpMetRev = decoratoreMetodo;
exports.mpMet = decoratoreMetodo;
exports.mpM = decoratoreMetodo;
exports.mpMetodo = decoratoreMetodo;
exports.mpDecoratoreMetodo = decoratoreMetodo;
exports.mpDecMetodo = decoratoreMetodo;
exports.mpDecMet = decoratoreMetodo;
exports.MPMetRev = decoratoreMetodo;
exports.MPM = decoratoreMetodo;
exports.MPMetodo = decoratoreMetodo;
exports.MPDecoratoreMetodo = decoratoreMetodo;
exports.MPDecMetodo = decoratoreMetodo;
exports.MPDecMet = decoratoreMetodo;
function mpAddCors(cors) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
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
        terminale_classe_1.SalvaListaClasseMetaData(list);
    };
}
exports.mpAddCors = mpAddCors;
function mpAddHelmet(helmet) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
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
        terminale_classe_1.SalvaListaClasseMetaData(list);
    };
}
exports.mpAddHelmet = mpAddHelmet;
function mpAddMiddle(item) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        let midd = undefined;
        const listaMidd = lista_terminale_metodo_1.GetListaMiddlewareMetaData();
        if (typeof item === 'string' || item instanceof String) {
            midd = listaMidd.CercaConNomeSeNoAggiungi(String(item));
            lista_terminale_metodo_1.SalvaListaMiddlewareMetaData(listaMidd);
        }
        else {
            midd = item;
        }
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.middleware.push(midd);
            terminale_classe_1.SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    };
}
exports.mpAddMiddle = mpAddMiddle;
//# sourceMappingURL=terminale-metodo.js.map