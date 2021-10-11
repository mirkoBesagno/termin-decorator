import { Client } from "pg";

const client = new Client({
    user: 'utente1',
    host: 'localhost',
    database: 'test',
    password: 'utente1',
    port: 5432,
});
/* const client = new Client({
    user: 'utente2',
    host: 'localhost',
    database: 'test',
    password: 'utente2',
    port: 5432,
}); */
/* const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'postgres',
    port: 5432,
}); */

client.connect().then(async (result: any) => {
    console.log(result);

    try {
        await client.query('SELECT * FROM test1;');
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }

    let query = {
        text: 'INSERT INTO test1(nome) VALUES($1);',
        values: ['Mag Michele jj'],
    }
    // callback

    try {
        await client.query(query);
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }

    query = {
        text: 'INSERT INTO persona(nome, cognome) VALUES($1, $2)',
        values: ['Michele', 'Carotta'],
    }
    // callback

    try {
        await client.query(query);
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }

    console.log('svdjabjlv');

    await client.end()


    /*  const magg = new Client({
         user: 'utente2',
         host: 'localhost',
         database: 'test',
         password: 'password2',
         port: 5432,
     });
 
     try {
         await magg.connect()
         console.log(result);
 
         console.log('passato');
     } catch (error) {
         console.log(error);
 
         console.log("errore");
     }
 
 
     await magg.end() */
}).catch((err: any) => {
    console.log(err);

    console.log("errore");
});





/*
const per = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'password',
    port: 5432,
});

client.connect().then(async (result: any) => {
    console.log(result);

    console.log('ciao');
}).catch((err: any) => {
    console.log("ciao");
}); */
