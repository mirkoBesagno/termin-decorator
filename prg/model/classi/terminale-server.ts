
import { ConnectionOptions, createConnection, getConnectionManager } from "typeorm";


export class TerminaleServer {
    async TMP() {
        const connectionManager = getConnectionManager();
        const connection = connectionManager.create({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "test",
            password: "test",
            database: "test",
        });
        await connection.connect().then(async connection => {
            //connection.manager.create(<LogBaseIn>{body:'',data:'',header:'',id:'',local:'',query:'',remote:'',url:''});
            await connection.close();

        }, error => console.log("Cannot connect: ", error));
    }
}