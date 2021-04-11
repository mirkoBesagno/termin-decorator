
import { IPrintabile, IType, targetTerminale, TipoParametro } from "../tools";
import { CheckMetodoMetaData, TerminaleMetodo } from "./terminale-metodo";


import superagent, { post } from "superagent";
import express from "express";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData } from "./terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
export enum EPosizione {
    body, query
}
export type TypePosizione ="body"| "query";


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


function decoratoreParametroGenerico(tipoParametro: TipoParametro, nomeParametro: string, posizione:TypePosizione) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        metodo.CercaParametroSeNoAggiungi(nomeParametro, IType[tipoParametro], parameterIndex, EPosizione[posizione]);
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