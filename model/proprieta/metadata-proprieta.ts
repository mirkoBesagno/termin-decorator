import { TerminaleParametro } from "../parametro/metadata-parametro";
import { IParametro, IRitornoValidatore, tipo } from "../utility";



export class TerminaleProprieta {

    valore: any;
    nome: string;
    tipo: tipo;

    descrizione: string;
    sommario: string;


    Validatore?: (parametro: any) => IRitornoValidatore;
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
        return this.nome + '   text';
    }
}