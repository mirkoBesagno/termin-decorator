
import { IDescrivibile, IPrintabile, targetTerminale, TipoParametro } from "../tools";
import { IRitornoValidatore, TerminaleMetodo, TypeInterazone } from "./terminale-metodo";


import superagent, { post } from "superagent";
import express from "express";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData } from "./terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";

export type TypePosizione = "body" | "query" | 'header';


export type TypeDovePossoTrovarlo = TypeInterazone |  "qui" | 'non-qui';


export class TerminaleParametro implements IDescrivibile, IParametro {

    dovePossoTrovarlo: TypeDovePossoTrovarlo = 'rotta';
    nomeParametro: string;
    tipoParametro: TipoParametro;
    posizione: TypePosizione;
    indexParameter: number;

    descrizione: string;
    sommario: string;


    Validatore?: (parametro: any) => IRitornoValidatore
    constructor(nomeParametro: string, tipoParametro: TipoParametro, posizione: TypePosizione, indexParameter: number) {
        this.nomeParametro = nomeParametro;
        this.tipoParametro = tipoParametro;
        this.posizione = posizione;
        this.indexParameter = indexParameter;

        this.descrizione = "";
        this.sommario = "";
    }

    PrintMenu() {
        const t = Reflect.getMetadata('info', targetTerminale);
    }
    PrintCredenziali() {
        console.log("nomeParametro:" + this.nomeParametro + ':;:' + "tipoParametro:" + this.tipoParametro.toString());
    }
    PrintParametro() {
        return "tipoParametro:" + this.tipoParametro.toString() + ";" + "nomeParametro:" + this.nomeParametro;
    }
    SettaSwagger() {
        const ritorno =
            `{
                "name": "${this.nomeParametro}",
                "in": "${this.posizione}",
                "required": false,
                "type": "${this.tipoParametro}",
                "description": "${this.descrizione}",
                "summary":"${this.sommario}"
            }`;
        try {
            JSON.parse(ritorno)
        } catch (error) {
            console.log(error);
        }
        return ritorno;
    }
}

export interface IParametro {
    /** nome del parametro, in pratica il nome della variabile o un nome assonante (parlante)*/
    nomeParametro: string,
    /** la posizione rispetto alla chiamata, ovvero: "body" | "query" | "header" */
    posizione: TypePosizione,
    /** fa riferimento al tipo di base, ovvero: "number" | "text" | "date" */
    tipoParametro?: TipoParametro,
    /** descrizione lunga */
    descrizione?: string,
    /** descrizione breve */
    sommario?: string,
    dovePossoTrovarlo?: TypeDovePossoTrovarlo,
    Validatore?: (parametro: any) => IRitornoValidatore
}

function decoratoreParametroGenerico(parametri: IParametro)/* (nomeParametro: string, posizione: TypePosizione, tipoParametro?: TipoParametro, descrizione?: string, sommario?: string) */ {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        if (parametri.tipoParametro == undefined) parametri.tipoParametro = 'text';
        if (parametri.descrizione == undefined) parametri.descrizione = '';
        if (parametri.sommario == undefined) parametri.sommario = '';

        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        const paramestro = metodo.CercaParametroSeNoAggiungi(parametri.nomeParametro, parameterIndex,
            parametri.tipoParametro, parametri.posizione);
        if (parametri.descrizione != undefined) paramestro.descrizione = parametri.descrizione;
        else paramestro.descrizione = '';

        if (parametri.sommario != undefined) paramestro.sommario = parametri.sommario;
        else paramestro.sommario = '';

        if (parametri.dovePossoTrovarlo != undefined) paramestro.dovePossoTrovarlo = parametri.dovePossoTrovarlo;
        else paramestro.dovePossoTrovarlo = 'rotta';

        if (parametri.Validatore != undefined) paramestro.Validatore = parametri.Validatore;

        SalvaListaClasseMetaData(list);
    }
}


export { decoratoreParametroGenerico as mpPar };