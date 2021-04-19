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
exports.MPDecClas = exports.MPDecClasse = exports.MPDecoratoreClasse = exports.MPClasse = exports.MPC = exports.MPClas = exports.mpDecClas = exports.mpDecClasse = exports.mpDecoratoreClasse = exports.mpClasse = exports.mpC = exports.mpClas = exports.GetListaClasseMetaData = exports.SalvaListaClasseMetaData = exports.CheckClasseMetaData = exports.TerminaleClasse = void 0;
const tools_1 = require("../tools");
const express_1 = require("express");
const prompts_1 = __importDefault(require("prompts"));
const lista_terminale_classe_1 = require("../liste/lista-terminale-classe");
const lista_terminale_metodo_1 = require("../liste/lista-terminale-metodo");
const terminale_metodo_1 = require("./terminale-metodo");
class TerminaleClasse {
    constructor(nome, path, headerPath) {
        this.id = Math.random().toString();
        this.rotte = express_1.Router();
        this.listaMetodi = new lista_terminale_metodo_1.ListaTerminaleMetodo(this.rotte);
        this.nome = nome;
        if (path)
            this.path = path;
        else
            this.path = nome;
        this.pathRoot = "";
        this.pathGlobal = '';
        if (headerPath == undefined) {
            this.headerPath = "http://localhost:3000";
        }
        else {
            this.headerPath = headerPath;
        }
    }
    /* async PrintMenu() {
            console.log("Scegli un metodo:");
    
            for (let index = 0; index < this.listaMetodi.length; index++) {
                const element = this.listaMetodi[index];
                console.log(index + 1 + ":\n");
                element.PrintCredenziali();
            }
            const risultato = await chiedi({ name: "scelta", message: "Digita la scelta :", type: "number" });
            if (risultato.scelta != 0) {
                this.listaMetodi[risultato.scelta].PrintMenu();
            } else {
    
            }
        } */
    PrintMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const tab = '\t\t';
            console.log(tab + 'TerminaleClasse' + '->' + 'PrintMenu');
            console.log(tab + this.nome + ' | ' + this.id + ' | ' + '/' + this.pathRoot + '/' + this.path + ' ;');
            for (let index = 0; index < this.listaMetodi.length; index++) {
                const element = this.listaMetodi[index];
                element.PrintCredenziali(this.pathRoot + '/' + this.path);
            }
            const scelta = yield prompts_1.default({ message: 'Premi invio per continuare', type: 'number', name: 'scelta' });
        });
    }
    PrintMenuClasse() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Classe :' + this.nome);
            let index = 0;
            for (let index = 0; index < this.listaMetodi.length; index++) {
                const element = this.listaMetodi[index];
                const tmp = index + 1;
                if (element.tipoInterazione == 'rotta' || element.tipoInterazione == 'ambo') {
                    console.log(tmp + ': ' + element.PrintStamp());
                }
            }
            const scelta = yield prompts_1.default({ message: 'Scegli il metodo da eseguire: ', type: 'number', name: 'scelta' });
            if (scelta.scelta == 0) {
                console.log("Saluti dalla classe : " + this.nome);
            }
            else {
                console.log('Richiamo la rotta');
                const risposta = yield this.listaMetodi[scelta.scelta - 1].ChiamaLaRotta();
                if (risposta == undefined) {
                    console.log("Risposta undefined!");
                }
                else {
                    console.log(risposta);
                }
                yield this.PrintMenuClasse();
            }
        });
    }
    PrintCredenziali() {
        const tmp = "nome:" + this.nome + ":;:" +
            "id:" + this.id + ":;:" +
            "listaMetodi.length:" + this.listaMetodi.length + ":;:";
        //console.log(tmp);
    }
    SettaPathRoot_e_Global(item, pathGlobal, patheader) {
        this.pathRoot = item;
        this.pathGlobal = pathGlobal;
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            if (element.tipoInterazione == 'rotta' || element.tipoInterazione == 'ambo') {
                element.ConfiguraRotta(this.rotte, this.pathGlobal);
            }
            //element.listaRotteGeneraChiavi=this.listaMetodiGeneraKey;
        }
    }
    SettaSwagger() {
        const swaggerJson = `
        {
            "tags": [
                {
                    "name": "admin",
                    "description": "Racchiude tutti i percorsi che l'admin può visitare",
                    "externalDocs": {
                        "description": "",
                        "url": "https://staisicuro.medicaltech.it/api/admin/"
                    }
                },
            ],
        }        
        `;
        let ritorno = '"paths": {';
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            element.SettaSwagger();
            if (index == 0 && index + 1 != this.listaMetodi.length) {
                ritorno = ritorno + ', ';
            }
            if (index + 1 == this.listaMetodi.length) {
                ritorno = ritorno + ' }';
            }
        }
        ritorno = ritorno + '}';
        return ritorno;
    }
    CercaMetodoSeNoAggiungiMetodo(nome) {
        let terminale = this.listaMetodi.CercaConNomeRev(nome);
        if (terminale == undefined) /* se non c'è */ {
            terminale = new terminale_metodo_1.TerminaleMetodo(nome, "", this.nome); // creo la funzione
            this.listaMetodi.AggiungiElemento(terminale);
        }
        return terminale;
    }
}
exports.TerminaleClasse = TerminaleClasse;
TerminaleClasse.nomeMetadataKeyTarget = "ClasseTerminaleTarget";
/**
 *
 * @param ctr
 */
