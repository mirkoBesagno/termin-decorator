import { Client } from "pg";
import { CostruisciFunzione, CostruisciRuoli, EseguiQueryControllata } from "../classe/metadata-classe";
import { IPolicy } from "../utility";


class Policy implements IPolicy {


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

    async CostruiscePolicySicurezza(client: Client, nomeTabella: string) {
        let ritorno = '';
        /*  grants[0]. */
        const ruolitesto = CostruisciRuoli(this.ruoli);
        const nomeFunzioneCK = await CostruisciFunzione(this.check, this.nomeFunzioneCheck ?? '', this.nomePolicy, this.typeFunctionCheck ?? 'psql', 'CK', client);
        const nomeFunzioneUS = await CostruisciFunzione(this.using, this.nomeFunzioneUsing ?? '', this.nomePolicy, this.typeFunctionUsing ?? 'psql', 'US', client);

        /*  */
        try {
            //COMMENT ON FUNCTION "FN_${this.nomeFunzione}"() IS 'Hei tanto roba questa è scritta usando plv8!!';
            const queri1 = `

                    CREATE POLICY "PO_MP_${this.nomePolicy}"
                        ON "${nomeTabella}" 
                        FOR ${this.azieneScatenente}
                        TO ${ruolitesto}
                        ${this.using && nomeFunzioneUS != "" ? 'USING "' + nomeFunzioneUS + '"()' : ''}
                        ${this.check && nomeFunzioneCK != "" ? 'WITH CHECK ("' + nomeFunzioneCK + '"())' : ''} 
                        ;
                    `;
            await EseguiQueryControllata(client, queri1);
        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
        }
        ritorno = ritorno + '' /* tmp */;
        return ritorno;
    }
}