import { Request, Response, Router } from "express";
import { ListaTerminaleMetodo } from "../metodo/lista-metodo";
import { TerminaleMetodo } from "../metodo/metadata-metodo";
import { GetListaClasseMetaData, IClasse, IGestorePercorsiPath, IHtml, IRaccoltaPercorsi, SalvaListaClasseMetaData } from "../utility";

import chiedi from "prompts";
import { TerminaleProprieta } from "../proprieta/metadata-proprieta";
import { ListaPolicy } from "../postgres/policy";
import { ArtefattoClassePostgres, IArtefattoClassePostgres } from "../postgres/tabella";
import { ListaTerminaleClasse } from "./lista-classe";

import fs from 'fs';


class ArtefattoClasseExpress extends ArtefattoClassePostgres {
    listaMetodi: ListaTerminaleMetodo;
    id: string;
    nome: string;
    rotte: Router;
    path: string;
    public get GetPath(): string {
        return this.path;
    }
    public set SetPath(v: string) {
        this.path = v;
        const pathGlobal = '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
    }
    percorsi: IRaccoltaPercorsi;
    html: IHtml[] = [];
    classeSwagger?= '';
    constructor(nome: string, path?: string, headerPath?: string, port?: number) {
        super(nome);

        this.id = Math.random().toString();
        this.rotte = Router();
        this.listaMetodi = new ListaTerminaleMetodo();

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
        this.classeSwagger = '';
    }
    SettaPathRoot_e_Global(item: string, percorsi: IRaccoltaPercorsi, app: any) {
        const pathGlobal = this.SettaPercorsi(percorsi);
        this.ConfiguraListaRotteHTML(app, pathGlobal);
        this.listaMetodi.ConfiguraListaRotteApplicazione(app, this.percorsi);

    }
    SettaORM() {
        return true;
    }
    SettaPercorsi(percorsi: IRaccoltaPercorsi): string {
        if (percorsi.patheader == undefined) this.percorsi.patheader = "localhost";
        else this.percorsi.patheader = percorsi.patheader;

        if (percorsi.porta == undefined) this.percorsi.porta = 3000;
        else this.percorsi.porta = percorsi.porta;

        const pathGlobal = percorsi.pathGlobal + '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
        return pathGlobal;
    }

    CercaMetodoSeNoAggiungiMetodo(nome: string) {
        let terminale = this.listaMetodi.CercaConNome(nome)

        if (terminale == undefined)/* se non c'è */ {
            terminale = new TerminaleMetodo(nome, nome, this.nome); // creo la funzione
            this.listaMetodi.AggiungiElemento(terminale);
        }
        return terminale;
    }
    CercaProprietaSeNoAggiungiProprieta(nome: string) {
        let terminale = this.listaProprieta.CercaConNome(nome)

        if (terminale == undefined)/* se non c'è */ {
            terminale = new TerminaleProprieta(nome, 'any'); // creo la funzione
            this.listaProprieta.AggiungiElemento(terminale);
        }
        return terminale;
    }
    /******************************************************************* */
    async PrintMenuClasse() {
        console.log('Classe :' + this.nome);
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            const tmp = index + 1;
            if (element.interazione == 'rotta' || element.interazione == 'ambo') {
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
            } catch (error) {
                console.log('\n*****\n' + error + '\n********\n\n');
            }
            await this.PrintMenuClasse();
        }
    }
    SettaSwagger() {
        /* 
        "paths": {  } 
        */
        let ritorno = '';
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            const tmp = element.SettaSwagger();
            if (index > 0 && tmp != undefined)
                ritorno = ritorno + ', ';
            if (tmp != undefined)
                ritorno = ritorno + tmp;
        }
        return ritorno;
    }
    ConfiguraRotteHtml(app: any, percorsoTmp: string, contenuto: string) {
        app.get(percorsoTmp,
            //this.cors,
            //this.helmet,
            async (req: Request, res: Response) => {
                if (this.html)
                    res.send(contenuto);
                else
                    res.sendStatus(404);
            });
    }
    ConfiguraListaRotteHTML(app: any, pathGlobal: string) {
        for (let index = 0; index < this.html.length; index++) {
            const element = this.html[index];
            //element.ConfiguraRotteHtml(app, this.percorsi.pathGlobal,)
            if (element.percorsoIndipendente)
                this.ConfiguraRotteHtml(app, '/' + element.path, element.contenuto);
            else
                this.ConfiguraRotteHtml(app, pathGlobal + '/' + element.path, element.contenuto);
        }
    }
}


