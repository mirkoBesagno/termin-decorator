import { Main } from ".";
import { IReturnTest } from "./model/test-funzionale/utility-test-funzionale";
import { Client } from "pg";
import { Persona } from "./esempio/persona";
import { Maggiordomo } from "./esempio/maggiordomo";


const main = new Main('api');


main.Inizializza("localhost", 8080, true, true);


const persone = new Persona('mirko io persona', '3543543534');
const magg = new Maggiordomo('magg mirko', 'magg mirko');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'postgres',
    port: 5432,
});


client.connect().then(async (result) => {



    const orm = await main.InizializzaORM(client, 'test', [
        {
            nome: 'utente1',
            password: 'password1',
            inRole: [], inGroup: [], connectionLimit: 1,
            option: {
                creaDB: false, creaTabelle: false, creaUser: false, isSuperUser: false,
                login: true
            }
        },
        {
            nome: 'utente2',
            password: 'password2',
            inRole: [], inGroup: [], connectionLimit: 2,
            option: {
                creaDB: false, creaTabelle: false, creaUser: false, isSuperUser: false,
                login: true
            }
        }
    ]);
    console.log('\n\n\n\n' + orm + '\n\n\n\n\n\n');

    console.log('*******');
    console.log('\n\n\n');
    console.log(orm);
    console.log('\n\n\n');
    console.log('*******');

})
    .catch((err: any) => {
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

