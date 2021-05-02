"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPDecClas = exports.MPDecClasse = exports.MPDecoratoreClasse = exports.MPClasse = exports.MPC = exports.MPClas = exports.mpDecClas = exports.mpDecClasse = exports.mpDecoratoreClasse = exports.mpClasse = exports.mpC = exports.mpClas = exports.GetListaClasseMetaData = exports.SalvaListaClasseMetaData = exports.CheckClasseMetaData = exports.TerminaleClasse = void 0;
const tools_1 = require("../tools");
const express_1 = require("express");
const prompts_1 = __importDefault(require("prompts"));
const lista_terminale_classe_1 = require("../liste/lista-terminale-classe");
const lista_terminale_metodo_1 = require("../liste/lista-terminale-metodo");
const terminale_metodo_1 = require("./terminale-metodo");
class TerminaleClasse {
    constructor(nome, path, headerPath, port) {
        this.id = Math.random().toString();
        this.rotte = express_1.Router();
        this.listaMetodi = new lista_terminale_metodo_1.ListaTerminaleMetodo();
        this.nome = nome;
        if (path)
            this.path = path;
        else
            this.path = nome;
        this.percorsi = { pathGlobal: '', patheader: '', porta: 0 };
        if (headerPath == undefined)
            this.percorsi.patheader = "http://localhost:";
        else
            this.percorsi.patheader = headerPath;
        if (port == undefined)
            this.percorsi.porta = 3000;
        else
            this.percorsi.porta = port;
        const pathGlobal = '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
    }
    get GetPath() {
        return this.path;
    }
    set SetPath(v) {
        this.path = v;
        const pathGlobal = '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
    }
    /* async PrintMenu() {
            console.log("Scegli un metodo:");
    
            for (let index = 0; index < this.listaMetodi.length; index++) {
                const element = this.listaMetodi[index];
                console.log(index + 1 + ":\n");
                element.PrintCredenziali();
            }
            const risultato = await chiedi({ name: "scelta", message: "Digita la scelta :", type: "number" });
            if (risultato.scelta != 0) {
                this.listaMetodi[risultato.scelta].PrintMenu();
            } else {
    
            }
        } */
    PrintMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const tab = '\t\t';
            console.log(tab + 'TerminaleClasse' + '->' + 'PrintMenu');
            console.log(tab + this.nome + ' | ' + this.id + ' | ' + '/' + this.percorsi.pathGlobal + '/' + this.path + ' ;');
            for (let index = 0; index < this.listaMetodi.length; index++) {
                const element = this.listaMetodi[index];
                element.PrintCredenziali(this.percorsi.pathGlobal + '/' + this.path);
            }
            const scelta = yield prompts_1.default({ message: 'Premi invio per continuare', type: 'number', name: 'scelta' });
        });
    }
    PrintMenuClasse() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Classe :' + this.nome);
            let index = 0;
            for (let index = 0; index < this.listaMetodi.length; index++) {
                const element = this.listaMetodi[index];
                const tmp = index + 1;
                if (element.tipoInterazione == 'rotta' || element.tipoInterazione == 'ambo') {
                    console.log(tmp + ': ' + element.PrintStamp());
                }
            }
            const scelta = yield prompts_1.default({ message: 'Scegli il metodo da eseguire: ', type: 'number', name: 'scelta' });
            if (scelta.scelta == 0) {
                console.log("Saluti dalla classe : " + this.nome);
            }
            else {
                try {
                    console.log('Richiamo la rotta');
                    const risposta = yield this.listaMetodi[scelta.scelta - 1].ChiamaLaRotta(this.percorsi.patheader + this.percorsi.porta);
                    if (risposta == undefined) {
                        console.log("Risposta undefined!");
                    }
                    else {
                        console.log(risposta);
                    }
                    yield this.PrintMenuClasse();
                }
                catch (error) {
                    yield this.PrintMenuClasse();
                }
            }
        });
    }
    GeneraStruttura(path) {
        const fileHTML = '';
        const fileTypeScript = '';
    }
    PrintCredenziali() {
        const tmp = "nome:" + this.nome + ":;:" +
            "id:" + this.id + ":;:" +
            "listaMetodi.length:" + this.listaMetodi.length + ":;:";
        //console.log(tmp);
    }
    SettaPathRoot_e_Global(item, percorsi, app) {
        if (percorsi.patheader == undefined)
            this.percorsi.patheader = "http://localhost:";
        else
            this.percorsi.patheader = percorsi.patheader;
        if (percorsi.porta == undefined)
            this.percorsi.porta = 3000;
        else
            this.percorsi.porta = percorsi.porta;
        const pathGlobal = percorsi.pathGlobal + '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            if (element.tipoInterazione == 'rotta' || element.tipoInterazione == 'ambo') {
                //element.ConfiguraRotta(this.rotte, this.percorsi);
                element.ConfiguraRottaApplicazione(app, this.percorsi);
            }
            //element.listaRotteGeneraChiavi=this.listaMetodiGeneraKey;
        }
    }
    SettaSwagger() {
        const swaggerJson = `"paths": {    
        `;
        let ritorno = '';
        let primo = false;
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            if (element.tipoInterazione != 'middleware') {
                const tt = element.SettaSwagger('rotta');
                if (tt) {
                    if (primo == false && tt != undefined) {
                        primo = true;
                        ritorno = tt + '';
                    }
                    else if (tt != undefined) {
                        ritorno = ritorno + ',' + tt;
                    }
                }
            }
        }
        const tmp = swaggerJson + ritorno + '}';
        try {
            const hhh = tmp.toString();
            JSON.parse(tmp);
        }
        catch (error) {
            console.log(error);
        }
        return tmp;
    }
    CercaMetodoSeNoAggiungiMetodo(nome) {
        let terminale = this.listaMetodi.CercaConNome(nome);
        if (terminale == undefined) /* se non c'è */ {
            terminale = new terminale_metodo_1.TerminaleMetodo(nome, nome, this.nome); // creo la funzione
            this.listaMetodi.AggiungiElemento(terminale);
        }
        return terminale;
    }
    GeneraHTML() {
        let listaNomi = '';
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = this.listaMetodi[index];
            let bodyStart = `<button class="accordion">${element.nome}</button>
                         <div class="panel">`;
            let bodyEnd = '</div>';
            const tmp = `
           <p>${element.nome}</p>
           <!-- <p>${element.PrintStamp()}</p> --> 
            <div>${element.GeneraHTML()}</div>        
             </br>
             <button onclick="UserAction()">Invia</button>
             <p>Ritorno :</p>
             <textarea name="" id="" style="width:100%" rows="10"></textarea>
             `;
            listaNomi = listaNomi + '\n' + bodyStart + tmp + bodyEnd;
        }
        return listaNomi;
    }
}
exports.TerminaleClasse = TerminaleClasse;
TerminaleClasse.nomeMetadataKeyTarget = "ClasseTerminaleTarget";
/**
 *
 * @param ctr
 */
