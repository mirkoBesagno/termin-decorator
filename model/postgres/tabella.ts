import { Client } from "pg";
import { ListaTerminaleProprieta } from "../proprieta/lista-proprieta";
import { IGrant, IPolicy, typeGrantEvent } from "../utility";
import { ListaPolicy } from "./policy";



export interface IArtefattoClassePostgres {
    queryPerVista?: string;
    like?: string;
    abilitaCreatedAt: boolean;
    abilitaUpdatedAt: boolean;
    abilitaDeletedAt: boolean;
    nomeTabella?: string;
    estende?: string;
    creaId: boolean;
    multiUnique?: { colonneDiRiferimento: string[] }[],
    listaPolicy?: IPolicy[],
    grants?: IGrant[]
}

export class ArtefattoClassePostgres implements IArtefattoClassePostgres {
    queryPerVista?: string;

    like?: string;
    estende?: string;
    abilitaCreatedAt: boolean;
    abilitaUpdatedAt: boolean;
    abilitaDeletedAt: boolean;
    creaId: boolean;
    listaPolicy?: ListaPolicy;
    grants?: IGrant[]
    multiUnique?: { colonneDiRiferimento: string[] }[] = [];
    faxSimile_abilitaDeletedAt = `created_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp`;
    faxSimile_abilitaCreatedAt = `updated_at timestamp with time zone  NOT NULL  DEFAULT current_timestamp`;
    faxSimile_abilitaUpdatedAt = `deleted_at timestamp with time zone`;


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
    faxsSimileIntestazione = 'CREATE TABLE IF NOT EXISTS ';
    faxsSimileIntestazioneView = 'CREATE OR REPLACE VIEW ';
    CostruisciCreazioneDB(/* client: Client */elencoQuery: string[], padreEreditario: boolean) {
        let rigaDaInserire = '';
        let ritornoTmp = '';
        if (this.estende == undefined && this.like == undefined && padreEreditario == true) rigaDaInserire = '); \n';
        else if (this.estende && padreEreditario == false) rigaDaInserire = ') INHERITS("' + this.estende + '");' + '\n';
        else if (this.like && padreEreditario == false) rigaDaInserire = 'LIKE "' + this.like + '"' + '\n';
        else { rigaDaInserire = ''; }
        if (rigaDaInserire && rigaDaInserire != '') {
            let checkTmp = false;
            if (this.queryPerVista == undefined || this.queryPerVista == '') {
                ritornoTmp = ritornoTmp + this.faxsSimileIntestazione + '"' + this.nomeTabella + '"' + ' (' + '\n';
                if (this.abilitaCreatedAt) { ritornoTmp = ritornoTmp + this.faxSimile_abilitaCreatedAt + ',' + '\n'; }
                if (this.abilitaDeletedAt) { ritornoTmp = ritornoTmp + this.faxSimile_abilitaDeletedAt + ',' + '\n'; }
                if (this.abilitaUpdatedAt) { ritornoTmp = ritornoTmp + this.faxSimile_abilitaUpdatedAt; }
                if (this.listaProprieta.length) ritornoTmp = ritornoTmp + ',' + '\n';
                else ritornoTmp = ritornoTmp + '\n';

                for (let index = 0; index < this.listaProprieta.length; index++) {
                    const element = this.listaProprieta[index];
                    ritornoTmp = ritornoTmp + element.CostruisciCreazioneDB(this.nomeTabella);
                    if (index + 1 < this.listaProprieta.length) ritornoTmp = ritornoTmp + ',' + '\n';
                    else {
                        if (this.creaId) {
                            ritornoTmp = ritornoTmp + ',\n';
                            ritornoTmp = ritornoTmp + CreaID() + '\n';
                            checkTmp = true;
                        } else {
                            ritornoTmp = ritornoTmp + '\n';
                        }
                    }
                }
                if (this.creaId == true && checkTmp == false) {
                    if (this.listaProprieta.length > 0) {
                        ritornoTmp = ritornoTmp + ',\n';
                        ritornoTmp = ritornoTmp + CreaID() + '\n';
                    }
                    else if (this.abilitaUpdatedAt || this.abilitaCreatedAt || this.abilitaDeletedAt) {
                        ritornoTmp = ritornoTmp + ',\n' + CreaID() + '\n';
                    }
                    else {
                        ritornoTmp = ritornoTmp + CreaID() + '\n';
                    }
                }
                if (this.multiUnique) {
                    for (let index = 0; index < this.multiUnique.length; index++) {
                        const element = this.multiUnique[index];
                        let ritornoTmp2 = 'UNIQUE (';
                        for (let ind = 0; ind < element.colonneDiRiferimento.length; ind++) {
                            const variab = element.colonneDiRiferimento[ind];
                            ritornoTmp2 = ritornoTmp2 + ' ' + variab;
                            if (ind + 1 < element.colonneDiRiferimento.length) ritornoTmp2 = ritornoTmp2 + ',';
                        }
                        ritornoTmp2 = ritornoTmp2 + ' )';
                        if (ritornoTmp2 != 'UNIQUE ( )') {
                            ritornoTmp = ritornoTmp + ritornoTmp2;
                        }
                    }
                }
                ritornoTmp = ritornoTmp + rigaDaInserire;
            }
            else {
                ritornoTmp = ritornoTmp + this.faxsSimileIntestazioneView + '"' + this.nomeTabella + '"' + ' (';

                for (let index = this.listaProprieta.length - 1; index >= 0; index--) {
                    const element = this.listaProprieta[index];
                    ritornoTmp = ritornoTmp + " " + element.nome + " ";
                    if (index - 1 >= 0) ritornoTmp = ritornoTmp + ', ';

                }
                ritornoTmp = ritornoTmp + " )\n AS " + this.queryPerVista + '\n';
            }


            elencoQuery.push(ritornoTmp); //CREAZIONE TABELLA :CREATE NEW TABLE ECC..

            /*  */
            //elencoQuery.push(`ALTER TABLE ${this.nomeTabella} ENABLE ROW LEVEL SECURITY;`);

            ritornoTmp = '';
            /* Ora che la tabella esiste vado ad eseguire i trigger */
            for (let index = 0; index < this.listaProprieta.length; index++) {
                const element = this.listaProprieta[index];
                element.CostruisceTrigger(this.nomeTabella, elencoQuery);
            }
            if (this.abilitaDeletedAt && this.abilitaUpdatedAt && this.queryPerVista == undefined) {
                elencoQuery.push(TriggerUpdate(this.nomeTabella));
            }
            if (this.abilitaDeletedAt && this.abilitaUpdatedAt && this.queryPerVista == undefined) {
                elencoQuery.push(TriggerDeleted_at(this.nomeTabella));
            }
        }
        return ritornoTmp;

    }
    CostruisciRelazioniDB(/* client: Client */elencoQuery: string[]) {
        let ritorno = '';
        /* if (this.estende) {
            const query = `ALTER TABLE ${this.nomeTabella} INHERIT ${this.estende};`
            EseguiQueryControllata(client, query);
        } */
        for (let index = 0; index < this.listaProprieta.length; index++) {
            const element = this.listaProprieta[index];
            const tmp = element.CostruisciRelazioniDB(this.nomeTabella);
            ritorno = ritorno + '\n' + tmp;
            elencoQuery.push(tmp);
        }
        return ritorno;
    }
    CostruisceGrant(grants: IGrant[],/*  client: Client */ elencoQuery: string[]) {
        let ritorno = '';
        for (let index = 0; index < grants.length; index++) {
            const element = grants[index];
            const eventitesto = CostruisciEvents(element.events);
            const ruolitesto = CostruisciRuoli(element.ruoli);
            const tmp = `GRANT ${eventitesto} 
            ON ${this.nomeTabella} 
            TO ${ruolitesto}
            ;`;
            elencoQuery.push(tmp);
            ritorno = ritorno + '\n' + tmp;
        }
        for (let index = 0; index < this.listaProprieta.length; index++) {
            const element = this.listaProprieta[index];

            for (let index = 0; element.grants && index < element.grants.length; index++) {
                const element2 = element.grants[index];
                const eventitesto = CostruisciEvents(element2.events, element.nome);
                const ruolitesto = CostruisciRuoli(element2.ruoli);
                const tmp = `GRANT ${eventitesto} 
                ON "${this.nomeTabella}" 
                TO ${ruolitesto}
                ;`;
                elencoQuery.push(tmp);
                ritorno = ritorno + '\n' + tmp;
            }
        }
        return ritorno;
    }
}

