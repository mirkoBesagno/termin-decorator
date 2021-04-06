import { IPrintabile, targetTerminale } from "../tools";

import superagent from "superagent";
import express, { Router } from "express";
import chiedi from "prompts";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";

export class TerminaleClasse implements IPrintabile {
    static nomeMetadataKeyTarget = "ClasseTerminaleTarget";
    listaMetodi: ListaTerminaleMetodo;
    id: string;
    nome: string;
    path: string;

    rotte: Router;
    constructor(nome: string, path?: string) {
        this.id = Math.random().toString();
        this.rotte = Router();
        this.listaMetodi = new ListaTerminaleMetodo(this.rotte);
        this.nome = nome;
        if (path) this.path = path;
        else this.path = nome;
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
    async PrintMenu() {
        const tab = '\t\t';
        console.log(tab + 'TerminaleClasse' + '->' + 'PrintMenu');
        console.log(tab + this.nome + ' -> ' + this.id + ' -> ' + +'/'+this.path + ' ;');

        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            element.PrintCredenziali(this.path);
        }
    }
    PrintCredenziali() {
        const tmp = "nome:" + this.nome + ":;:" +
            "id:" + this.id + ":;:" +
            "listaMetodi.length:" + this.listaMetodi.length + ":;:";
        //console.log(tmp);
    }

}

/**
 * 
 * @param ctr 
 */
export function mpClass(percorso: string): any {
    return (ctr: Function) => {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        const classe = CheckClasseMetaData(ctr.name);
        classe.path = percorso;
        Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, targetTerminale); //e lo vado a salvare nel meta data
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale); //e lo vado a salvare nel meta data
    }
}


export function CheckClasseMetaData(nome: string) {
    let listClasse: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni ovvero le classi
    if (listClasse == undefined)/* se non c'è la creo*/ {
        listClasse = new ListaTerminaleClasse();
        Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, listClasse, targetTerminale);
    }
    /* poi la cerco */
    let classe = listClasse.CercaConNome(nome);
    if (classe == undefined) {
        classe = new TerminaleClasse(nome); //se il metodo non c'è lo creo
        listClasse.AggiungiElemento(classe);
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale); //e lo vado a salvare nel meta data
    }
    return classe;
}