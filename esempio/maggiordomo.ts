import { mpClas, mpProp } from "..";
import { Persona } from "./persona";



@mpClas({ percorso: 'maggiordomo' },
    {
        nomeTabella: 'maggiordomo',
        /* estende: 'persona', like:'persona', */
        abilitaCreatedAt: true,
        abilitaDeletedAt: true,
        abilitaUpdatedAt: true,
        nomeTriggerAutoCreateUpdated_Created_Deleted: 'TracciamentoOperazioni_I_liv',
        creaId: true,
        policySicurezza: [],
    })
export class Maggiordomo {

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
        grants: [
            {
                events: ['UPDATE'],
                ruoli: ['utente2']
            }
        ]
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

    @mpProp({
        descrizione: 'descrizProp',
        tipo: {
            tipo: 'object',
            colonnaRiferimento: 'serial',
            tabellaRiferimento: 'persona',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        },
        sommario: 'sommarioProp',
    })
    personaRiferimento: Persona;

    @mpProp({
        descrizione: 'descrizProp',
        tipo: 'text',
        sommario: 'sommarioProp',
    })
    gradoDiLavoro?: number;

    constructor(nome: string, cognome: string) {
        //super('nome construct', 'congome construct');
        this.personaRiferimento = new Persona('nome default', 'cognome default');
        this.nome = nome;
        this.cognome = cognome;
    }

}