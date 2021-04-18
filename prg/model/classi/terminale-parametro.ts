
import { IDescrivibile, IPrintabile, targetTerminale, TipoParametro } from "../tools";
import { CheckMetodoMetaData, TerminaleMetodo } from "./terminale-metodo";


import superagent, { post } from "superagent";
import express from "express";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData } from "./terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";

export type TypePosizione = "body" | "query" | 'header';


export class TerminaleParametro implements IDescrivibile {
    nome: string;
    tipo: TipoParametro;
    posizione: TypePosizione;
    indexParameter: number;

    descrizione: string;
    sommario: string;
    constructor(nome: string, tipo: TipoParametro, posizione: TypePosizione, indexParameter: number) {
        this.nome = nome;
        this.tipo = tipo;
        this.posizione = posizione;
        this.indexParameter = indexParameter;

        this.descrizione = "";
        this.sommario = "";
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


function decoratoreParametroGenerico(nomeParametro: string, posizione: TypePosizione, tipoParametro?: TipoParametro, descrizione?: string, sommario?: string) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        if (tipoParametro == undefined) tipoParametro = 'text';
        if (descrizione == undefined) descrizione = '';
        if (sommario == undefined) sommario = '';

        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        const paramestro = metodo.CercaParametroSeNoAggiungi(nomeParametro, parameterIndex, tipoParametro, posizione);
        paramestro.descrizione = descrizione;
        paramestro.sommario = sommario;
        SalvaListaClasseMetaData(list);
    }
}


export { decoratoreParametroGenerico as mpPar };
export { decoratoreParametroGenerico as mpParRev };
export { decoratoreParametroGenerico as mpP };
export { decoratoreParametroGenerico as mpParametro };
export { decoratoreParametroGenerico as mpDecoratoreParametroGenerico };
export { decoratoreParametroGenerico as mpDecParametro };
export { decoratoreParametroGenerico as mpDecPar };


export { decoratoreParametroGenerico as MPParRev };
export { decoratoreParametroGenerico as MPP };
export { decoratoreParametroGenerico as MPParametro };
export { decoratoreParametroGenerico as MPDecoratoreParametroGenerico };
export { decoratoreParametroGenerico as MPDecParametro };
export { decoratoreParametroGenerico as MPDecPar };