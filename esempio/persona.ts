import { ListaTerminaleParametro, mpClas, mpMetGen, mpProp } from "..";
import { IMetodoEventi, IMetodoParametri, IParametriEstratti } from "../model/utility";





@mpClas({ percorso: 'persona' },
    {
        nomeTabella: 'persona',
        abilitaCreatedAt: true,
        abilitaDeletedAt: true,
        abilitaUpdatedAt: true,
        creaId: true,
        grants: [
            {
                events: ['INSERT', 'SELECT', 'UPDATE'],
                ruoli: ['utente1']
            }
        ]
    })
export class Persona {

    @mpProp({
        Constraints: {
            unique: { nome: 'uniqueOnNome', unique: true },
            notNull: true,
            check: { nome: 'checkOnNome', check: "nome != 'Ernesto'" }
        },
        descrizione: 'descrizProp',
        tipo: 'text',
        sommario: 'sommarioProp',
        trigger: [
            {
                instantevent: 'BEFORE',
                nomeFunzione: 'controlloNome',
                nomeTrigger: 'controlloNome',
                surgevent: ['INSERT'],
                Validatore: (NEW: Persona, HOLD: Persona, TG_ARGV: any[], /* instantevent */TG_OP: any, /* surgevent */TG_WHEN: any) => {

                    if (NEW.nome == 'Mirko') {
                        throw new Error("Attenzione valore illegale.");
                    }
                }
            }
        ],
        /* grants: [
            {
                events: [], ruoli: []
            }
        ] */
    })
    nome: string;

    @mpProp({
        Constraints: {
            unique: { nome: 'uniqueOnCognome', unique: true },
            notNull: true,
            check: { nome: 'checkOnCognome', check: "cognome != 'Lupino'" }
        },
        descrizione: 'descrizProp',
        tipo: 'text',
        sommario: 'sommarioProp',
        trigger: [
            {
                instantevent: 'BEFORE',
                nomeFunzione: 'controlloCognome',
                nomeTrigger: 'controlloCognome',
                surgevent: ['INSERT'],
                Validatore: (NEW: Persona, HOLD: Persona, TG_ARGV: any[], /* instantevent */TG_OP: any, /* surgevent */TG_WHEN: any) => {

                    if (NEW.cognome == 'Pizzini') {
                        throw new Error("Attenzione valore illegale.");
                    }
                }
            }
        ]
    })
    cognome: string;
    constructor(nome: string, cognome: string) {
        this.nome = nome;
        this.cognome = cognome;
    }

    @mpMetGen()
    SalutaChiunque() {
        return "Ciao";
    }
    @mpMetGen([{ nome: 'nome', tipo: 'text', posizione: 'query' }], <IMetodoParametri>{ tipo: 'get' })
    SalutaConNome(nome: string) {
        return "Ciao " + nome;
    }
    @mpMetGen(undefined, <IMetodoEventi>{
        Istanziatore: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => {
            return new Persona('fjilbsgbjlk dfhjle jhbiasdlgkd', 'dsgsdfgs324567346356');
        }
    })
    SalutaColTuoNome() {
        return "Ciao " + this.nome;
    }
}