
import Knex from "knex";
import { Test1 } from "../esempio/test1";


export async function Testing() {
    const client = Knex({
        client: 'pg',
        connection: {
            user: 'utente1',
            host: 'localhost',
            database: 'test',
            password: 'utente1',
            port: 5432
        }
    });

    let result: any = {};
    let result2: any = {};
    let result3: any = {};

    try {
        result = await client.select().table('test1');

    } catch (error) {
        console.log(error);
    }

    try {
        result2 = await client<Test1>('test1').select();
    } catch (error) {
        console.log(error);
    }

    try {
        result3 = await client.select().from('test1');
    } catch (error) {
        console.log(error);
    }
}


Testing();