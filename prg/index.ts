import chiedi from "prompts";
//import { Progetto } from "./app/progetto/progetto.classe";
import "reflect-metadata";
import superagent from "superagent";
/* const progetto: Progetto = new Progetto(); */
import { PromptType } from "prompts";
import { ColumnType } from "typeorm";

//import express, { request, response,  } from "express";
import { Request, Response, NextFunction } from "express";
import { mpMain, Main } from "./model/classi/terminale-main";
import { mpClas } from "./model/classi/terminale-classe";
import { IReturn, mpAddMiddle, mpMet } from "./model/classi/terminale-metodo";
import {  mpPar, IParametro } from "./model/classi/terminale-parametro";
import { TipoParametro } from "./model/tools";

import "reflect-metadata";
import validator from "validator";
import { INonTrovato, IParametriEstratti, ListaTerminaleParametro } from "./model/liste/lista-terminale-parametro";


export { mpMet as mpMet };
export { mpPar as mpPar };
export { mpClas as mpClas };

const test:IParametro = {
    nomeParametro:'nomeFuturo',
                        posizione: 'body',
                        tipoParametro:'text',
                        descrizione:'nome che perendere il posto del vecchio.',                        
                        Validatore:(parametro)=>{
                            let tmp = false;
                            if (parametro) {
                                tmp = true;
                            } 
                            return {
                                approvato:tmp,
                                stato:300,
                                messaggio:'ciao'
                            };
                        }
};
const test1:IParametro = {nomeParametro:'nomignolo',
posizione:'query',
descrizione:'Nomiglolo passato per query',
tipoParametro:'text'
};
const ff = function (req:Request,  res:Response, nex:NextFunction) {
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
            cognome:string;

            constructor(nome: string, cognome:string) {
                this.nomeTest = nome;
                this.cognome=cognome;
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

            
            @mpMet({tipo:'get',path:'Valida',interazione:'middleware'})
            Valida(@mpPar({nomeParametro:'token',posizione: 'body'}) token: string){
                let tmp:IReturn;
                if (token== 'ppp') {                    
                tmp ={
                    body:{
                        "nome": this.nomeTest
                    },
                    stato:200};
                } else {
                    tmp ={
                    body:{
                        "nome": this.nomeTest
                    },
                    stato:500};
                }
                return tmp;
            }
/*
            @mpAddMiddle('Valida') */
            @mpMet({tipo:'post',path:'SetNome',
            onChiamataCompletata:(logOn: string, result: any, logIn: string)=>{
                console.log(logOn);
            },
            Validatore:(param:IParametriEstratti, listaParametri:ListaTerminaleParametro)=>{
                let app = false;
                listaParametri.forEach(element => {
                    if(element.nomeParametro== 'nomeFuturo' && param.valoriParametri[element.indexParameter] == 'casa')app = true;
                });
                    return {
                        approvato:true,
                        messaggio:'',
                        stato:200
                    };
            }
        })
        
        
            SetNome(@mpPar({
                    nomeParametro:'nomeFuturo',
                    posizione: 'body',
                    tipoParametro:'text',
                    descrizione:'nome che perendere il posto del vecchio.',                        
                    Validatore:(parametro)=>{
                        let tmp = false;
                        if (parametro) {
                            tmp = true;
                        } 
                        return {
                        approvato:true,
                        stato:200,
                        messaggio:'ciao'
                        };
                        }
                })nomeFuturo: string,
                    @mpPar(test1)nomignolo: string){
                this.nomeTest = nomeFuturo;
                const tmp : IReturn={
                    body:{
                        "nome": nomeFuturo+' sei un POST',
                        "nomignolo":nomignolo+' sei un nomigolo!'
                    },
                    stato:200};
                return tmp;
            }

            
            @mpAddMiddle('Valida') 
            @mpMet({tipo:'post'})
            SetNomeConMiddleware(
                @mpPar({
                        nomeParametro:'nomeFuturo',
                        posizione: 'body',
                        tipoParametro:'text',
                        descrizione:'nome che perendere il posto del vecchio.',
                        Validatore:(parametro)=>{
                            let tmp = false;
                            if (parametro) {
                                tmp = true;
                            } 
                            return {
                                approvato:tmp,
                                stato:300,
                                messaggio:'ciao'
                            };
                        }
                    }) nomeFuturo: string
                    ){
                this.nomeTest = nomeFuturo;
                const tmp : IReturn={
                    body:{
                        "nome": nomeFuturo+' sei un POST'
                    },
                    stato:200};
                return tmp;
            }           

        }


    
        const classecosi = new ClasseTest("prima classe!!",'cognome prima classe?!??!');
        
        const main = new Main("app");
        console.log('Inizializzazione inizio .....');
        
        chiedi([{
            message: 'Quale porta usare?(default=3030) : ',
            type: 'number', name: 'porta'
        },{
            message: 'Quale indirizzo esporre?(http://localhost) : ',
            type: 'text', name: 'header'
        }]).then((scelta2)=>{
            if(scelta2.porta == undefined || scelta2.porta == 0)scelta2.porta = 3030; 
            if(scelta2.header == undefined || scelta2.header == 0) scelta2.header='http://localhost';
        main.Inizializza(scelta2.header + ":", scelta2.porta, true,true);
        console.log('..... Inizializzazione fine.');
        const vett:string[]=[
            'express',
        'superagent',
        'aggiungi swagger',
        'express + superagent',
        'todo'
        ];
        console.log('Menu');
        for (let index = 0; index < vett.length; index++) {
            const element = vett[index];          
            console.log(index+' :'+element);
        }
        
        chiedi({ 
            message: 'Scegli: ',
         type: 'number', 
         name: 'scelta' 
        }).then((item)=>{
            if (item.scelta==0) {
                main.StartExpress();                
            } else if(item.scelta==1){
                main.PrintMenu();
            } else if(item.scelta==2){
                const scelta = chiedi({
                     message: 'Rotta dove renderli visibili: ', 
                     type: 'text', name: 'scelta' }).then((ris)=>{
                        main.AggiungiSwagger(ris.scelta);
                        main.StartExpress();   
                     })    
            } else if(item.scelta==3){
                main.StartExpress();                 
                chiedi({
                    message: 'Rotta dove renderli visibili: ', 
                    type: 'text', name: 'scelta' }).then((ris)=>{
                        main.PrintMenu();
                    }) 
            } else {
                console.log('Ciao ciao ...');                
            }

        }).catch(err => {
            console.log(err);
            
        });
        })
        
       
        //console.log('fineeeeeeeeeee');
        
        /* (<any>classecosi).Inizializza();
        (<any>classecosi).serverExpressDecorato.listen(3000);
        console.log("PrintMenu, inizio dall'init");
        
        (<any>classecosi).PrintMenu(); */
        /* (classecosi).PrintMenuLL(); */





        
/* class ListaMetodo {
    lista: IMetodo[] = [];
    constructor() {
        this.lista = [];
    }
    public Inserisci(item: IMetodo) {
        this.lista.push(item);
    }
}
interface IMetodo {
    nome: string
} */
    /*  .then(() => {
 
         function logData(message: string): ClassDecorator {
             console.log("Ciao : " + message);
             return function (): void {
                 console.log("costruttuore!!");
 
             }
         }
 
         @logData("Hello world")
         class User {
             public firstName: string;
             public lastName: string;
 
 
             constructor(firstName: string, lastName: string) {
                 this.firstName = firstName;
                 this.lastName = lastName;
             }
         }
 
         const user = new User('John', 'Doe');
 
         function BaseEntity(ctr: Function) {
             ctr.prototype.id = Math.random();
             ctr.prototype.created = new Date().toLocaleString("es-ES");
             ctr.prototype.listaFunzioni = new ListaMetodo();
         }
 
         function methodDecoratorExample(): MethodDecorator {
             return function (
                 target: Object,
                 propertyKey: string | symbol,
                 descriptor: PropertyDescriptor
             ) {
                 console.log('⚠️ DATA', { target, propertyKey, descriptor });
 
                 const original = descriptor.value;
                 console.log((<any>target.constructor.prototype).id);
 
                 let lista = (<any>target.constructor.prototype).listaFunzioni;
                 if (lista) {
                     lista = (<ListaMetodo>lista).lista.push({ nome: "Ciao =)" });
                 }
 
                 (<any>target.constructor.prototype).id = 9;
                 descriptor.value = (...args: any) => {
                     const originalResult = original.apply(target, args);
                     return originalResult + 4;
                 }
             }
         }
 
         @BaseEntity
         class City {
             constructor(public zicode: string) { }
 
 
             @methodDecoratorExample()
             Metodo(item?: string) {
 
             }
         }
         let ny = new City("RD");
         console.log((<any>ny).id);
         ny.Metodo();
 
         function reportableClassDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
             return class extends constructor {
                 reportingURL = "http://www...";
                 listaFunzioni = [];
             };
         }
 
         @reportableClassDecorator
         class BugReport {
             type = "report";
             title: string;
 
             constructor(t: string) {
                 this.title = t;
             }
         }
 
         const bug = new BugReport("Needs dark mode");
         console.log(bug.title); // Prints "Needs dark mode"
         console.log(bug.type); // Prints "report"
 
         // Note that the decorator _does not_ change the TypeScript type
         // and so the new property `reportingURL` is not known
         // to the type system:
         console.log((<any>bug).reportingURL);
         console.log((<any>bug).listaFunzioni);
 
         class Greeter {
             greeting: string;
             constructor(message: string) {
                 this.greeting = message;
             }
 
             @enumerable(false)
             greet() {
                 return "Hello, " + this.greeting;
             }
         }
 
         function enumerable(value: boolean) {
             return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
                 descriptor.enumerable = value;
             };
         }
 
         console.log("Finito");
 
     }) */
    /* .then(() => {
        console.log("Secondo blocco : START");

        console.log('check : ', typeof Reflect.defineMetadata);

        var target = { name: 'Mirko', lista: [] };
        var targetSecondo = { name: 'Rossi' };

        Reflect.defineMetadata('version', 1, target);
        Reflect.defineMetadata('info', { lista: [] }, target);
        Reflect.defineMetadata('is', 'string', target, 'name');

        console.log('target -> ', target);

        console.log('target(info) ->', Reflect.getMetadata('info', target));

        let tmp = Reflect.getMetadata('info', target);
        tmp.lista.push('1');

        console.log('target(info) ->', Reflect.getMetadata('info', target));

        console.log('target(info, secondo) ->', Reflect.getMetadata('info', targetSecondo));
        console.log('target(is) ->', Reflect.getMetadata('is', target, 'name'));
        console.log('target(missing) ->', Reflect.getMetadata('missing', target));

    }) */
    /* .then(() => {

        var targetSecondo = { name: 'Rossi' };

        function reportableClassDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
            return class extends constructor {
                //Reflect.defineMetadata('info', { lista: [] }, target);
                nomePerMetadata = "classe";
            };
        }
        function BaseEntity(ctr: Function) {
            ctr.prototype.id = Math.random();
            //Reflect.defineMetadata('info', { lista: [] }, targetSecondo);
        }
        function methodDecoratorExample(): MethodDecorator {
            return function (
                target: Object,
                propertyKey: string | symbol,
                descriptor: PropertyDescriptor
            ) {
                console.log(descriptor.value);
                console.log(descriptor.writable);
                console.log(descriptor.value);
                let tmp = Reflect.getMetadata('info', targetSecondo);
                if (tmp) {
                    tmp.lista.push({
                        funzione: descriptor.value
                    });
                }
                else {
                    Reflect.defineMetadata('info', { lista: [{ funzione: descriptor.value }] }, targetSecondo);
                }
            }
        }
        const requiredMetadataKey = Symbol("required");
        function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
            let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
            existingRequiredParameters.push(parameterIndex);
            Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
        }
        function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
            let method = descriptor.value!;

            descriptor.value = function () {
                let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
                if (requiredParameters) {
                    for (let parameterIndex of requiredParameters) {
                        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                            throw new Error("Missing required argument.");
                        }
                    }
                }
                return method.apply(this, arguments);
            };
        }
        function logParam(target: any, propertyKey: string, parameterIndex: number) {
            target.test = propertyKey;
        }
        function ss(nome: string) {
            return function (
                target: any,
                propertyKey: string | symbol,
                parameterIndex: number
            ) {
                console.log(nome);

                let tmp = Reflect.getMetadata('info', targetSecondo);
                if (tmp) {
                    tmp.lista.push({ propertyKey: propertyKey, funzione: target });
                }
                else {
                    Reflect.defineMetadata('info', { lista: [propertyKey] }, targetSecondo);
                }
            }
        }
        function Enumerable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log("hah");

        }
        function logType(target: any, key: string) {
            var t = Reflect.getMetadata("design:type", target, key);
            console.log(`${key} type: ${t.name}`);
        }
        function lightType(nome: string, tipo: string) {
            var t = Reflect.getMetadata("nome:tipo", nome, tipo);
            console.log(`${nome} type: ${tipo}`);
        }

        @BaseEntity
        class ClasseTest {

            @logType
            nome: string;
            constructor(nome: string) {
                this.nome = nome;
            }

            @methodDecoratorExample()
            MetodoPrint() {
                //console.log(this.nome != undefined ? this.nome : "sono undefined");
                console.log("hahaha che bello");

            }
            /* @methodDecoratorExample()
            MetodoPrintConDecoratori() {
                console.log(this.nome);
            } */


    /* @Enumerable
    MetodoPrintConDecoratoriAttributi(@logParam nome: string, @ss("string") cognome: string) {
        console.log(this.nome);
    } */
    /*   }

     const classecosi = new ClasseTest("prima classe!!");
      classecosi.MetodoPrint();
      console.log('target(info) ->', Reflect.getMetadata('info', targetSecondo));
      const t = Reflect.getMetadata('info', targetSecondo);
      const f = t.lista[0].funzione;
      f();
      console.log("fine");

  }) */
    /* .then(() => {

        const requiredMetadataKey = Symbol("required");

        var targetTerminale = { name: 'Terminale' };

        function mpPar(nome: string) {
            return function (
                target: any,
                propertyKey: string | symbol,
                parameterIndex: number
            ) {
                console.log(nome);

                let tmp = Reflect.getMetadata('info', targetTerminale);
                if (tmp) {
                    tmp.lista.push({ propertyKey: propertyKey, funzione: target });
                }
                else {
                    Reflect.defineMetadata('info', { lista: [{ propertyKey: propertyKey, funzione: target }] }, targetTerminale);
                }
            }
        }

        function mpClass(ctr: Function) {
            ctr.prototype.id = Math.random();
            ctr.name

            //Reflect.defineMetadata('info', { lista: [] }, targetSecondo);
            const t = Reflect.getMetadata('info', targetTerminale);
            ctr.prototype.Chiama = async () => {
                const risultato = await chiedi({ name: "nome", message: "Dammi il Nome :", type: "text" });
                t.lista[1].funzione(risultato);
            }
        }

        function mpMet(): MethodDecorator {
            return function (
                target: Object,
                propertyKey: string | symbol,
                descriptor: PropertyDescriptor
            ) {
                let tmp = Reflect.getMetadata('info', targetTerminale);
                if (tmp) {
                    tmp.lista.push({
                        funzione: descriptor.value
                    });
                }
                else {
                    Reflect.defineMetadata('info', { lista: [{ funzione: descriptor.value }] }, targetTerminale);
                }
            }
        }

        @mpClass
        class ClasseTest {

            nome: string;
            constructor(nome: string) {
                this.nome = nome;
            }

            @mpMet()
            SetNome(@mpPar("string") nomeFuturo: string) {
                this.nome = nomeFuturo;
            }

            MetodoPrint() {
                if ('nome' in this) {
                    console.log(this.nome != undefined ? this.nome : "sono undefined");
                }
                else {
                    console.log("Classe senza nome");

                }
            }

            /* @methodDecoratorExample()
            MetodoPrintConDecoratori() {
                console.log(this.nome);
            } */


    /* @Enumerable
    MetodoPrintConDecoratoriAttributi(@logParam nome: string, @ss("string") cognome: string) {
        console.log(this.nome);
    } */
    /*    }

  const classecosi = new ClasseTest("prima classe!!");
     classecosi.MetodoPrint();

     (<Promise<any>>(<any>classecosi).Chiama())
         .then(() => {
             classecosi.MetodoPrint();
         })
         .catch(err => { console.log("Errore !!!  : ", err) });
 }) */
 // Property Decorator
/* function mpReturn() {
    return function(target: Object, key: string | symbol) {
  console.log('ciao');
  
  }
} */



