import { IPrintabile, targetTerminale } from "../tools";

import superagent from "superagent";
import express, { Router } from "express";
import chiedi from "prompts";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { TerminaleMetodo } from "./terminale-metodo";

export class TerminaleClasse implements IPrintabile {
    static nomeMetadataKeyTarget = "ClasseTerminaleTarget";
    listaMetodi: ListaTerminaleMetodo;
    id: string;
    nome: string;
    path: string;
    private pathRoot: string;
    rotte: Router;
    pathGlobal: string;
    headerPath:string;

    constructor(nome: string, path?: string, headerPath?:string) {
        this.id = Math.random().toString();
        this.rotte = Router();
        this.listaMetodi = new ListaTerminaleMetodo(this.rotte);
        this.nome = nome;
        if (path) this.path = path;
        else this.path = nome;
        this.pathRoot = "";
        this.pathGlobal = '';
        
        if (headerPath==undefined) {
            this.headerPath="http://localhost:3000"
        }
        else{
            this.headerPath = headerPath;
        }
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
        console.log(tab + this.nome + ' | ' + this.id + ' | ' + '/' + this.pathRoot + '/' + this.path + ' ;');

        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            element.PrintCredenziali(this.pathRoot + '/' + this.path);
        }
        const scelta = await chiedi({ message: 'Premi invio per continuare', type: 'number', name: 'scelta' });

    }
    async PrintMenuClasse() {
        console.log('Classe :' + this.nome);
        let index = 0;
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            const tmp = index + 1;
            console.log(tmp +': '+ element.PrintStamp());
        }
        const scelta = await chiedi({ message: 'Scegli il metodo da eseguire: ', type: 'number', name: 'scelta' });

        if (scelta.scelta == 0) {
            console.log("Saluti dalla classe : "+ this.nome);

        } else {
            console.log('Richiamo la rotta');
            
            const risposta =  await this.listaMetodi[scelta.scelta -1 ].ChiamaLaRotta();
            if (risposta == undefined) {
                console.log("Risposta undefined!");
            } else {
                console.log(risposta.body)
            }
                
            await this.PrintMenuClasse();
        }
    }

    PrintCredenziali() {
        const tmp = "nome:" + this.nome + ":;:" +
            "id:" + this.id + ":;:" +
            "listaMetodi.length:" + this.listaMetodi.length + ":;:";
        //console.log(tmp);
    }
    SettaPathRoot_e_Global(item: string, pathGlobal: string, patheader:string) {
        this.pathRoot = item;
        this.pathGlobal = pathGlobal;
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            element.ConfiguraRotta(this.rotte, this.pathGlobal);
        }
    }
    CercaMetodoSeNoAggiungiMetodo(nome: string) {
        let terminale = this.listaMetodi.CercaConNomeRev(nome)

        if (terminale == undefined)/* se non c'è */ {
            terminale = new TerminaleMetodo(nome, "", this.nome); // creo la funzione
            this.listaMetodi.AggiungiElemento(terminale);
        }
        return terminale;
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
export function mpClasseRev(percorso: string): any {
    return (ctr: Function) => {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(ctr.name);
        classe.path = percorso;
        SalvaListaClasseMetaData(list);
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

export function SalvaListaClasseMetaData(tmp: ListaTerminaleClasse) {
    Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, targetTerminale);
}
export function GetListaClasseMetaData() {
    let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaTerminaleClasse();
    }
    return tmp;
}