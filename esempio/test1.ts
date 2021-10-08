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
        policySicurezza: [
            {
                azieneScatenente: 'UPDATE',
                nomePolicy: 'policytest',
                ruoli: ['admin_admin'],
                check: (NEW: any, OLD: any) => {
                    return true;
                },
                nomeFunzioneCheck: 'policytest',
                typeFunctionCheck: 'plv8'
            }
        ]/* ,
        grants: [
            {
                events: ['INSERT'],
                ruoli: ['admin_admin']
            }
        ]  */
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
                }
            }
        ],
        grants: [
            {
                events: ['SELECT'], ruoli: ['admin_admin']
            }
        ]
    })
    nome: string;

    constructor(nome: string) {
        this.nome = nome;
    }
}