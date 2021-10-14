import { ListaTerminaleParametro, mpClas, mpMetGen, mpProp } from "..";
import { IMetodoEventi, IMetodoParametri, IParametriEstratti } from "../model/utility";


const figa = 'Elisa';
const plv8: any = {};


@mpClas({ percorso: 'test1' },
    {
        nomeTabella: 'test1',
        abilitaCreatedAt: true,
        abilitaDeletedAt: true,
        abilitaUpdatedAt: true,
        creaId: true,
        listaPolicy: [
            {
                azieneScatenente: 'SELECT',
                nomePolicy: 'policytest',
                ruoli: ['utente1'],
                /*check: 'true'  (NEW: any, OLD: any) => {
                    return true;
                } ,
                nomeFunzioneCheck: 'policytest',
                typeFunctionCheck: 'sql'*/
            }
        ],
        grants: [
            {
                events: ['INSERT'],
                ruoli: ['admin_admin']
            },
            {
                events: ['UPDATE'],
                ruoli: ['utente2']
            }
        ]
    })
export class Test1 {

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
                Validatore: (NEW: Test1, HOLD: Test1, TG_ARGV: any[], TG_OP: any, TG_WHEN: any) => {

                    if (NEW.nome.toLocaleLowerCase() == 'luca') {
                        throw new Error("Attenzione Luca non puoi entrare");
                    }
                    if (NEW.nome == 'Mirko') {
                        throw new Error("Attenzione valore illegale.");
                    }
                },
                typeFunction: 'plv8'
            }
        ]/* ,
        grants: [
            {
                events: ['SELECT', 'INSERT'], ruoli: ['admin_admin', 'utente1']
            }
        ] */
    })
    nome: string;

    constructor(nome: string) {
        this.nome = nome;
    }
}


@mpClas({ percorso: 'test2' },
    {
        nomeTabella: 'test2',
        abilitaCreatedAt: true,
        abilitaDeletedAt: true,
        abilitaUpdatedAt: true,
        creaId: true,
        listaPolicy: [
            {
                azieneScatenente: 'SELECT',
                nomePolicy: 'policytest',
                ruoli: ['utente1'],
                /*check: 'true'  (NEW: any, OLD: any) => {
                    return true;
                } ,
                nomeFunzioneCheck: 'policytest',
                typeFunctionCheck: 'sql'*/
            }
        ],
        grants: [
            {
                events: ['INSERT'],
                ruoli: ['admin_admin']
            },
            {
                events: ['UPDATE'],
                ruoli: ['utente2']
            }
        ]
    })
export class Test2 {

    @mpProp({
        Constraints: {
            unique: { nome: 'uniqueOnCognome', unique: true },
            notNull: true,
            check: { nome: 'checkOnCognome', check: "cognome != 'Ernesto'" }
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
                Validatore: (NEW: Test2, HOLD: Test2, TG_ARGV: any[], TG_OP: any, TG_WHEN: any) => {

                    if (NEW.cognome.toLocaleLowerCase() == 'luca') {
                        throw new Error("Attenzione Luca non puoi entrare");
                    }
                    if (NEW.cognome == 'Mirko') {
                        throw new Error("Attenzione valore illegale.");
                    }
                },
                typeFunction: 'plv8'
            }
        ]/* ,
        grants: [
            {
                events: ['SELECT', 'INSERT'], ruoli: ['admin_admin', 'utente1']
            }
        ] */
    })
    cognome: string;

    constructor(cognome: string) {
        this.cognome = cognome;
    }
}

/* @mpView({
    query:`select nome, cognome from test1, test2`,
    variabili:[]
})
export class TestVista {

} */