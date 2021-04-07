import { IPrintabile, targetTerminale } from "../tools";
import { CheckClasseMetaData, TerminaleClasse } from "./terminale-classe";
import { TerminaleParametro } from "./terminale-parametro";


import superagent from "superagent";
import express, { Router } from "express";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleParametro } from "../liste/lista-terminale-parametro";

export interface IReturn {
    body: object;
}

export class TerminaleMetodo implements IPrintabile {
    classePath = '';
    static nomeMetadataKeyTarget = "MetodoTerminaleTarget";
    private _listaParametri: ListaTerminaleParametro;
    tipo: TypeMetodo;

    private _nome: string | Symbol;
    metodoAvviabile: any;
    private _path: string;
    constructor(nome: string, path: string, classeParth: string) {
        this._listaParametri = new ListaTerminaleParametro();
        this._nome = nome;
        this._path = path;
        this.classePath = this.classePath;
        this.tipo = TypeMetodo.indefinita;
    }
    /* start : get e set */
    public get nome(): string | Symbol {
        return this._nome;
    }
    public set nome(value: string | Symbol) {
        this._nome = value;
    }
    public get path(): string {
        return this._path;
    }
    public set path(value: string) {
        this._path = value;
    }
    public get listaParametri(): ListaTerminaleParametro {
        return this._listaParametri;
    }
    public set listaParametri(value: ListaTerminaleParametro) {
        this._listaParametri = value;
    }
    /* end : get e ste */
    async PrintMenu() {
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            element.PrintMenu();
        }
    }
    EseguiChiamata(path: string) {
        const header = {};//questa dovro costruirla a seconda dei permessi e delle restrizioni
        superagent.post(path + '/' + this.nome)
            .set({})
            .send('');
    }
    PrintCredenziali(pathRoot?: string) {
        const tab = '\t\t\t';
        let parametri = "";
        console.log(tab + 'TerminaleMetodo' + '->' + 'PrintCredenziali');
        console.log(tab + this.nome + ' | ' + this.path + ' ;');

        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        if (pathRoot != undefined) console.log(tab + this.nome + ' | ' + '/' + pathRoot + '/' + this.path + '  |  ' + parametri);
        else console.log(tab + this.nome + ' | ' + "/" + this.path + '  |  ' + parametri);

    }
    ConfiguraRotta(rotte: Router): Router {
        if (this.metodoAvviabile != undefined) {
            //rotte.get('/' + this.nome, this.metodoAvviabile);
            switch (this.tipo) {
                case TypeMetodo.get:
                    (<IReturn>this.metodoAvviabile).body;
                    rotte.get("/" + this.path.toString(),
                        (req: any, res: any) => {
                            const tmp = this.metodoAvviabile();
                            res.send((<IReturn>tmp).body);
                        });
                    break;
                default:
                    break;
            }
        }
        return rotte;
    }

}

export enum TypeMetodo {
    get, put, indefinita
}
/**
* arrivati a questo punto il metodo dovrebbe gia esistere ma se non esiste bisogna crearlo
* poi deve essere configurata la sua funzione
* @returns q
*/
export function mpMet(tipo: TypeMetodo, path?: string): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const classe = CheckClasseMetaData(target.constructor.name);
        const metodo = CheckMetodoMetaData(propertyKey.toString(), classe);

        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////
        let tmp: ListaTerminaleMetodo = Reflect.getMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni

        if (metodo != undefined && tmp != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;
            metodo.tipo = tipo;
            if (path == undefined) metodo.path = propertyKey.toString();
            else metodo.path = path;

            tmp.AggiungiElemento(metodo);
            classe.listaMetodi.AggiungiElemento(metodo);
            Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale); // salvo tutto
            Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale); //e lo vado a salvare nel meta data
            //Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale);
        }
        else {
            console.log("Errore mio!");
        }
    }
}


export function CheckMetodoMetaData(nomeMetodo: string, classe: TerminaleClasse) {
    let tmp: ListaTerminaleMetodo = Reflect.getMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni
    if (tmp == undefined) {//se non c'è 
        tmp = new ListaTerminaleMetodo(classe.rotte);//lo creo
        Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale);//e lo aggiungo a i metadata
    }
    let terminale = tmp.CercaConNome(nomeMetodo, classe.path); //cerca la mia funzione
    if (terminale == undefined)/* se non c'è */ {
        terminale = new TerminaleMetodo(nomeMetodo, "", classe.nome); // creo la funzione
    }
    return terminale;
}