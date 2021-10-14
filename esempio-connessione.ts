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
        const result = await client.query('SELECT * FROM test1;');
        console.log(result);
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }

    let query = {
        text: 'INSERT INTO test1(nome) VALUES($1);',
        values: ['Michele jjj'],
    }
    // callback

    try {
        const result = await client.query(query);
        console.log(result);
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }

    query = {
        text: 'INSERT INTO test1(nome) VALUES($1);',
        values: ['Mirko jjj'],
    }
    // callback

    try {
        const rest = await client.query(query);
        console.log(rest);
    } catch (error) {
        console.log('\n*****\n' + error + '\n********\n\n');
    }

    console.log('svdjabjlv');

    await client.end()


    const magg = new Client({
        user: 'utente2',
        host: 'localhost',
        database: 'test',
        password: 'utente2',
        port: 5432,
    });

    try {
        await magg.connect()
        console.log(result);


        try {
            const result = await magg.query('SELECT * FROM test2;');
            console.log(result);
        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
        }

        let query = {
            text: 'INSERT INTO test2(cognome) VALUES($1);',
            values: ['Carotta jjj'],
        }
        // callback

        try {
            const result = await magg.query(query);
            console.log(result);
        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
        }

        query = {
            text: 'INSERT INTO test2(cognome) VALUES($1);',
            values: ['Pizzini jjj'],
        }
        // callback

        try {
            const rest = await magg.query(query);
            console.log(rest);
        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
        }

        console.log('svdjabjlv');
        console.log('passato');
    } catch (error) {
        console.log(error);

        console.log("errore");
    }


    await magg.end()

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
