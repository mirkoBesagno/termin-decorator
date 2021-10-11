import { Client } from "pg";
import { CostruisciFunzione, CostruisciRuoli, EseguiQueryControllata } from "../postgres/tabella";
import { IPolicy } from "../utility";

export class ListaPolicy extends Array<Policy> {
    nomeTabella: string;
    constructor(item?: IPolicy[], nomeTabella?: string) {
        super();
        if (item) {
            for (let index = 0; index < item.length; index++) {
                const element = item[index];
                element.tabellaDestinazione= nomeTabella;
                this.push(new Policy(element))
            }
        }
        if (nomeTabella) this.nomeTabella = nomeTabella;
        else this.nomeTabella = '';
    }
    async CostruiscePolicySicurezza(/* client: Client */elencoQuery: string[]) {
        let ritorno = '';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = await element.CostruiscePolicySicurezza(elencoQuery, this.nomeTabella);
            ritorno = ritorno + '' + tmp;
        }
        return ritorno;
    }
}

export class Policy implements IPolicy {
    nomePolicy: string;
    tabellaDestinazione?: string;
    ruoli: string[];
    azieneScatenente: 'SELECT' | 'UPDATE' | 'DELET' | 'INSERT' | 'ALL';
    using?: string | ((NEW: any, OLD: any) => void | true | Error);
    check?: string | ((NEW: any, OLD: any) => void | true | Error);
    typeFunctionCheck?: 'plv8' | 'sql';
    typeFunctionUsing?: 'plv8' | 'sql';
    nomeFunzioneCheck?: string;
    nomeFunzioneUsing?: string;

    constructor(item: IPolicy) {
        this.nomePolicy = item.nomePolicy;
        this.tabellaDestinazione = item.tabellaDestinazione;
        this.ruoli = item.ruoli;
        this.azieneScatenente = item.azieneScatenente;
        this.using = item.using;
        this.check = item.check;
        this.typeFunctionCheck = item.typeFunctionCheck;
        this.typeFunctionUsing = item.typeFunctionUsing;
        this.nomeFunzioneCheck = item.nomeFunzioneCheck;
        this.nomeFunzioneUsing = item.nomeFunzioneUsing;
    }

    async CostruiscePolicySicurezza(/* client: Client */elencoQuery: string[], nomeTabella: string) {
        let ritorno = '';
        const ruolitesto = CostruisciRuoli(this.ruoli);
        const nomeFunzioneCK = await CostruisciFunzione(this.check, this.nomeFunzioneCheck ?? '', this.nomePolicy, this.typeFunctionCheck ?? 'psql', 'CK', elencoQuery);
        const nomeFunzioneUS = await CostruisciFunzione(this.using, this.nomeFunzioneUsing ?? '', this.nomePolicy, this.typeFunctionUsing ?? 'psql', 'US', elencoQuery);

        try {
            //COMMENT ON FUNCTION "FN_${this.nomeFunzione}"() IS 'Hei tanto roba questa è scritta usando plv8!!';
            const queri1 = `
                    CREATE POLICY "PO_MP_${this.nomePolicy}"
                        ON ${nomeTabella}
                        FOR ${this.azieneScatenente}
                        TO ${ruolitesto}
                        ${this.using && nomeFunzioneUS != "" ? 'USING "' + nomeFunzioneUS + '"()' : ''}
                        ${this.check && nomeFunzioneCK != "" ? 'WITH CHECK ("' + nomeFunzioneCK + '"())' : ''} 
                        ;
                    `;
            ritorno = ritorno + '\n' + queri1 + '\n';
            //await EseguiQueryControllata(client, queri1);
            elencoQuery.push(queri1);
        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
        }
        return ritorno;
    }
}