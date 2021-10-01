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
        nomeTabella: 'Persona',
        abilitaCreatedAt: true,
        abilitaDeletedAt: true,
        abilitaUpdatedAt: true,
        nomeTriggerAutoCreateUpdated_Created_Deleted: 'TracciamentoOperazioni_I_liv',
        creaId: true
    })
export class Persona implements IPersona {

    @mpProp({
        Trigger:[
            {
                nome:'',
                tempistica: 'Before',
                princevent: 'INSERT',
                funzione:()=>{}
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

            return undefined;
        }
    })
    SalutaColTuoNome() {
        return "Ciao " + this.nome;
    }
}


const main = new Main('api');


main.Inizializza("localhost", 8080, true, true);



const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'password',//'postgres',
    port: 5432,
})
client.connect().then(async (result) => {

    const orm = await main.InizializzaORM(client, 'test');
    console.log('\n\n\n\n'+orm+'\n\n\n\n\n\n');
    
    try {
        await client.query(`CREATE EXTENSION plv8;`);
    } catch (error) {
        console.log(error);
    }
    try {
        await client.query(`
        CREATE OR REPLACE FUNCTION FN_MP_prova_funzione() RETURNS trigger AS
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

        COMMENT ON FUNCTION FN_MP_prova_funzione() IS 'Hei tanto roba questa è scritta usando plv8!!';

        DROP TRIGGER IF EXISTS TR_MP_prova_trigger ON persona;

        CREATE TRIGGER TR_MP_prova_trigger
            BEFORE 
            INSERT OR UPDATE 
            ON persona 
            FOR EACH ROW
            EXECUTE PROCEDURE FN_MP_prova_funzione();
            `);
    } catch (error) {
        console.log(error);
    }
    /* try {

        await client.query(`            
        CREATE OR REPLACE FUNCTION MP_test_trigger_MP_due() RETURNS trigger AS
        $$
            begin
                if new.nome = (
                select p.nome
                from persona p
                where p.nome = new.nome
                ) then
                return null;
                end if;
                return new;
            end;
        $$
        LANGUAGE "plpgsql";

        COMMENT ON FUNCTION MP_test_trigger_MP_due() IS 'Hei tanto roba questa è scritta usando psql!!';


        DROP TRIGGER IF EXISTS MP_test_trigger_MP_due ON persona;

        CREATE TRIGGER MP_test_trigger_MP_due
            BEFORE INSERT OR UPDATE 
            ON persona FOR EACH ROW
            EXECUTE PROCEDURE MP_test_trigger_MP_due();
        `);
    } catch (error) {
        console.log(error);
    } */

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
        console.log(error);
    }
    query = {
        text: 'INSERT INTO persona(nome) VALUES($1)',
        values: ['Mirko'],
    }
    // callback

    try {
        await client.query(query);
    } catch (error) {
        console.log(error);
    }

    try {
        await client.query(query);
    } catch (error) {
        console.log(error);
    }
    query = {
        text: 'INSERT INTO persona(nome) VALUES($1)',
        values: ['mirko'],
    }
    // callback
    try {
        await client.query(query);
    } catch (error) {
        console.log(error);
    }

    const knexClient = knex({
        client: 'postgres',
        connection: {
            user: 'postgres',
            host: 'localhost',
            database: 'test',
            password: 'password',//'postgres',
            port: 5432,
        }
    });

    knexClient.select().from('persona').then(res => {
        console.log(res);
        console.log('');
    }).catch(er => {
        console.log(er);
    });


    //AggiungiRiga(0, 100);

})
    .catch((err: any) => {
        console.log("ciao");
    });

import { knex } from "knex";


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
            console.log(error);
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