export class TerminaleClasse extends ArtefattoClasseExpress implements IGestorePercorsiPath {
    //listaProprieta:ListaTerminaleProprieta;


    static nomeMetadataKeyTarget = "ClasseTerminaleTarget";

    constructor(nome: string, path?: string, headerPath?: string, port?: number) {
        super(nome, path, headerPath, port);
    }

    static IstanziaExpress(parametri: IClasse, nomeClasse: string) {

        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);

        /*   const tmp: ListaTerminaleClasse = GetListaClasseMetaData();
          const classe = CheckClasseMetaData(nomeClasse); */
        /* if (parametri.listaTest) classe.listaTest = parametri.listaTest; */

        if (parametri.percorso) classe.SetPath = parametri.percorso;
        else classe.SetPath = nomeClasse;

        if (parametri.html) {
            classe.html = [];
            for (let index = 0; index < parametri.html.length; index++) {
                const element = parametri.html[index];
                if (element.percorsoIndipendente == undefined) element.percorsoIndipendente = false;

                if (element.html != undefined && element.htmlPath == undefined
                    && classe.html.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    classe.html.push({
                        contenuto: element.html,
                        path: element.path,
                        percorsoIndipendente: element.percorsoIndipendente
                    });
                } else if (element.html == undefined && element.htmlPath != undefined
                    && classe.html.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    try {
                        classe.html.push({
                            contenuto: fs.readFileSync(element.htmlPath).toString(),
                            path: element.path,
                            percorsoIndipendente: element.percorsoIndipendente
                        });
                    } catch (error) {
                        classe.html.push({
                            contenuto: 'Nessun contenuto',
                            path: element.path,
                            percorsoIndipendente: element.percorsoIndipendente
                        });
                    }
                }
            }
        }

        if (parametri.LogGenerale) {
            classe.listaMetodi.forEach(element => {
                if (element.onLog == undefined)
                    element.onLog = parametri.LogGenerale;
            });
        }

        if (parametri.Inizializzatore) {
            classe.listaMetodi.forEach(element => {
                let contiene = false;
                element.listaParametri.forEach(element => {
                    if (element.autenticatore == true) contiene = true;
                });
                if (contiene) element.Istanziatore = parametri.Inizializzatore;
            });
        }

        if (parametri.cacheOptionMemory) {
            classe.listaMetodi.forEach(element => {
                if (element.cacheOptionMemory == undefined) {
                    element.cacheOptionMemory = parametri.cacheOptionMemory ?? { durationSecondi: 1 };
                }
            })
        }

        if (parametri.classeSwagger && parametri.classeSwagger != '') {
            classe.classeSwagger = parametri.classeSwagger;
            classe.listaMetodi.forEach(element => {
                if (element.swaggerClassi) {
                    const ris = element.swaggerClassi.find(x => { if (x == parametri.classeSwagger) return true; else return false; })
                    if (ris == undefined && parametri.classeSwagger) {
                        element.swaggerClassi.push(parametri.classeSwagger);
                    }
                }
            });
        }


        SalvaListaClasseMetaData(list);
    }

    static IstanziaPostgres(nomeClasse: string, parametri: IArtefattoClassePostgres) {

        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        classe.abilitaCreatedAt = parametri.abilitaCreatedAt ?? false;
        classe.abilitaDeletedAt = parametri.abilitaDeletedAt ?? false;
        classe.abilitaUpdatedAt = parametri.abilitaUpdatedAt ?? false;
        classe.creaId = parametri.creaId ?? false;
        classe.estende = parametri.estende;
        classe.like = parametri.like;
        classe.multiUnique = parametri.multiUnique;
        classe.nomeTabella = parametri.nomeTabella ?? nomeClasse;
        classe.listaPolicy = new ListaPolicy(parametri.listaPolicy, classe.nomeTabella);//classe.policySicurezza = parametri.policySicurezza;
        classe.grants = parametri.grants;
        classe.queryPerVista = parametri.queryPerVista;
        SalvaListaClasseMetaData(list);
    }


    /* SettaPathRoot_e_Global(item: string, percorsi: IRaccoltaPercorsi, app: any) {
    }
    SettaPercorsi(percorsi: IRaccoltaPercorsi): string {
    }

    CercaMetodoSeNoAggiungiMetodo(nome: string) {
    }
    CercaProprietaSeNoAggiungiProprieta(nome: string) { 

    async PrintMenuClasse() {
    }


    SettaSwagger() {
    }

    ConfiguraRotteHtml(app: any, percorsoTmp: string, contenuto: string) {
    }
    ConfiguraListaRotteHTML(app: any, pathGlobal: string) {
    } */
}