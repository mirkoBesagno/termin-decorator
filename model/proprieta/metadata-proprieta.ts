import { TerminaleParametro } from "../parametro/metadata-parametro";
import { IConstraints, IGrant, IParametro, IProprieta, IRitornoValidatore, ITrigger, ORMObject, tipo, TypeIstantevent, TypeSurgevent } from "../utility";
import { Client, types } from "pg";


export class TerminaleProprieta implements IProprieta {

    //funzione 
    Constraints?: IConstraints;
    /*  */


    valore: any;
    nome: string;
    tipo: tipo;

    descrizione: string;
    sommario: string;

    trigger?: ITrigger[];
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
            if (this.Constraints.unique) tmpRitorno = tmpRitorno + ' CONSTRAINT ' + '"' + 'cn_' + nomeClasse + '_' + this.Constraints.unique.nome + '"' + ' UNIQUE';
            if (this.Constraints.notNull) tmpRitorno = tmpRitorno + ' NOT NULL';
            if (this.Constraints.check) tmpRitorno = tmpRitorno + ' CONSTRAINT ' + '"' + 'cn_ck_' + nomeClasse + '_' + this.Constraints.check.nome + '"' + ' CHECK(' + this.Constraints.check.check + ')';
        }
        return tmpRitorno;
    }
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
    async CostruisceTrigger(nomeTabella: string, client: Client,) {
        for (let index = 0; this.trigger && index < this.trigger.length; index++) {
            const element = this.trigger[index];
            let tmp = '';
            for (let index = 0; index < element.surgevent.length; index++) {
                const el = element.surgevent[index];
                tmp = tmp + el;
                if (index + 1 < element.surgevent.length) {
                    tmp = tmp + ' OR ';
                }
            }
            let corpoFunzione = '';
            try {
                if (typeof element.Validatore === 'function') {
                    const strg = String(element.Validatore);

                    const tt = strg.indexOf('{');
                    const t1 = strg.substring(tt + 1, strg.length);
                    const t2 = t1.lastIndexOf('}');
                    const t3 = t1.substring(0, t2 - 1);
                    corpoFunzione = t3;
                    console.log(strg);
                }
                else {
                    corpoFunzione = String(element.Validatore);
                }

            } catch (error) {
                console.log('\n*****\n' + error + '\n********\n\n');
                corpoFunzione = '';
            }
            try {
                const queri1 = `
                CREATE OR REPLACE FUNCTION "FN_${element.nomeFunzione}"() RETURNS trigger AS
                $$
                    ${corpoFunzione}
                $$
                LANGUAGE "${element.typeFunction ?? 'plv8'}";
        
                COMMENT ON FUNCTION "FN_${element.nomeFunzione}"() IS 'Hei tanto roba questa è scritta usando plv8!!';
        
                DROP TRIGGER IF EXISTS "TR_${element.nomeTrigger}" ON persona;
        
                CREATE TRIGGER "TR_${element.nomeTrigger}"
                    ${element.instantevent} 
                    ${tmp} 
                    ON ${nomeTabella} 
                    FOR EACH ROW
                    EXECUTE PROCEDURE "FN_${element.nomeFunzione}"();
                `;
                await client.query(queri1);
            } catch (error) {
                console.log('\n*****\n' + error + '\n********\n\n');
            }
        }

    }
}