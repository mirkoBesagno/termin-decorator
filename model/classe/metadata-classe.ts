import { Request, Response, Router } from "express";
import { ListaTerminaleMetodo } from "../metodo/lista-metodo";
import { TerminaleMetodo } from "../metodo/metadata-metodo";
import { IGestorePercorsiPath, IHtml, IRaccoltaPercorsi } from "../utility";

import chiedi from "prompts";

export class TerminaleClasse implements IGestorePercorsiPath {

     listaKnex: any[] = [];

    classeSwagger?= '';

    static nomeMetadataKeyTarget = "ClasseTerminaleTarget";

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

    constructor(nome: string, path?: string, headerPath?: string, port?: number) {
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

    async SettaPathRoot_e_Global(item: string, percorsi: IRaccoltaPercorsi, app: any) {
        const pathGlobal = this.SettaPercorsi(percorsi);
        this.ConfiguraListaRotteHTML(app, pathGlobal);
        await this.listaMetodi.ConfiguraListaRotteApplicazione(app, this.percorsi);
    }
    private SettaPercorsi(percorsi: IRaccoltaPercorsi): string {
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
                console.log(error);
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

    private ConfiguraRotteHtml(app: any, percorsoTmp: string, contenuto: string) {
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
    private ConfiguraListaRotteHTML(app: any, pathGlobal: string) {
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