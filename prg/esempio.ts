import chiedi from "prompts";
//import { Progetto } from "./app/progetto/progetto.classe";
import "reflect-metadata";
import superagent from "superagent";
/* const progetto: Progetto = new Progetto(); */
import { PromptType } from "prompts";

//import express, { request, response,  } from "express";
import { Request, Response, NextFunction } from "express";
import { mpMain, Main } from "./model/classi/terminale-main";
import { mpClas } from "./model/classi/terminale-classe";
import { IReturn, mpAddMiddle, mpMet } from "./model/classi/terminale-metodo";
import { mpPar, IParametro } from "./model/classi/terminale-parametro";
import { TipoParametro } from "./model/tools";

import "reflect-metadata";

import { INonTrovato, IParametriEstratti, ListaTerminaleParametro } from "./model/liste/lista-terminale-parametro";

export { Main as Main };
export { mpMet as mpMet };
export { mpPar as mpPar };
export { mpClas as mpClas };

const test: IParametro = {
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
const test1: IParametro = {
    nomeParametro: 'nomignolo',
    posizione: 'query',
    descrizione: 'Nomiglolo passato per query',
    tipoParametro: 'text'
};
const ff = function (req: Request, res: Response, nex: NextFunction) {
    return nex;
};


const VerificaToken = (request: Request, response: Response, next: NextFunction) => {
    try {
        next();
    } catch (error) {
        console.log(error);
        return response.status(403).send("Errore : " + error);
    }
};

@mpClas()
class ClasseTest {
    nomeTest: string;
    cognome: string;

    constructor(nome: string, cognome: string) {
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


    @mpMet({ tipo: 'get', path: 'Valida', interazione: 'middleware' })
    Valida(@mpPar({ nomeParametro: 'token', posizione: 'body' }) token: string) {
        let tmp: IReturn;
        if (token == 'ppp') {
            tmp = {
                body: {
                    "nome": this.nomeTest
                },
                stato: 200
            };
        } else {
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
    @mpMet({
        tipo: 'post', path: 'SetNome',
        onChiamataCompletata: (logOn: string, result: any, logIn: string) => {
            console.log(logOn);
        },
        Validatore: (param: IParametriEstratti, listaParametri: ListaTerminaleParametro) => {
            let app = false;
            listaParametri.forEach(element => {
                if (element.nomeParametro == 'nomeFuturo' && param.valoriParametri[element.indexParameter] == 'casa') app = true;
            });
            return {
                approvato: true,
                messaggio: '',
                stato: 200
            };
        }
    })


    SetNome(@mpPar({
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
    }) nomeFuturo: string,
        @mpPar(test1) nomignolo: string) {
        this.nomeTest = nomeFuturo;
        const tmp: IReturn = {
            body: {
                "nome": nomeFuturo + ' sei un POST',
                "nomignolo": nomignolo + ' sei un nomigolo!'
            },
            stato: 200
        };
        return tmp;
    }


    @mpAddMiddle('Valida')
    @mpMet({ tipo: 'post' })
    SetNomeConMiddleware(
        @mpPar({
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
        }) nomeFuturo: string
    ) {
        this.nomeTest = nomeFuturo;
        const tmp: IReturn = {
            body: {
                "nome": nomeFuturo + ' sei un POST'
            },
            stato: 200
        };
        return tmp;
    }

}



const classecosi = new ClasseTest("prima classe!!", 'cognome prima classe?!??!');

const main = new Main("app");