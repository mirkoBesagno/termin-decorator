
import { IPrintabile, IType, targetTerminale } from "../tools";
import { CheckMetodoMetaData, TerminaleMetodo } from "./terminale-metodo";


import superagent from "superagent";
import express from "express";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData } from "./terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";

export class TerminaleParametro {
    nome: string;
    tipo: IType;
    constructor(nome: string, tipo: IType) {
        this.nome = nome;
        this.tipo = tipo;
    }

    PrintMenu() {
        const t = Reflect.getMetadata('info', targetTerminale);
    }
    PrintCredenziali() {
        console.log("nome:" + this.nome + ':;:' + "tipo:" + this.tipo.toString());
    }
    PrintParametro() {
        return "tipo:" + this.tipo.toString() + ";" + "nome:" + this.nome;
    }
}

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
var MPPar: Function, mpPar: Function, mpParametro: Function, mpDecoratoreParametro: Function;
MPPar = mpPar = mpParametro = mpDecoratoreParametro = 
function mpPar(tipoParametro: IType) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {

        const classe = CheckClasseMetaData(target.constructor.name);
        const metodo = CheckMetodoMetaData(propertyKey.toString(), classe);
        CheckParametroMetaData(metodo, parameterIndex.toString(), tipoParametro);
    }
}
export {
    MPPar, mpParametro, mpDecoratoreParametro, mpPar
};

export function mpParRev(tipoParametro: IType) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {        
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        metodo.CercaParametroSeNoAggiungi(parameterIndex.toString(), tipoParametro);
        SalvaListaClasseMetaData(list);
    }
}



export function CheckParametroMetaData(terminale: TerminaleMetodo, parameterIndex: string, tipoParametro: IType) {
    let tmp: ListaTerminaleMetodo = Reflect.getMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni
    if (terminale != undefined && tmp != undefined)/* controllo esista ma s'ho esistere */ {
        //creo un terminale parametro e lo aggiungo
        terminale.listaParametri.push(new TerminaleParametro(parameterIndex.toString(), tipoParametro))//.lista.push({ propertyKey: propertyKey, Metodo: target });                                                
        tmp.AggiungiElemento(terminale);
        Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale); // salvo tutto
    }
    else {
        console.log("Errore mio!");
    }
}
