
import { IGrant, IProprieta, ITrigger, ORMObject, tipo } from "../utility";
import { Trigger } from "../postgres/trigger";
import { Constraint } from "../postgres/constraint";


export class TerminaleProprieta implements IProprieta {

    //funzione 
    Constraints?: Constraint;
    /*  */


    valore: any;
    nome: string;
    tipo: tipo;

    descrizione: string;
    sommario: string;

    trigger?: Trigger[];
    grants?: IGrant[];

    constructor(nome: string, tipo: tipo) {
        this.nome = nome;
        this.tipo = tipo;

        this.descrizione = "";
        this.sommario = "";
    }

    Verifica(): boolean {
        try {
            switch (this.tipo) {
                case 'array':
                    this.valore = Array(this.valore);
                    break;
                case 'boolean':
                    this.valore = Boolean(this.valore);
                    break;
                case 'date':
                case 'timestamptz':
                    this.valore = new Date(this.valore);
                    break;
                case 'decimal':
                case 'smallint':
                case 'integer':
                case 'numeric':
                case 'real':
                case 'smallserial':
                case 'serial':
                    this.valore = Number(this.valore);
                    break;
                case 'object':
                    this.valore = Object(this.valore);
                    break;
                case 'text':
                case 'varchar(n)':
                case 'character(n)':
                    this.valore = String(this.valore);
                    break;
                case 'any': break;
                default:
                    return false;
            }
            return true;
        } catch (error) {
            console.log('ciao');
            throw error;
        }
    }
    static Verifica(tipo: tipo, valore: any): boolean {
        try {
            switch (tipo) {
                case 'array':
                    valore = Array(valore);
                    break;
                case 'boolean':
                    valore = Boolean(valore);
                    break;
                case 'date':
                case 'timestamptz':
                    valore = new Date(valore);
                    break;
                case 'decimal':
                case 'smallint':
                case 'integer':
                case 'numeric':
                case 'real':
                case 'smallserial':
                case 'serial':
                    valore = Number(valore);
                    break;
                case 'object':
                    valore = Object(valore);
                    break;
                case 'text':
                case 'varchar(n)':
                case 'character(n)':
                    valore = String(valore);
                    break;
                case 'any': break;
                default:
                    return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }
    AppoggioCostruzioneStringa(item: tipo) {
        let tmpRitorno = '';
        switch (item) {
            //ARRAY
            case 'array': tmpRitorno = '"' + this.nome + '"' + " int"; break;
            //BOOLEAN
            case 'boolean': tmpRitorno = '"' + this.nome + '"' + " bool"; break;
            //DATE :
            case 'timestamptz': tmpRitorno = '"' + this.nome + '"' + " timestamptz"; break;
            case 'date': tmpRitorno = '"' + this.nome + '"' + " date"; break;
            //
            //NUMBER : case 'number': tmpRitorno = '"' + this.nome + '"' + " int"; break; // float8, int, int4, int8, decimal
            case 'decimal': tmpRitorno = '"' + this.nome + '"' + " decimal"; break;
            case 'smallint': tmpRitorno = '"' + this.nome + '"' + " smallint"; break;
            case 'integer': tmpRitorno = '"' + this.nome + '"' + " integer"; break;
            case 'numeric': tmpRitorno = '"' + this.nome + '"' + " numeric"; break;
            case 'real': tmpRitorno = '"' + this.nome + '"' + " real"; break;
            case 'smallserial': tmpRitorno = '"' + this.nome + '"' + " smallserial"; break;
            case 'serial': tmpRitorno = '"' + this.nome + '"' + " serial"; break;
            //
            //STRING :
            case 'text': tmpRitorno = '"' + this.nome + '"' + " text"; break;
            case 'varchar(n)': tmpRitorno = '"' + this.nome + '"' + " varchar(255)"; break;
            case 'character(n)': tmpRitorno = '"' + this.nome + '"' + " character(255)"; break;
            //
            //ANY
            case 'any': tmpRitorno = '"' + this.nome + '"' + " varchar(255)"; break;
            default: tmpRitorno = '"' + this.nome + '"' + " varchar(255)"; break;
        }
        return tmpRitorno;
    }
    CostruisciCreazioneDB(nomeClasse: string): string {
        let tmpRitorno = '';
        if (this.tipo instanceof ORMObject) {
            /* Qui creo alter table ecc.. */
            tmpRitorno = this.AppoggioCostruzioneStringa(this.tipo.colonnaRiferimento);
        }
        else {
            tmpRitorno = this.AppoggioCostruzioneStringa(this.tipo);
        }
        if (this.Constraints) {
            tmpRitorno = tmpRitorno + this.Constraints.CostruisciConstraint(nomeClasse)
        }
        return tmpRitorno;
    }
    /* CostruisciCkeck(element: ICheck, client: Client) {

        let corpoFunzione = '';
        try {
            if (typeof element.check === 'function') {
                const strg = String(element.check);

                const tt = strg.indexOf('{');
                const t1 = strg.substring(tt + 1, strg.length);
                const t2 = t1.lastIndexOf('}');
                const t3 = t1.substring(0, t2 - 1);
                corpoFunzione = t3;
                console.log(strg);
            }
            else {
                corpoFunzione = String(element.check);
                return '';
            }

        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
            corpoFunzione = '';
        }
        const tmp = `
        CREATE OR REPLACE FUNCTION "FN_cn_ck_${element.nome}"() RETURNS boolean AS
        $$
            ${corpoFunzione}
        $$
        LANGUAGE "plv8";
        `
        EseguiQueryControllata(client, tmp);
        return 'FN_cn_ck_' + element.nome;
    } */
    CostruisciRelazioniDB(nomeTabella: string) {
        let tmpRitorno = '';
        if (this.tipo instanceof ORMObject) {
            /* Qui creo alter table ecc.. */
            tmpRitorno = `ALTER TABLE ${nomeTabella}
            ADD CONSTRAINT "CO_${nomeTabella}_${this.tipo.tabellaRiferimento}" 
            FOREIGN KEY ("${this.nome}") 
            REFERENCES "${this.tipo.tabellaRiferimento}" (id)
            on delete ${this.tipo.onDelete ?? 'NO ACTION'}
            on update ${this.tipo.onUpdate ?? 'NO ACTION'}; `;//${parent_key_columns}
        }
        return tmpRitorno;
    }

    CostruisciListaTrigger(vet: ITrigger[]) {
        this.trigger = [];
        for (let index = 0; index < vet.length; index++) {
            const element = vet[index];
            this.trigger.push(new Trigger(element));
        }
    }
    async CostruisceTrigger(nomeTabella: string, elencoQuery: string[]/* client: Client */) {
        if (this.trigger) {
            for (let index = 0; index < this.trigger.length; index++) {
                const element = this.trigger[index];
                const query = element.CostruisceTrigger(nomeTabella);
                //await EseguiQueryControllata(client, query??'');
                if (query)
                    elencoQuery.push(query);
            }
        }
    }
}