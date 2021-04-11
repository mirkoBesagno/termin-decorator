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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = __importDefault(require("prompts"));
//import { Progetto } from "./app/progetto/progetto.classe";
require("reflect-metadata");
const terminale_main_1 = require("./model/classi/terminale-main");
const terminale_classe_1 = require("./model/classi/terminale-classe");
const terminale_metodo_1 = require("./model/classi/terminale-metodo");
const terminale_parametro_1 = require("./model/classi/terminale-parametro");
let ClasseTest = class ClasseTest {
    constructor(nome, cognome) {
        this.nome = nome;
        this.cognome = cognome;
    }
    SetNome(nomeFuturo) {
        this.nome = nomeFuturo;
        const tmp = {
            body: {
                "nome": this.nome
            },
            stato: 200
        };
        return tmp;
    }
    GetNome() {
        const tmp = {
            body: {
                "nome": this.nome
            },
            stato: 200
        };
        return tmp;
    }
    SetCognome(cognomeNuovo) {
        this.cognome = cognomeNuovo;
        const tmp = {
            body: {
                "cognome": this.cognome
            },
            stato: 200
        };
        return tmp;
    }
    GetCognome() {
        const tmp = {
            body: {
                "cognome": this.cognome
            },
            stato: 200
        };
        return tmp;
    }
    SetNome_E_Cognome(nome, cognome) {
        this.cognome = cognome;
        this.nome = nome;
        const tmp = {
            body: {
                "nome": this.nome,
                "cognome": this.cognome
            },
            stato: 200
        };
        return tmp;
    }
    GetNome_E_Cognome() {
        const tmp = {
            body: {
                "nome": this.nome,
                "cognome": this.cognome
            },
            stato: 200
        };
        return tmp;
    }
    MetodoPrint() {
        if ('nome' in this) {
            console.log(this.nome != undefined ? this.nome : "sono undefined");
        }
        else {
            console.log("Classe senza nome");
        }
    }
};
__decorate([
    terminale_metodo_1.mpMet('post', 'SetNome'),
    __param(0, terminale_parametro_1.mpPar('text', 'nomeFuturo', 'body')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "SetNome", null);
__decorate([
    terminale_metodo_1.mpMet('get', 'GetNome'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "GetNome", null);
__decorate([
    terminale_metodo_1.mpMet('post', "SetCognome"),
    __param(0, terminale_parametro_1.mpPar('text', 'cognomeNuovo', 'body')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "SetCognome", null);
__decorate([
    terminale_metodo_1.mpMet('get', 'GetCognome'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "GetCognome", null);
__decorate([
    terminale_metodo_1.mpMet('post', 'set-nome-e-cognome'),
    __param(0, terminale_parametro_1.mpP('text', 'nomeNuovo', 'body')),
    __param(1, terminale_parametro_1.mpP('text', 'cognomeNuovo', 'query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "SetNome_E_Cognome", null);
__decorate([
    terminale_metodo_1.mpMet('get', 'get-nome-e-cognome'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClasseTest.prototype, "GetNome_E_Cognome", null);
ClasseTest = __decorate([
    terminale_classe_1.mpClas('classe-test'),
    __metadata("design:paramtypes", [String, String])
], ClasseTest);
/* @mpClass('classe1')
class Classe1 {
    nome: string;
    constructor(nome: string) {
        this.nome = nome;
    }
    @mpMet()
    SetNome(@mpPar("char") nomeFuturo: string) {
        this.nome = nomeFuturo;
    }

    @mpMet()
    SetNomePrimo(@mpPar("char") nomeFuturoPrimo: string) {
        this.nome = nomeFuturoPrimo;
    }
    @mpMet()
    SetNomeSecondo(@mpPar("char") nomeFuturoSecondo: string) {
        this.nome = nomeFuturoSecondo;
    }

    MetodoPrint() {
        if ('nome' in this) {
            console.log(this.nome != undefined ? this.nome : "sono undefined");
        }
        else {
            console.log("Classe senza nome");

        }
    }
} */
const classecosi = new ClasseTest("prima classe!!", 'cognome prima classe?!??!');
classecosi.MetodoPrint();
const main = new terminale_main_1.Main("app");
console.log('Inizializzazione inizio .....');
main.Inizializza("http://localhost:3000");
console.log('..... Inizializzazione fine.');
console.log('Menu');
console.log('0: express');
console.log('1: superagent');
prompts_1.default({
    message: 'Scegli: ',
    type: 'number',
    name: 'scelta'
}).then((item) => {
    if (item.scelta == 0) {
        main.StartExpress();
    }
    else if (item.scelta == 1) {
        main.PrintMenu();
    }
    else {
        console.log('Ciao ciao ...');
    }
}).catch(err => {
    console.log(err);
});
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
//# sourceMappingURL=index.js.map