"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpClas = exports.mpPar = exports.mpMet = exports.Main = void 0;
//import { Progetto } from "./app/progetto/progetto.classe";
require("reflect-metadata");
const terminale_main_1 = require("./model/classi/terminale-main");
Object.defineProperty(exports, "Main", { enumerable: true, get: function () { return terminale_main_1.Main; } });
const terminale_classe_1 = require("./model/classi/terminale-classe");
Object.defineProperty(exports, "mpClas", { enumerable: true, get: function () { return terminale_classe_1.mpClas; } });
const terminale_metodo_1 = require("./model/classi/terminale-metodo");
Object.defineProperty(exports, "mpMet", { enumerable: true, get: function () { return terminale_metodo_1.mpMet; } });
const terminale_parametro_1 = require("./model/classi/terminale-parametro");
Object.defineProperty(exports, "mpPar", { enumerable: true, get: function () { return terminale_parametro_1.mpPar; } });
require("reflect-metadata");
const test = {
    nomeParametro: 'nomeFuturo',
    posizione: 'body',
    tipoParametro: 'text',
    descrizione: 'nome che perendere il posto del vecchio.',
    Validatore: (parametro) => {
        let tmp = false;
        if (parametro) {
            tmp = true;
        }
        return {
            approvato: tmp,
            stato: 300,
            messaggio: 'ciao'
        };
    }
};
const test1 = {
    nomeParametro: 'nomignolo',
    posizione: 'query',
    descrizione: 'Nomiglolo passato per query',
    tipoParametro: 'text'
};
const ff = function (req, res, nex) {
    return nex;
};
const VerificaToken = (request, response, next) => {
    try {
        next();
    }
    catch (error) {
        console.log(error);
        return response.status(403).send("Errore : " + error);
    }
};
let ClasseTest = class ClasseTest {
    constructor(nome, cognome) {
        this.nomeTest = nome;
        this.cognome = cognome;
    }
    //@mpMiddle
    /* VerificaToken = (request: Request, response: Response, next: NextFunction) => {
        try {
            next();
        } catch (error) {
            console.log(error);
            return response.status(403).send("Errore : " + error);
        }
    }; */
    Valida(token) {
        let tmp;
        if (token == 'ppp') {
            tmp = {
                body: {
                    "nome": this.nomeTest
                },
                stato: 200
            };
        }
        else {
            tmp = {
                body: {
                    "nome": this.nomeTest
                },
                stato: 500
            };
        }
        return tmp;
    }
    /*
                @mpAddMiddle('Valida') */
    SetNome(nomeFuturo, nomignolo) {
        this.nomeTest = nomeFuturo;
        const tmp = {
            body: {
                "nome": nomeFuturo + ' sei un POST',
                "nomignolo": nomignolo + ' sei un nomigolo!'
            },
            stato: 200
        };
        return tmp;
    }
    SetNomeConMiddleware(nomeFuturo) {
        this.nomeTest = nomeFuturo;
        const tmp = {
            body: {
                "nome": nomeFuturo + ' sei un POST'
            },
            stato: 200
        };
        return tmp;
    }
};
__decorate([
    terminale_metodo_1.mpMet({ tipo: 'get', path: 'Valida', interazione: 'middleware' }),
    __param(0, terminale_parametro_1.mpPar({ nomeParametro: 'token', posizione: 'body' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "Valida", null);
__decorate([
    terminale_metodo_1.mpMet({
        tipo: 'post', path: 'SetNome',
        onChiamataCompletata: (logOn, result, logIn) => {
            console.log(logOn);
        },
        Validatore: (param, listaParametri) => {
            let app = false;
            listaParametri.forEach(element => {
                if (element.nomeParametro == 'nomeFuturo' && param.valoriParametri[element.indexParameter] == 'casa')
                    app = true;
            });
            return {
                approvato: true,
                messaggio: '',
                stato: 200
            };
        }
    }),
    __param(0, terminale_parametro_1.mpPar({
        nomeParametro: 'nomeFuturo',
        posizione: 'body',
        tipoParametro: 'text',
        descrizione: 'nome che perendere il posto del vecchio.',
        Validatore: (parametro) => {
            let tmp = false;
            if (parametro) {
                tmp = true;
            }
            return {
                approvato: true,
                stato: 200,
                messaggio: 'ciao'
            };
        }
    })),
    __param(1, terminale_parametro_1.mpPar(test1)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "SetNome", null);
__decorate([
    terminale_metodo_1.mpAddMiddle('Valida'),
    terminale_metodo_1.mpMet({ tipo: 'post' }),
    __param(0, terminale_parametro_1.mpPar({
        nomeParametro: 'nomeFuturo',
        posizione: 'body',
        tipoParametro: 'text',
        descrizione: 'nome che perendere il posto del vecchio.',
        Validatore: (parametro) => {
            let tmp = false;
            if (parametro) {
                tmp = true;
            }
            return {
                approvato: tmp,
                stato: 300,
                messaggio: 'ciao'
            };
        }
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "SetNomeConMiddleware", null);
ClasseTest = __decorate([
    terminale_classe_1.mpClas(),
    __metadata("design:paramtypes", [String, String])
], ClasseTest);
const classecosi = new ClasseTest("prima classe!!", 'cognome prima classe?!??!');
const main = new terminale_main_1.Main("app");
//# sourceMappingURL=esempio.js.map