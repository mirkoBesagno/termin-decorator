import { Request, Response, Router } from "express";
import { ListaTerminaleMetodo } from "../metodo/lista-metodo";
import { TerminaleMetodo } from "../metodo/metadata-metodo";
import { IGestorePercorsiPath, IHtml, IRaccoltaPercorsi } from "../utility";

import chiedi from "prompts";
import { ListaTerminaleProprieta } from "../proprieta/lista-proprieta";
import { TerminaleParametro } from "../parametro/metadata-parametro";
import { TerminaleProprieta } from "../proprieta/metadata-proprieta";
import { Client } from "pg";


export interface IClasseORM {

    nomeTriggerAutoCreateUpdated_Created_Deleted: string,
    abilitaCreatedAt: boolean;
    abilitaUpdatedAt: boolean;
    abilitaDeletedAt: boolean;
    nomeTabella: string;
    creaId: boolean;
}

class ArtefattoClasseORM implements IClasseORM {
    nomeTriggerAutoCreateUpdated_Created_Deleted = 'update_updated_at_column';

    abilitaCreatedAt: boolean;
    abilitaUpdatedAt: boolean;
    abilitaDeletedAt: boolean;
    creaId: boolean;
    faxSimile_abilitaDeletedAt = `created_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp`;
    faxSimile_abilitaCreatedAt = `updated_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp`;
    faxSimile_abilitaUpdatedAt = `deleted_at timestamp with time zone`;

    TriggerDeleted_at(nomeTabella: string) {
        return `CREATE INDEX IF NOT EXISTS idx_somethings_deleted_at ON ${nomeTabella} (deleted_at ASC);`;
    }
    TriggerUpdate(nomeTabella: string) {
        return `DROP TRIGGER IF EXISTS tg_somethings_updated_at ON ${nomeTabella};
        CREATE TRIGGER tg_somethings_updated_at
        BEFORE UPDATE
        ON ${nomeTabella}
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();`
    }

    listaProprieta: ListaTerminaleProprieta;
    nomeTabella: string;
    constructor(nomeTabella: string) {
        this.creaId = false;
        this.nomeTabella = nomeTabella;
        this.listaProprieta = new ListaTerminaleProprieta();
        this.abilitaCreatedAt = false;
        this.abilitaDeletedAt = false;
        this.abilitaUpdatedAt = false;
    }

    faxsSimileIntestazione = 'CREATE TABLE  IF NOT EXISTS  ';

    async CostruisciCreazioneDB(client: Client) {
        let ritorno = '';
        let ritornoTmp = '';
        ritornoTmp = ritornoTmp + this.faxsSimileIntestazione + this.nomeTabella + '(' + '\n';
        if (this.abilitaCreatedAt) { ritornoTmp = ritornoTmp + this.faxSimile_abilitaCreatedAt + ',' + '\n'; }
        if (this.abilitaDeletedAt) { ritornoTmp = ritornoTmp + this.faxSimile_abilitaDeletedAt + ',' + '\n'; }
        if (this.abilitaUpdatedAt) { ritornoTmp = ritornoTmp + this.faxSimile_abilitaUpdatedAt; }
        if (this.listaProprieta.length) ritornoTmp = ritornoTmp + ',' + '\n';
        else ritornoTmp = ritornoTmp + '\n';
        for (let index = 0; index < this.listaProprieta.length; index++) {
            const element = this.listaProprieta[index];
            ritornoTmp = ritornoTmp + element.CostruisciCreazioneDB();
            if (index + 1 < this.listaProprieta.length) ritornoTmp = ritornoTmp + ',' + '\n';
            else {
                if (this.creaId) {
                    ritornoTmp = ritornoTmp + ',\n';
                    ritornoTmp = ritornoTmp + CreaID() + '\n';
                } else {
                    ritornoTmp = ritornoTmp + '\n';
                }
            }

        }
        ritornoTmp = ritornoTmp + ');' + '\n';
        await EseguiQueryControllata(client, ritornoTmp);
        ritorno = ritorno + ritornoTmp;
        ritornoTmp = '';
        /* Ora che la tabella esiste vado ad eseguire i trigger */
        for (let index = 0; index < this.listaProprieta.length; index++) {
            const element = this.listaProprieta[index];
            element.CostruisceTrigger(this.nomeTabella, client);
        }
        /* Ora creo un indice di prova */
        ritornoTmp = `CREATE INDEX index_name ON ${this.nomeTabella} 
        (
            nome ASC NULLS LAST
        );`;
        await EseguiQueryControllata(client, ritornoTmp);
        ritorno = ritorno + ritornoTmp;
        ritornoTmp = '';

        ritornoTmp = `CREATE INDEX index_cognome ON ${this.nomeTabella} 
        (
            cognome ASC NULLS LAST
        );`;
        await EseguiQueryControllata(client, ritornoTmp);
        ritorno = ritorno + ritornoTmp;
        ritornoTmp = '';
        /*  */
        if (this.abilitaDeletedAt && this.abilitaUpdatedAt) {
            ritornoTmp = ritornoTmp + this.TriggerUpdate(this.nomeTabella) + '\n';
        }
        await EseguiQueryControllata(client, ritornoTmp);
        ritorno = ritorno + ritornoTmp;
        ritornoTmp = '';
        if (this.abilitaDeletedAt && this.abilitaUpdatedAt) {
            ritornoTmp = ritornoTmp + this.TriggerDeleted_at(this.nomeTabella) + '\n';
        }
        await EseguiQueryControllata(client, ritornoTmp);
        ritorno = ritorno + ritornoTmp;
        ritornoTmp = '';
        return ritorno;
    }
}
export function CreaID() {
    return "id SERIAL PRIMARY KEY";
}
export function TriggerUpdate_updated_at_column() {
    return `CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';`;
}
export function CreateDataBase(nomeDB: string) {
    return `CREATE DATABASE ${nomeDB};`;
}
export function DropDataBase(nomeDB: string) {
    return `DROP DATABASE IF EXISTS ${nomeDB};`;
}
export function DropAllTable() {
    return `DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
    COMMENT ON SCHEMA public IS 'standard public schema';`;
}
export async function EseguiQueryControllata(client: Client, query: string) {
    try {
        const result = await client.query(query);
        console.log('ESEGUO : \n' + query);
        return query;
    } catch (error) {
        console.log('\n\nINIZIO Errroe : \n**********************\n\n');
        console.log(error);
        console.log('\n\nFINE Errroe : \n**********************\n\n');
    }
}

class ArtefattoClasseExpress extends ArtefattoClasseORM {
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