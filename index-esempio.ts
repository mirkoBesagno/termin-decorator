import { Main } from ".";
import { IReturnTest } from "./model/test-funzionale/utility-test-funzionale";
import { Client } from "pg";
import { Persona } from "./esempio/persona";
import { Maggiordomo } from "./esempio/maggiordomo";
import { Test1, Test2, Test3 } from "./esempio/test1";
import { EseguiQueryControllata, ReturnQueryControllata } from "./model/postgres/tabella";


const main = new Main('api');


main.Inizializza("localhost", 8080, true, true);


/* const persone = new Persona('mirko io persona', '3543543534');
const magg = new Maggiordomo('magg mirko', 'magg mirko'); */
const test1 = new Test1('nome test1');
const test2 = new Test2('nome test1');
const test3 = new Test3('x', 'y');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'password',
    port: 5432,
});


client.connect().then(async (result) => {

    const vett: string[] = [];

    const orm = await main.InizializzaORM(vett, 'test', [
        {
            nome: 'admin_admin',
            password: 'password3',
            inRole: [], connectionLimit: 2,
            option: {
                creaDB: false, creaTabelle: false, creaUser: false, isSuperUser: false,
                login: false
            }
        }
    ],
        [
            {
                nome: 'utente1',
                password: 'utente1',
                connectionLimit: 1,
                inRole: ['admin_admin'],
                option: {
                    creaDB: false, creaTabelle: false, creaUser: false, isSuperUser: false,
                    login: true
                }
            },
            {
                nome: 'utente2',
                password: 'utente2',
                connectionLimit: 1,
                inRole: ['admin_admin'],
                option: {
                    creaDB: false, creaTabelle: false, creaUser: false, isSuperUser: false,
                    login: true
                }
            }
        ]);
    console.log('\n!!!!!!?????######\n\n\n\n' + orm + '\n\n\n\n\n\n!!!!!!?????######\n');

    const vetRisultatiQuery: ReturnQueryControllata[] = [];
    for (let index = 0; index < vett.length; index++) {
        const element = vett[index];
        const tmp = await EseguiQueryControllata(client, element);
        tmp.index = index;
        vetRisultatiQuery.push(tmp);
    }

    console.log('*******');
    console.log('\n\n\n');
    /* console.log(orm); */
    console.log('\n\n\n');
    console.log('*******');

    let count = 0;
    const tmp1 = [];
    for (let index = 0; index < vetRisultatiQuery.length; index++) {
        const element = vetRisultatiQuery[index];
        if (element.errore) {
            console.log(element.errore);
            tmp1.push(element.errore);
            count++;
        }
    }
    console.log('*******');
    console.log('\n\n\n');
    console.log('Query finiti in errore: \n');
    /* console.log(orm); */
    console.log(count);
    console.log('\n\n\n');
    console.log('*******');
    const tmp2 = [];
    count = 0;
    for (let index = 0; index < vetRisultatiQuery.length; index++) {
        const element = vetRisultatiQuery[index];
        if (element.risultato) {
            console.log(element.risultato);
            tmp2.push(element.risultato)
            count++;
        }
    }
    console.log('*******');
    console.log('\n\n\n');
    console.log('Query finiti in eseguite: \n');
    /* console.log(orm); */
    console.log(count);
    console.log('\n\n\n');
    console.log('*******');
    count = 0;
}).catch((err: any) => {
    console.log("ciao");
});

main.AggiungiTestAPI([
]);


/* main.AggiungiTest([
    {
        nome: 'Testo la rotta SalutaChiunque()',
        numero: 1,
        numeroRootTest: 0,
        testUnita: {
            nome: '',
            FunzioniDaTestare: () => {
                const persone = new Persona('mirko io persona', '3543543534');
                persone.SalutaChiunque();
                return <IReturnTest>{};
            },
        }
    }
]); */


main.StartHttpServer();

async function AggiungiRiga(count: number, limit: number) {

    setTimeout(async () => {
        try {
            const query = {
                text: 'INSERT INTO persona(nome, cognome) VALUES($1, $2)',
                values: [makeid(Number.parseInt(String(Math.random() * 100))).toString(), makeid(Number.parseInt(String(Math.random() * 100))).toString()],
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

