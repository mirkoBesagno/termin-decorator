import chiedi from "prompts";
//import { Progetto } from "./app/progetto/progetto.classe";
import "reflect-metadata";
import superagent from "superagent";
/* const progetto: Progetto = new Progetto(); */
import { PromptType } from "prompts";
import { ColumnType } from "typeorm";

async function Main() {
    /* const risposta = await chiedi({
        type: 'text',
        name: 'risposta',
        message: 'Vuoi stampare il menu? (si/no)'
    }); 
    if (risposta.risposta == 'si') {
        ///console.log(progetto.PerintStruttura()); 
    }*/
}
class ListaMetodo {
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
}

Main()
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

        function decoratoreParametro(nome: string) {
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

        function decoratoreClasse(ctr: Function) {
            ctr.prototype.id = Math.random();
            ctr.name

            //Reflect.defineMetadata('info', { lista: [] }, targetSecondo);
            const t = Reflect.getMetadata('info', targetTerminale);
            ctr.prototype.Chiama = async () => {
                const risultato = await chiedi({ name: "nome", message: "Dammi il Nome :", type: "text" });
                t.lista[1].funzione(risultato);
            }
        }

        function decoratoreMetodo(): MethodDecorator {
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

        @decoratoreClasse
        class ClasseTest {

            nome: string;
            constructor(nome: string) {
                this.nome = nome;
            }

            @decoratoreMetodo()
            SetNome(@decoratoreParametro("string") nomeFuturo: string) {
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
    .then(() => {

        var targetTerminale = { name: 'Terminale' };

        interface IPrintabile {
            PrintMenu(): any
        }

        class TerminaleMain implements IPrintabile {
            listaClassi: ListaTerminaleClasse;
            constructor() {
                this.listaClassi = new ListaTerminaleClasse();
            }
            Start() {
                let listaClassi = Reflect.getMetadata('info', targetTerminale);
                this.listaClassi = listaClassi;
                this.PrintMenu();
            }
            async PrintMenu() {
                console.log("Scegli una classe:\n");

                for (let index = 0; index < this.listaClassi.length; index++) {
                    const element = this.listaClassi[index];
                    console.log(index + ":\n");
                    element.PrintCredenziali();
                }
                const risultato = await chiedi({ name: "scelta", message: "Digita la scelta :", type: "number" });
                if (risultato.scelta != 0) {
                    this.listaClassi[risultato.scelta].PrintMenu();
                } else {

                }
            }

        }
        class TerminaleClasse implements IPrintabile {
            static nomeMetadataKeyTarget = "ClasseTerminaleTarget";
            listaMetodi: TerminaleMetodo[];
            id: string;
            nome: string;
            constructor() {
                this.id = Math.random().toString();
                this.listaMetodi = [];
                this.nome = "";
            }

            async PrintMenu() {
                console.log("Scegli un metodo:");
                
                for (let index = 0; index < this.listaMetodi.length; index++) {
                    const element = this.listaMetodi[index];
                    console.log(index+1 + ":\n");
                    element.PrintCredenziali();
                }                
                const risultato = await chiedi({ name: "scelta", message: "Digita la scelta :", type: "number" });
                if (risultato.scelta != 0) {
                    this.listaMetodi[risultato.scelta].PrintMenu();
                } else {

                }
            }
            PrintCredenziali() {
                const tmp = "nome:" + this.nome + ":;:" +
                    "id:" + this.id + ":;:" +
                    "listaMetodi.length:" + this.listaMetodi.length + ":;:";
                //console.log(tmp);
            }
        }
        class TerminaleMetodo implements IPrintabile {
            static nomeMetadataKeyTarget = "MetodoTerminaleTarget";
            listaParametri: TerminaleParametro[];
            nome: string | Symbol;
            metodoAvviabile: any;
            constructor() {
                this.listaParametri = [];
                this.nome = "";
            }
            async PrintMenu() {
                for (let index = 0; index < this.listaParametri.length; index++) {
                    const element = this.listaParametri[index];
                    element.PrintMenu();
                }
            }
            EseguiChiamata(path:string){
                const header={};//questa dovro costruirla a seconda dei permessi e delle restrizioni
                superagent.post(path+'/'+this.nome)
                .set({})
                .send('');
            }
            PrintCredenziali() {
                console.log("nome:" + this.nome + ":;:");
                for (let index = 0; index < this.listaParametri.length; index++) {
                    const element = this.listaParametri[index];
                    element.PrintCredenziali();
                }
            }

        }
        //bisogno creare una classe per parametro body, per parametro query, per parametro cooky 
        //(quest'ultimo possiamo anche rimandare)
        class TerminaleParametro {
            nome: string;
            tipo: ColumnType;
            constructor(nome: string, tipo: ColumnType) {
                this.nome = nome;
                this.tipo = tipo;
            }

            PrintMenu() {
                const t = Reflect.getMetadata('info', targetTerminale);
            }
            PrintCredenziali() {
                console.log("nome:" + this.nome + ':;:' + "tipo:" + this.tipo.toString());
            }
        }

        class ListaTerminaleClasse extends Array<TerminaleClasse> {
            static nomeMetadataKeyTarget = "ListaTerminaleClasse";
            constructor() {
                super();
            }
            PrintMenu() {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    element.PrintMenu();
                }
            }
            CercaConNome(nome: string | Symbol): TerminaleClasse | undefined {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    if (element.nome == nome) return element;
                }
                return undefined;
                //throw new Error("Errore mio !");

            }
            AggiungiElemento(item: TerminaleClasse) {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    if (element.nome == item.nome) {
                        this[index] = item;
                        return item;
                    }
                }
                this.push(item);
                return item;
            }
        }
        class ListaTerminaleMetodo extends Array<TerminaleMetodo> {
            static nomeMetadataKeyTarget = "ListaTerminaleMetodo";
            constructor() {
                super();
            }
            CercaConNome(nome: string | Symbol): TerminaleMetodo | undefined {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    if (element.nome == nome) return element;
                }
                return undefined;
                //throw new Error("Errore mio !");

            }
            AggiungiElemento(item: TerminaleMetodo) {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    if (element.nome == item.nome) {
                        this[index] = item;
                        return item;
                    }
                }
                this.push(item);
                return item;
            }
        }
        class ListaTerminaleParametro extends Array<TerminaleParametro>  {
            constructor() {
                super();
            }
        }


        /**
         * 
         */
        function decoratoreMain(ctr: Function) {
            //tmp.PrintMenu();
            ctr.prototype.PrintMenu = () => {
                const listaClassi: ListaTerminaleClasse = new ListaTerminaleClasse();
                let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
                tmp.PrintMenu();
            };
        }
        /* interface IMain{
            PrintMenuLL():any
        }
        function classDecoratorMain<T extends { new(...args: any[]): {} }>(constructor: T) {
            return class MainClasseDD extends constructor implements IMain {
                PrintMenuLL = () => {
                    const listaClassi: ListaTerminaleClasse = new ListaTerminaleClasse();
                    let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
                    tmp.PrintMenu();
                };
            }
        } */

        /**
         * 
         * @param ctr 
         */
        function decoratoreClasse(ctr: Function) {
            let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
            if (!tmp) {
                tmp = new ListaTerminaleClasse();
            }
            let nuovaClasse = tmp.CercaConNome(ctr.name); //cerca la mia funzione
            if (nuovaClasse == undefined)/* se non c'è */ {
                nuovaClasse = new TerminaleClasse(); // creo la funzione 
                nuovaClasse.nome = ctr.name;
            }
            tmp.AggiungiElemento(nuovaClasse);
            Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, tmp, targetTerminale);

            /* ctr.prototype.PrintMenu = async () => {
                let classeOggetto: ListaTerminaleClasse = Reflect.getMetadata(TerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
                //classeOggetto.pr
                const risultato = await chiedi({ name: "nome", message: "Dammi il Nome :", type: "text" });

            } */
        }
        /**
         * Dovra istanziare il metodo e i parametri
         * dovra aggiungere se non gia presente un classe TerminaleMetodo
         * se gia presente aggiungere e salvare con il prametro aggiunto
         * se non gia presente creare e aggiungere poi salvaere
         * @param nome 
         * @returns 
         */
        function decoratoreParametro(tipoParametro: ColumnType) {
            return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
                console.log(tipoParametro);
                if (typeof propertyKey == 'symbol') /*converto in string se è symbol*/ {
                    propertyKey = (<symbol>propertyKey).toString();
                }

                let tmp: ListaTerminaleMetodo = Reflect.getMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni
                if (tmp == undefined) {//se non c'è 
                    tmp = new ListaTerminaleMetodo();//lo creo
                    Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale);//e lo aggiungo a i metadata
                }
                let terminale = tmp.CercaConNome(propertyKey); //cerca la mia funzione
                if (terminale == undefined)/* se non c'è */ {
                    terminale = new TerminaleMetodo(); // creo la funzione 
                    terminale.nome = propertyKey;
                }
                if (terminale != undefined && tmp != undefined)/* controllo esista ma s'ho esistere */ {
                    //creo un terminale parametro e lo aggiungo
                    terminale.listaParametri.push(new TerminaleParametro(parameterIndex.toString(), tipoParametro))//.lista.push({ propertyKey: propertyKey, Metodo: target });                                                
                    tmp.AggiungiElemento(terminale);
                    Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale); // salvo tutto
                }
                else {
                    console.log("Errore mio!");
                }
            }
        }
        /**
         * arrivati a questo punto il metodo dovrebbe gia esistere ma se non esiste bisogna crearlo
         * poi deve essere configurata la sua funzione
         * @returns q
         */
        function decoratoreMetodo(): MethodDecorator {
            return function (
                target: Object,
                propertyKey: string | symbol,
                descriptor: PropertyDescriptor
            ) {
                let listClasse: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni ovvero le classi
                if (listClasse == undefined)/* se non c'è la creo*/ {
                    listClasse = new ListaTerminaleClasse();
                    Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, listClasse, targetTerminale);
                }
                /* poi la cerco */
                let classe = listClasse.CercaConNome((<any>descriptor.configurable).nome);
                if (classe == undefined) {
                    classe = new TerminaleClasse(); //se il metodo non c'è lo creo
                    classe.nome = (<any>descriptor.configurable).nome;
                    Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale); //e lo vado a salvare nel meta data
                }
                ///////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////

                let tmp: ListaTerminaleMetodo = Reflect.getMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni
                if (tmp == undefined) {
                    tmp = new ListaTerminaleMetodo(); //se il metodo non c'è lo creo
                    Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale); //e lo vado a salvare nel meta data
                }
                let terminale = tmp.CercaConNome(propertyKey); //cerca la mia funzione e mi inserisco
                if (terminale == undefined) {
                    terminale = new TerminaleMetodo();
                }
                if (terminale != undefined && tmp != undefined && classe != undefined) {
                    terminale.metodoAvviabile = descriptor.value;
                    tmp.AggiungiElemento(terminale);
                    classe.listaMetodi.push(terminale);
                    Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale); // salvo tutto
                    Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale); //e lo vado a salvare nel meta data
                }
                else {
                    console.log("Errore mio!");
                }
            }
        }

        /*** */

        /* @classDecoratorMain */
        @decoratoreMain
        @decoratoreClasse
        class ClasseTest {
            nome: string;
            constructor(nome: string) {
                this.nome = nome;
            }
            @decoratoreMetodo()
            SetNome(@decoratoreParametro("char") nomeFuturo: string) {
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
        }

        const classecosi = new ClasseTest("prima classe!!");
        classecosi.MetodoPrint();
        (<any>classecosi).PrintMenu();
        /* (classecosi).PrintMenuLL(); */
    });