export function TriggerDeleted_at(nomeTabella: string) {
    return `CREATE INDEX IF NOT EXISTS idx_somethings_deleted_at ON ${nomeTabella} (deleted_at ASC);`;
}
export function TriggerUpdate(nomeTabella: string) {
    return `DROP TRIGGER IF EXISTS tr_somethings_updated_at ON ${nomeTabella};
        CREATE TRIGGER tr_somethings_updated_at
        BEFORE UPDATE
        ON ${nomeTabella}
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();`
}
export function CostruisciFunzione(item: any, nomeFunzioneCheck: string, nomePolicy: string, typeFunctionCheck: string,
    carattere: string | 'CK' | 'US', /* client: Client */elencoQuery: string[]): string {
    let corpoFunzione = '';
    if (item) {
        if (typeof item === 'function') {
            const strg = String(item);

            const tt = strg.indexOf('{');
            const t1 = strg.substring(tt + 1, strg.length);
            const t2 = t1.lastIndexOf('}');
            const t3 = t1.substring(0, t2 - 1);
            corpoFunzione = t3;
            console.log(strg);
        }
        else {
            corpoFunzione = String(item);
        }

        const tmp = `
                CREATE OR REPLACE FUNCTION "${carattere}_FN_${nomeFunzioneCheck}_xTR_${nomePolicy}"() RETURNS boolean AS
                $$
                    ${corpoFunzione}
                $$
                LANGUAGE "${typeFunctionCheck ?? 'plv8'}";
                `;
        const ritorno = '' + carattere + '_FN_' + nomeFunzioneCheck + '_xTR_' + nomePolicy + '';
        //await EseguiQueryControllata(client, tmp);
        elencoQuery.push(tmp);
        return ritorno;
    }
    return '';
}
export function CostruisciRuoli(ruoli: string[]) {
    let ritorno = '';
    for (let index = 0; index < ruoli.length; index++) {
        const element = ruoli[index];
        ritorno = ritorno + element;
        if (ruoli.length >= 2 && index + 1 < ruoli.length) {
            ritorno = ritorno + ', ';
        }
    }
    return ritorno;
}
export function CostruisciEvents(events: typeGrantEvent[], nome?: string) {
    let ritorno = '';
    for (let index = 0; index < events.length; index++) {
        const element = events[index];
        if (nome) {
            ritorno = ritorno + element + '("' + nome + '")';
        } else {
            ritorno = ritorno + element;
        }
        if (events.length >= 2 && index + 1 < events.length) {
            ritorno = ritorno + ', ';
        }
    }
    return ritorno;
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

export interface ReturnQueryControllata {
    risultato?: string, errore?: {
        query: string,
        errore: string
    }, index: number
}
export async function EseguiQueryControllata(client: Client, query: string): Promise<ReturnQueryControllata> {
    try {
        if (query != "") {
            const result = await client.query(query);
            console.log('ESEGUITOO : \n' + query);
            return {
                index: 0,
                errore: undefined,
                risultato: query
            }
        }
        return {
            index: 0,
            errore: undefined,
            risultato: query
        }
    } catch (error) {
        console.log('\n\nINIZIO Errroe : \n**********************\n\n');
        console.log('-Query:\n' + query + '\n\n');
        console.log('-Error:\n' + error);
        console.log('\n\nFINE Errroe : \n**********************\n\n');
        return {
            index: 0,
            errore: {
                query: query,
                errore: '' + error
            },
            risultato: undefined
        }
    }
}