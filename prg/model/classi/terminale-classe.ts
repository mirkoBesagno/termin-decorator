import { IPrintabile, targetTerminale } from "../tools";

import superagent from "superagent";
import express, { Router } from "express";
import chiedi from "prompts";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { TerminaleMetodo } from "./terminale-metodo";
import { IRaccoltaPercorsi } from "./terminale-main";

export class TerminaleClasse implements IPrintabile {
    static nomeMetadataKeyTarget = "ClasseTerminaleTarget";

    listaMetodi: ListaTerminaleMetodo;
    id: string;
    nome: string;
    rotte: Router;

    private path: string;

    public get GetPath(): string {
        return this.path;
    }

    public set SetPath(v: string) {
        this.path = v;
        const pathGlobal = '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
    }



    percorsi: IRaccoltaPercorsi;

    constructor(nome: string, path?: string, headerPath?: string, port?: number) {
        this.id = Math.random().toString();
        this.rotte = Router();
        this.listaMetodi = new ListaTerminaleMetodo(this.rotte);

        this.nome = nome;
        if (path) this.path = path;
        else this.path = nome;
        this.percorsi = { pathGlobal: '', patheader: '', porta: 0 };

        if (headerPath == undefined) this.percorsi.patheader = "http://localhost:";
        else this.percorsi.patheader = headerPath;
        if (port == undefined) this.percorsi.porta = 3000;
        else this.percorsi.porta = port;

        const pathGlobal = '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
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
        console.log(tab + this.nome + ' | ' + this.id + ' | ' + '/' + this.percorsi.pathGlobal + '/' + this.path + ' ;');

        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            element.PrintCredenziali(this.percorsi.pathGlobal + '/' + this.path);
        }
        const scelta = await chiedi({ message: 'Premi invio per continuare', type: 'number', name: 'scelta' });

    }
    async PrintMenuClasse() {
        console.log('Classe :' + this.nome);
        let index = 0;
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            const tmp = index + 1;
            if (element.tipoInterazione == 'rotta' || element.tipoInterazione == 'ambo') {
                console.log(tmp + ': ' + element.PrintStamp());
            }
        }
        const scelta = await chiedi({ message: 'Scegli il metodo da eseguire: ', type: 'number', name: 'scelta' });

        if (scelta.scelta == 0) {
            console.log("Saluti dalla classe : " + this.nome);

        } else {
            try {
                console.log('Richiamo la rotta');
                const risposta = await this.listaMetodi[scelta.scelta - 1].ChiamaLaRotta(this.percorsi.patheader + this.percorsi.porta);
                if (risposta == undefined) {
                    console.log("Risposta undefined!");
                } else {
                    console.log(risposta)
                }
                await this.PrintMenuClasse();
            } catch (error) {
                await this.PrintMenuClasse();
            }
        }
    }

    PrintCredenziali() {
        const tmp = "nome:" + this.nome + ":;:" +
            "id:" + this.id + ":;:" +
            "listaMetodi.length:" + this.listaMetodi.length + ":;:";
        //console.log(tmp);
    }
    SettaPathRoot_e_Global(item: string, percorsi: IRaccoltaPercorsi, app:any) {

        if (percorsi.patheader == undefined) this.percorsi.patheader = "http://localhost:";
        else this.percorsi.patheader = percorsi.patheader;

        if (percorsi.porta == undefined) this.percorsi.porta = 3000;
        else this.percorsi.porta = percorsi.porta;

        const pathGlobal = percorsi.pathGlobal + '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            if (element.tipoInterazione == 'rotta' || element.tipoInterazione == 'ambo') {
                //element.ConfiguraRotta(this.rotte, this.percorsi);
                element.ConfiguraRottaApplicazione(app, this.percorsi);
            }
            //element.listaRotteGeneraChiavi=this.listaMetodiGeneraKey;
        }
    }
    SettaSwagger() {

        const swaggerJson = `"paths": {    
        `;
        let ritorno = '';
        let primo = false;
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            if (element.tipoInterazione != 'middleware') {
                const tt = element.SettaSwagger('rotta');
                if (tt) {
                    if (primo == false && tt != undefined) {
                        primo = true;
                        ritorno = tt + '';
                    } else if (tt != undefined) {
                        ritorno = ritorno + ',' + tt;
                    }
                }
            }
        }
        const tmp = swaggerJson + ritorno + '}';

        try {
            const hhh = tmp.toString();
            JSON.parse(tmp)
        } catch (error) {
            console.log(error);
        }
        return tmp;
    }
    CercaMetodoSeNoAggiungiMetodo(nome: string) {
        let terminale = this.listaMetodi.CercaConNome(nome)

        if (terminale == undefined)/* se non c'è */ {
            terminale = new TerminaleMetodo(nome, nome, this.nome); // creo la funzione
            this.listaMetodi.AggiungiElemento(terminale);
        }
        return terminale;
    }
    /* SettaHTML() {
        const tmp: any[] = [];
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            tmp.push(element.Se);
        }
        return tmp;
    } */
}

/**
 * 
 * @param ctr 
 */
function decoratoreClasse(percorso: string): any {
    return (ctr: Function) => {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        const classe = CheckClasseMetaData(ctr.name);
        classe.SetPath = percorso;
        SalvaListaClasseMetaData(tmp);
    }
}
function decoratoreClasseeRev(percorso: string): any {
    return (ctr: Function) => {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(ctr.name);
        classe.SetPath = percorso;
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

    /* let classePath = listClasse.CercaConPath(path);
    if (classe == undefined && classePath == undefined) {
        classe = new TerminaleClasse(nome); //se il metodo non c'è lo creo
        listClasse.AggiungiElemento(classe);
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale); //e lo vado a salvare nel meta data
    }
    else {
        if (classePath != undefined && classe != undefined) {
            for (let index = 0; index < classePath.listaMetodi.length; index++) {
                const element = classePath.listaMetodi[index];
                classe.listaMetodi.AggiungiElemento(element);
            }
            return classe;
        }
        else if(classePath != undefined && classe == undefined){
            return classePath;
        }
        else if(){
            
        }
        return classe;
    } */
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


export { decoratoreClasse as mpClas };
export { decoratoreClasse as mpC };
export { decoratoreClasse as mpClasse };
export { decoratoreClasse as mpDecoratoreClasse };
export { decoratoreClasse as mpDecClasse };
export { decoratoreClasse as mpDecClas };

export { decoratoreClasse as MPClas };
export { decoratoreClasse as MPC };
export { decoratoreClasse as MPClasse };
export { decoratoreClasse as MPDecoratoreClasse };
export { decoratoreClasse as MPDecClasse };
export { decoratoreClasse as MPDecClas };