function decoratoreClasse(percorso) {
    return (ctr) => {
        let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
        const classe = CheckClasseMetaData(ctr.name);
        classe.path = percorso;
        Reflect.defineMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale); //e lo vado a salvare nel meta data
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, tools_1.targetTerminale); //e lo vado a salvare nel meta data
    };
}
exports.mpClas = decoratoreClasse;
exports.mpC = decoratoreClasse;
exports.mpClasse = decoratoreClasse;
exports.mpDecoratoreClasse = decoratoreClasse;
exports.mpDecClasse = decoratoreClasse;
exports.mpDecClas = decoratoreClasse;
exports.MPClas = decoratoreClasse;
exports.MPC = decoratoreClasse;
exports.MPClasse = decoratoreClasse;
exports.MPDecoratoreClasse = decoratoreClasse;
exports.MPDecClasse = decoratoreClasse;
exports.MPDecClas = decoratoreClasse;
function decoratoreClasseeRev(percorso) {
    return (ctr) => {
        const list = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(ctr.name);
        classe.path = percorso;
        SalvaListaClasseMetaData(list);
    };
}
function CheckClasseMetaData(nome) {
    let listClasse = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale); // vado a prendere la struttura legata alle funzioni ovvero le classi
    if (listClasse == undefined) /* se non c'è la creo*/ {
        listClasse = new lista_terminale_classe_1.ListaTerminaleClasse();
        Reflect.defineMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, listClasse, tools_1.targetTerminale);
    }
    /* poi la cerco */
    let classe = listClasse.CercaConNome(nome);
    if (classe == undefined) {
        classe = new TerminaleClasse(nome); //se il metodo non c'è lo creo
        listClasse.AggiungiElemento(classe);
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, tools_1.targetTerminale); //e lo vado a salvare nel meta data
    }
    return classe;
}
exports.CheckClasseMetaData = CheckClasseMetaData;
function SalvaListaClasseMetaData(tmp) {
    Reflect.defineMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale);
}
exports.SalvaListaClasseMetaData = SalvaListaClasseMetaData;
function GetListaClasseMetaData() {
    let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
    if (tmp == undefined) {
        tmp = new lista_terminale_classe_1.ListaTerminaleClasse();
    }
    return tmp;
}
exports.GetListaClasseMetaData = GetListaClasseMetaData;
//# sourceMappingURL=terminale-classe.js.map