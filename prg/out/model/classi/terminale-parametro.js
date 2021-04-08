"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckParametroMetaData = exports.mpPar = exports.mpDecoratoreParametro = exports.mpParametro = exports.MPPar = exports.TerminaleParametro = void 0;
const tools_1 = require("../tools");
const terminale_metodo_1 = require("./terminale-metodo");
const terminale_classe_1 = require("./terminale-classe");
const lista_terminale_metodo_1 = require("../liste/lista-terminale-metodo");
class TerminaleParametro {
    constructor(nome, tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }
    PrintMenu() {
        const t = Reflect.getMetadata('info', tools_1.targetTerminale);
    }
    PrintCredenziali() {
        console.log("nome:" + this.nome + ':;:' + "tipo:" + this.tipo.toString());
    }
    PrintParametro() {
        return "tipo:" + this.tipo.toString() + ";" + "nome:" + this.nome;
    }
}
exports.TerminaleParametro = TerminaleParametro;
/**
 * Promts:
 * Dovra istanziare il metodo e i parametri
 * dovra aggiungere se non gia presente un classe TerminaleMetodo
 * se gia presente aggiungere e salvare con il prametro aggiunto
 * se non gia presente creare e aggiungere poi salvaere
 * Express:
 * bisogna creare una variabile express, questa conterra per ogni classe una routes e per ogni metodo
 * all'interno di quella classe una rotta
 * Qundo vado ad indicare una classe
 * @param nome
 * @returns
 */
/* export function mpPar(tipoParametro: IType) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {

        const classe = CheckClasseMetaData(target.constructor.name);
        const metodo = CheckMetodoMetaData(propertyKey.toString(), classe);
        CheckParametroMetaData(metodo, parameterIndex.toString(), tipoParametro);
    }
} */
var MPPar, mpPar, mpParametro, mpDecoratoreParametro;
exports.MPPar = MPPar;
exports.mpPar = mpPar;
exports.mpParametro = mpParametro;
exports.mpDecoratoreParametro = mpDecoratoreParametro;
exports.MPPar = MPPar = exports.mpPar = mpPar = exports.mpParametro = mpParametro = exports.mpDecoratoreParametro = mpDecoratoreParametro = function mpPar(tipoParametro) {
    return function (target, propertyKey, parameterIndex) {
        const classe = terminale_classe_1.CheckClasseMetaData(target.constructor.name);
        const metodo = terminale_metodo_1.CheckMetodoMetaData(propertyKey.toString(), classe);
        CheckParametroMetaData(metodo, parameterIndex.toString(), tipoParametro);
    };
};
function CheckParametroMetaData(terminale, parameterIndex, tipoParametro) {
    let tmp = Reflect.getMetadata(lista_terminale_metodo_1.ListaTerminaleMetodo.nomeMetadataKeyTarget, tools_1.targetTerminale); // vado a prendere la struttura legata alle funzioni
    if (terminale != undefined && tmp != undefined) /* controllo esista ma s'ho esistere */ {
        //creo un terminale parametro e lo aggiungo
        terminale.listaParametri.push(new TerminaleParametro(parameterIndex.toString(), tipoParametro)); //.lista.push({ propertyKey: propertyKey, Metodo: target });                                                
        tmp.AggiungiElemento(terminale);
        Reflect.defineMetadata(lista_terminale_metodo_1.ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale); // salvo tutto
    }
    else {
        console.log("Errore mio!");
    }
}
exports.CheckParametroMetaData = CheckParametroMetaData;
//# sourceMappingURL=terminale-parametro.js.map