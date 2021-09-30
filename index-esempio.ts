import { ListaTerminaleParametro, Main, mpClas, mpMet, mpMetGen, mpPar, IParametriEstratti, mpProp } from ".";
import { IReturnTest } from "./model/test-funzionale/utility-test-funzionale";
import { IMetodoEventi, IMetodoParametri } from "./model/utility";
import { Client } from "pg";
import { randomUUID } from "crypto";

/* 

*/
@mpClas({ percorso: 'persona' }, { nomeTabella: 'Persona', abilitaCreatedAt: true, abilitaDeletedAt: true, abilitaUpdatedAt: true, nomeTriggerAutoCreateUpdated_Created_Deleted: 'TracciamentoOperazioni_I_liv' })
export class Persona {

    @mpProp()
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
    password: 'password',
    port: 5432,
})
client.connect().then(async (result) => {

    const orm = await main.InizializzaORM(client, 'test');

    console.log('*******');
    console.log('\n\n\n');
    console.log(orm);
    console.log('\n\n\n');
    console.log('*******');


    AggiungiRiga(0,100);

}).catch((err: any) => {
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
                values: [randomUUID().toString()],
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
