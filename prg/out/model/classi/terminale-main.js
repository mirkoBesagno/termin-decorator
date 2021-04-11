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
        if (server == undefined)
            this.serverExpressDecorato = express_1.default();
        else
            this.serverExpressDecorato = server;
        this.listaTerminaleClassi = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
    }
    Inizializza(patheader) {
        let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
        for (let index = 0; index < tmp.length; index++) {
            const element = tmp[index];
            const pathGlobal = '/' + this.path + '/' + element.path;
            element.SettaPathRoot_e_Global(this.path, pathGlobal, patheader);
            this.serverExpressDecorato.use(bodyParser.json({
                limit: '50mb',
                verify(req, res, buf, encoding) {
                    req.rawBody = buf;
                }
            }));
            this.serverExpressDecorato.use(pathGlobal, element.rotte);
        }
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
        this.serverExpressDecorato.listen(3000);
    }
}
exports.Main = Main;
//# sourceMappingURL=terminale-main.js.map