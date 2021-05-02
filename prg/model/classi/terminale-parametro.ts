
import { IDescrivibile, IPrintabile, targetTerminale, TipoParametro } from "../tools";
import { IRitornoValidatore, TerminaleMetodo } from "./terminale-metodo";


import superagent, { post } from "superagent";
import express from "express";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData } from "./terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";

export type TypePosizione = "body" | "query" | 'header';


export class TerminaleParametro implements IDescrivibile, IParametro {
    nomeParametro: string;
    tipoParametro: TipoParametro;
    posizione: TypePosizione;
    indexParameter: number;

    descrizione: string;
    sommario: string;


    Validatore?: (parametro:any) => IRitornoValidatore
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
        /* const tmp = {
            name: this.nomeParametro,
            in: this.posizione,
            required: false,
            type: this.tipoParametro,
            description: this.descrizione,
            summary: this.sommario
        }; */
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
    nomeParametro: string, posizione: TypePosizione, tipoParametro?: TipoParametro,
    descrizione?: string, sommario?: string,
    Validatore?: (parametro:any) => IRitornoValidatore
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

        if (parametri.Validatore != undefined) paramestro.Validatore = parametri.Validatore;

        SalvaListaClasseMetaData(list);
    }
}


export { decoratoreParametroGenerico as mpPar };