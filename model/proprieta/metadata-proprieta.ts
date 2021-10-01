import { TerminaleParametro } from "../parametro/metadata-parametro";
import { IParametro, IProprieta, IRitornoValidatore, tipo } from "../utility";
import { Client, types } from "pg";

export type TypeIstantevent='BEFORE' | 'AFTER' | 'INSTEAD OF';

export type TypeSurgevent= 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';

export class TerminaleProprieta implements IProprieta {

    valore: any;
    nome: string;
    tipo: tipo;

    descrizione: string;
    sommario: string;

    trigger?: [
        {
            instantevent: TypeIstantevent[],
            surgevent: TypeSurgevent[],
            nomeTrigger: string,
            nomeFunzione: string,
            Validatore: (nuovo: any, vecchio: any, argomenti: any[], instantevent: any, surgevent: any) => void | Error;
        }
    ]

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
                    this.valore = new Date(this.valore);
                    break;
                case 'number':
                    this.valore = Number(this.valore);
                    break;
                case 'object':
                    this.valore = Object(this.valore);
                    break;
                case 'text':
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
                    valore = new Date(valore);
                    break;
                case 'number':
                    valore = Number(valore);
                    break;
                case 'object':
                    valore = Object(valore);
                    break;
                case 'text':
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
    CostruisciCreazioneDB(): string {
        switch (this.tipo) {
            case 'array': return this.nome + " varchar(255)";
            case 'boolean': return this.nome + " varchar(255)";
            case 'date': return this.nome + " varchar(255)";
            case 'number': return this.nome + " varchar(255)";
            case 'object': return this.nome + " varchar(255)";
            case 'text': return this.nome + " varchar(255)";
            case 'any': break;
            default: return this.nome + " varchar(255)";
        }



        return this.nome + " varchar(255)";
    }
    async CostruisceTrigger(nomeTabella: string, client: Client,) {
        for (let index = 0; this.trigger && index < this.trigger.length; index++) {
            const element = this.trigger[index];
            try {
                await client.query(`
                CREATE OR REPLACE FUNCTION FN_${element.nomeFunzione}() RETURNS trigger AS
                $$
                    if (NEW.nome != 'mirko'){   
                        plv8.elog(INFO, 'HELLO', 'Messaggio di saluto sei passato!') 
                        return NEW;
                    }
                    else{
                    throw new Error('Attenzione nome Mirko, illegale'); 
                    }
                $$
                LANGUAGE "plv8";
        
                COMMENT ON FUNCTION FN_${element.nomeFunzione}() IS 'Hei tanto roba questa è scritta usando plv8!!';
        
                DROP TRIGGER IF EXISTS TR_${element.nomeTrigger} ON persona;
        
                CREATE TRIGGER TR_${element.nomeTrigger}
                    BEFORE 
                    INSERT OR UPDATE 
                    ON ${nomeTabella} 
                    FOR EACH ROW
                    EXECUTE PROCEDURE FN_${element.nomeFunzione}();
                `);
            } catch (error) {
                console.log(error);
            }
        }

    }
}