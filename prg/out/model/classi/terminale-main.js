"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Main = exports.mpMain = void 0;
const tools_1 = require("../tools");
const prompts_1 = __importDefault(require("prompts"));
const express_1 = __importDefault(require("express"));
const lista_terminale_classe_1 = require("../liste/lista-terminale-classe");
const bodyParser = __importStar(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const terminale_classe_1 = require("./terminale-classe");
//const swaggerUI = require('swagger-ui-express');
const fs_1 = __importDefault(require("fs"));
/**
 *
 */
function mpMain(path) {
    return function (ctr) {
        //tmp.PrintMenu();
        ctr.prototype.serverExpressDecorato = express_1.default();
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
    };
}
exports.mpMain = mpMain;
class Main {
    constructor(path, server) {
        this.path = path;
        this.percorsi = { pathGlobal: "", patheader: "", porta: 0 };
        if (server == undefined)
            this.serverExpressDecorato = express_1.default();
        else
            this.serverExpressDecorato = server;
        this.listaTerminaleClassi = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
    }
    Inizializza(patheader, porta, rottaBase, creaFile) {
        let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
        this.percorsi.patheader = patheader;
        this.percorsi.porta = porta;
        const pathGlobal = /* this.percorsi.patheader + this.percorsi.porta + */ '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
        this.serverExpressDecorato.use(bodyParser.urlencoded({ 'extended': true })); // parse application/x-www-form-urlencoded
        this.serverExpressDecorato.use(bodyParser.json()); // parse application/json
        this.serverExpressDecorato.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        this.serverExpressDecorato.route;
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
        /* if (rottaBase)
            this.serverExpressDecorato.all('/*', (req: Request, res: Response) => {
                console.log('Risposta a chiamata : ' + '/*');
                InizializzaLogbaseIn(req, 'IN_GENERICA');
                res.status(555).send('No found');
                InizializzaLogbaseOut(res, 'OUT_GENERICA');
                return res;
            }); */
        terminale_classe_1.SalvaListaClasseMetaData(tmp);
        if (creaFile == true) {
            console.log("ciao");
            const dir = './mpExpress';
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir);
            }
            tmp.forEach(element => {
                element;
                fs_1.default.writeFileSync(dir + '/' + element.nome, 'Hey there!');
            });
        }
    }
    GetJSONSwagger() {
        const swaggerJson = ``;
        let tmp2 = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
        let ritorno = '';
        let rr = {};
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
            const element = tmp2[index];
            const tt = element.SettaSwagger();
            /* rr = { rr, th }; */
            if (index == 0)
                ritorno = tt;
            else
                ritorno = ritorno + ',' + tt;
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
        ` + ritorno +
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
            "tags": [],
            paths: {}
        };
        try {
            const hhh = tmp.toString();
            console.log(hhh);
            JSON.parse(tmp);
        }
        catch (error) {
            console.log(error);
        }
        return tmp;
    }
    AggiungiSwagger(path) {
        const swaggerDocument = this.GetJSONSwagger();
        this.serverExpressDecorato.use('/' + path, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(JSON.parse(swaggerDocument)));
    }
    PrintMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
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
            const scelta = yield prompts_1.default({ message: 'Menu main, digita il numero della la tua scelta: ', type: 'number', name: 'scelta' });
            switch (scelte[scelta.scelta - 1]) {
                case scelte[0]:
                    yield tmp.PrintMenu();
                    break;
                case scelte[1]:
                    yield tmp.PrintListaClassi();
                    break;
                case scelte[2]:
                    yield tmp.PrintMenuClassi();
                    break;
                default:
                    break;
            }
            if (scelta.scelta == 0) {
                console.log("Saluti.");
            }
            else {
                this.PrintMenu();
            }
        });
    }
    ;
    StartExpress() {
        var httpServer = http.createServer(this.serverExpressDecorato);
        httpServer.listen(this.percorsi.porta);
        //this.serverExpressDecorato.listen(this.percorsi.porta);
    }
}
exports.Main = Main;
const http = __importStar(require("http"));
//# sourceMappingURL=terminale-main.js.map