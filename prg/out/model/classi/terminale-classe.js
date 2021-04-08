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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckClasseMetaData = exports.mpClass = exports.TerminaleClasse = void 0;
const tools_1 = require("../tools");
const express_1 = require("express");
const lista_terminale_classe_1 = require("../liste/lista-terminale-classe");
const lista_terminale_metodo_1 = require("../liste/lista-terminale-metodo");
class TerminaleClasse {
    constructor(nome, path) {
        this.id = Math.random().toString();
        this.rotte = express_1.Router();
        this.listaMetodi = new lista_terminale_metodo_1.ListaTerminaleMetodo(this.rotte);
        this.nome = nome;
        if (path)
            this.path = path;
        else
            this.path = nome;
        this.pathRoot = "";
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
        });
    }
    PrintCredenziali() {
        const tmp = "nome:" + this.nome + ":;:" +
            "id:" + this.id + ":;:" +
            "listaMetodi.length:" + this.listaMetodi.length + ":;:";
        //console.log(tmp);
    }
    SettaPathRoot(item) {
        this.pathRoot = item;
    }
}
exports.TerminaleClasse = TerminaleClasse;
TerminaleClasse.nomeMetadataKeyTarget = "ClasseTerminaleTarget";
/**
 *
 * @param ctr
 */
function mpClass(percorso) {
    return (ctr) => {
        let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
        const classe = CheckClasseMetaData(ctr.name);
        classe.path = percorso;
        Reflect.defineMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale); //e lo vado a salvare nel meta data
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, tools_1.targetTerminale); //e lo vado a salvare nel meta data
    };
}
exports.mpClass = mpClass;
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
//# sourceMappingURL=terminale-classe.js.map