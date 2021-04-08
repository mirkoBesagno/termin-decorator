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
exports.Main = exports.mpMain = void 0;
const tools_1 = require("../tools");
const prompts_1 = __importDefault(require("prompts"));
const express_1 = __importDefault(require("express"));
const lista_terminale_classe_1 = require("../liste/lista-terminale-classe");
class TerminaleMain {
    constructor() {
        this.listaClassi = new lista_terminale_classe_1.ListaTerminaleClasse();
    }
    Start() {
        let listaClassi = Reflect.getMetadata('info', tools_1.targetTerminale);
        this.listaClassi = listaClassi;
        this.PrintMenu();
    }
    PrintMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Scegli una classe:\n");
            for (let index = 0; index < this.listaClassi.length; index++) {
                const element = this.listaClassi[index];
                console.log(index + ":\n");
                element.PrintCredenziali();
            }
            const risultato = yield prompts_1.default({ name: "scelta", message: "Digita la scelta :", type: "number" });
            if (risultato.scelta != 0) {
                this.listaClassi[risultato.scelta].PrintMenu();
            }
            else {
            }
        });
    }
}
/**
 *
 */
function mpMain(path) {
    return function (ctr) {
        //tmp.PrintMenu();
        ctr.prototype.serverExpressDecorato = express_1.default();
        ctr.prototype.Inizializza = () => {
            let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
            for (let index = 0; index < tmp.length; index++) {
                const element = tmp[index];
                ctr.prototype.serverExpressDecorato.use('/' + path + '/' + element.path, element.rotte);
                element.SettaPathRoot(path);
            }
        };
        ctr.prototype.PrintMenu = () => {
            let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
            console.log("mpMain" + ' -> ' + 'PrintMenu');
            tmp.PrintMenu();
            /* const listaClassi: ListaTerminaleClasse = new ListaTerminaleClasse();
            tmp.PrintMenu(); */
        };
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
    Inizializza() {
        let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
        for (let index = 0; index < tmp.length; index++) {
            const element = tmp[index];
            this.serverExpressDecorato.use('/' + this.path + '/' + element.path, element.rotte);
            element.SettaPathRoot(this.path);
        }
    }
    PrintMenu() {
        let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
        console.log("mpMain" + ' -> ' + 'PrintMenu');
        tmp.PrintMenu();
        /* const listaClassi: ListaTerminaleClasse = new ListaTerminaleClasse();
        tmp.PrintMenu(); */
    }
    ;
}
exports.Main = Main;
//# sourceMappingURL=terminale-main.js.map