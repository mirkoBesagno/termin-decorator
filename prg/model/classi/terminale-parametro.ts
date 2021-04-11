
import { IPrintabile, IType, targetTerminale } from "../tools";
import { CheckMetodoMetaData, TerminaleMetodo } from "./terminale-metodo";


import superagent, { post } from "superagent";
import express from "express";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData } from "./terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
export enum EPosizione {
    body, query
}
export class TerminaleParametro {
    nome: string;
    tipo: IType;
    posizione: EPosizione;
    indexParameter: number;
    constructor(nome: string, tipo: IType, posizione: EPosizione, indexParameter: number) {
        this.nome = nome;
        this.tipo = tipo;
        this.posizione = posizione;
        this.indexParameter = indexParameter;
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


export function mpParRev(tipoParametro: IType, nomeParametro: string, posizione:EPosizione) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        metodo.CercaParametroSeNoAggiungi(nomeParametro, tipoParametro, parameterIndex, posizione);
        SalvaListaClasseMetaData(list);
    }
}