function decoratoreClasse(percorso) {
    return (ctr) => {
        let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
        const classe = CheckClasseMetaData(ctr.name);
        classe.SetPath = percorso;
        SalvaListaClasseMetaData(tmp);
    };
}
exports.mpClas = decoratoreClasse;
exports.mpC = decoratoreClasse;
exports.mpClasse = decoratoreClasse;
exports.mpDecoratoreClasse = decoratoreClasse;
exports.mpDecClasse = decoratoreClasse;
exports.mpDecClas = decoratoreClasse;
exports.MPClas = decoratoreClasse;
exports.MPC = decoratoreClasse;
exports.MPClasse = decoratoreClasse;
exports.MPDecoratoreClasse = decoratoreClasse;
exports.MPDecClasse = decoratoreClasse;
exports.MPDecClas = decoratoreClasse;
function CheckClasseMetaData(nome) {
    let listClasse = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale); // vado a prendere la struttura legata alle funzioni ovvero le classi
    if (listClasse == undefined) /* se non c'è la creo*/ {
        listClasse = new lista_terminale_classe_1.ListaTerminaleClasse();
        Reflect.defineMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, listClasse, tools_1.targetTerminale);
    }
    /* poi la cerco */
    let classe = listClasse.CercaConNome(nome);
    if (classe == undefined) {
        classe = new TerminaleClasse(nome); //se il metodo non c'è lo creo
        listClasse.AggiungiElemento(classe);
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, tools_1.targetTerminale); //e lo vado a salvare nel meta data
    }
    return classe;
    /* let classePath = listClasse.CercaConPath(path);
    if (classe == undefined && classePath == undefined) {
        classe = new TerminaleClasse(nome); //se il metodo non c'è lo creo
        listClasse.AggiungiElemento(classe);
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale); //e lo vado a salvare nel meta data
    }
    else {
        if (classePath != undefined && classe != undefined) {
            for (let index = 0; index < classePath.listaMetodi.length; index++) {
                const element = classePath.listaMetodi[index];
                classe.listaMetodi.AggiungiElemento(element);
            }
            return classe;
        }
        else if(classePath != undefined && classe == undefined){
            return classePath;
        }
        else if(){
            
        }
        return classe;
    } */
}
exports.CheckClasseMetaData = CheckClasseMetaData;
function SalvaListaClasseMetaData(tmp) {
    Reflect.defineMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale);
}
exports.SalvaListaClasseMetaData = SalvaListaClasseMetaData;
function GetListaClasseMetaData() {
    let tmp = Reflect.getMetadata(lista_terminale_classe_1.ListaTerminaleClasse.nomeMetadataKeyTarget, tools_1.targetTerminale);
    if (tmp == undefined) {
        tmp = new lista_terminale_classe_1.ListaTerminaleClasse();
    }
    return tmp;
}
exports.GetListaClasseMetaData = GetListaClasseMetaData;
//# sourceMappingURL=terminale-classe.js.map