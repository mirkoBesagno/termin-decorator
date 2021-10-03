import { TerminaleParametro } from "../parametro/metadata-parametro";
import { IConstraints, IParametro, IProprieta, IRitornoValidatore, tipo, TypeIstantevent, TypeSurgevent } from "../utility";
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

    trigger?: [
        {
            instantevent: TypeIstantevent,
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
            case 'array': return this.nome + " int";
            case 'boolean': return this.nome + " bool";
            case 'date': return this.nome + " timestamptz";
            case 'number': return this.nome + " int"; // float8, int, int4, int8, decimal
            case 'object': return this.nome + " int";
            case 'text': return this.nome + " varchar(255)";
            case 'any': return this.nome + " varchar(255)";
            default: return this.nome + " varchar(255)";
        }
        return this.nome + " varchar(255)";
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
                const strg = String(element.Validatore);

                const tt = strg.indexOf('{');
                const t1 = strg.substring(tt + 1, strg.length);
                const t2 = t1.lastIndexOf('}');
                const t3 = t1.substring(0, t2 - 1);
                corpoFunzione = t3;
                console.log(strg);

            } catch (error) {
                console.log('\n*****\n' + error + '\n********\n\n');
                corpoFunzione = '';
            }
            try {
                const queri1 = `
                CREATE OR REPLACE FUNCTION FN_${element.nomeFunzione}() RETURNS trigger AS
                $$
                    ${corpoFunzione}
                $$
                LANGUAGE "plv8";
        
                COMMENT ON FUNCTION FN_${element.nomeFunzione}() IS 'Hei tanto roba questa è scritta usando plv8!!';
        
                DROP TRIGGER IF EXISTS TR_${element.nomeTrigger} ON persona;
        
                CREATE TRIGGER TR_${element.nomeTrigger}
                    ${element.instantevent} 
                    ${tmp} 
                    ON ${nomeTabella} 
                    FOR EACH ROW
                    EXECUTE PROCEDURE FN_${element.nomeFunzione}();
                `;
                await client.query(queri1);
            } catch (error) {
                console.log('\n*****\n' + error + '\n********\n\n');
            }
        }

    }
}