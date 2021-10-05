


export class Role {
    nome: string;
    option: {
        isSuperUser: boolean,
        creaTabelle: boolean,
        creaDB: boolean,
        creaUser: boolean,
        login: boolean,
        connectionLimit?: number,
        passwordCriptografia?: string,
        validUntil?: Date
    };
    inGroup: string[];
    inRole: string[];
    connectionLimit: number;
    password: string;

    constructor() {
        this.nome = '';
        this.option = { creaTabelle: false, creaUser: false, login: false, isSuperUser: false, creaDB: false };
        this.inGroup = [];
        this.inRole = [];
        this.connectionLimit = 1;
        this.password = 'password';
    }
}