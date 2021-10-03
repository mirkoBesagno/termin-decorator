import { ListaTerminaleParametro, Main, mpClas, mpMet, mpMetGen, mpPar, IParametriEstratti, mpProp } from ".";
import { IReturnTest } from "./model/test-funzionale/utility-test-funzionale";
import { IMetodoEventi, IMetodoParametri } from "./model/utility";
import { Client } from "pg";

interface IPersona {
    nome: string
}
/* 

*/
@mpClas({ percorso: 'persona' },
    {
        nomeTabella: 'persona',
        abilitaCreatedAt: true,
        abilitaDeletedAt: true,
        abilitaUpdatedAt: true,
        nomeTriggerAutoCreateUpdated_Created_Deleted: 'TracciamentoOperazioni_I_liv',
        creaId: true
    })
export class Persona implements IPersona {

    @mpProp({
        descrizione: 'descrizProp',
        tipo: 'text',
        sommario: 'sommarioProp',
        valore: 'valoreProp',
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
        ]
    })
    nome: string;

    constructor(nome: string) {
        this.nome = nome;
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

            return new Persona('fjilbsgbjlk dfhjle jhbiasdlgkd');
        }
    })
    SalutaColTuoNome() {
        return "Ciao " + this.nome;
    }
}

@mpClas({ percorso: 'maggiordomo' },
    {
        nomeTabella: 'maggiordomo',
        estende: 'persona',
        abilitaCreatedAt: true,
        abilitaDeletedAt: true,
        abilitaUpdatedAt: true,
        nomeTriggerAutoCreateUpdated_Created_Deleted: 'TracciamentoOperazioni_I_liv',
        creaId: true
    })
export class Maggiordomo extends Persona {

    personaRiferimento: Persona;

    gradoDiLavoro?: number;

    constructor() {
        super('ciao');
        this.personaRiferimento = new Persona('nome default');
    }

}


const main = new Main('api');


main.Inizializza("localhost", 8080, true, true);

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'postgres',
    port: 5432,
})
client.connect().then(async (result) => {

    try {
        await client.query(`CREATE EXTENSION plv8;`);
    } catch (error) {
        console.log('\n\n****\n' + error + '\n****\n\n');
    }

    const orm = await main.InizializzaORM(client, 'test');
    console.log('\n\n\n\n' + orm + '\n\n\n\n\n\n');

    console.log('*******');
    console.log('\n\n\n');
    console.log(orm);
    console.log('\n\n\n');
    console.log('*******');

    let query = {
        text: 'INSERT INTO persona(nome) VALUES($1)',
        values: ['Michele'],
    }
    // callback

    try {
        await client.query(query);
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }
    query = {
        text: 'INSERT INTO persona(nome) VALUES($1)',
        values: ['Mirko'],
    }
    // callback

    try {
        await client.query(query);
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }

    query = {
        text: 'INSERT INTO persona(nome) VALUES($1)',
        values: ['mirko'],
    }
    // callback
    try {
        await client.query(query);
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }

    /* const knexClient = knex({
        client: 'postgres',
        connection: {
            user: 'postgres',
            host: 'localhost',
            database: 'test',
            password: 'password',//'postgres',
            port: 5432,
        }
    }); */

    /* knexClient.select().from('persona').then(res => {
        console.log(res);
        console.log('');
    }).catch((er: any) => {
        console.log(er);
    }); */


    //AggiungiRiga(0, 100);

})
    .catch((err: any) => {
        console.log("ciao");
    });


main.AggiungiTest([
    {
        nome: 'Testo la rotta SalutaChiunque()',
        numero: 1,
        numeroRootTest: 0,
        testUnita: {
            nome: '',
            FunzioniDaTestare: () => {
                const persone = new Persona('mirko io persona');
                persone.SalutaChiunque();
                return <IReturnTest>{};
            },
        }
    }
]);


main.StartHttpServer();

async function AggiungiRiga(count: number, limit: number) {

    setTimeout(async () => {
        try {
            const query = {
                text: 'INSERT INTO persona(nome) VALUES($1)',
                values: [makeid(Number.parseInt(String(Math.random() * 100))).toString()],
            }
            // callback
            await client.query(query);

            if (count < limit) {
                count++;
                AggiungiRiga(count, limit);
            }
        } catch (error) {
            console.log('\n\nINIZIO Errroe : \n**********************\n\n');
            console.log('\n*****\n' + error + '\n********\n\n');
            console.log('\n\nFINE Errroe : \n**********************\n\n');
        }
    }, 3000)

}

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
