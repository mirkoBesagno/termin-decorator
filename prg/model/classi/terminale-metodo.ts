import { IPrintabile, IType, targetTerminale } from "../tools";
import { CheckClasseMetaData, GetListaClasseMetaData, SalvaListaClasseMetaData, TerminaleClasse } from "./terminale-classe";
import { EPosizione, TerminaleParametro } from "./terminale-parametro";
import chiedi from "prompts";


import superagent, { head } from "superagent";
import express, { Router, Request, Response } from "express";
import { ListaTerminaleMetodo } from "../liste/lista-terminale-metodo";
import { ListaTerminaleParametro } from "../liste/lista-terminale-parametro";
import { ListaTerminaleClasse } from "../liste/lista-terminale-classe";

export interface IReturn {
    body: object;
    stato: number;
}

export class TerminaleMetodo implements IPrintabile {
    classePath = '';
    static nomeMetadataKeyTarget = "MetodoTerminaleTarget";
    private _listaParametri: ListaTerminaleParametro;
    tipo: TypeMetodo;

    private _nome: string | Symbol;
    metodoAvviabile: any;
    private _path: string;
    pathGlobal: string;
    constructor(nome: string, path: string, classeParth: string) {
        this._listaParametri = new ListaTerminaleParametro();
        this._nome = nome;
        this._path = path;
        this.classePath = this.classePath;
        this.tipo = TypeMetodo.indefinita;
        this.pathGlobal = '';
    }
    /* start : get e set */
    public get nome(): string | Symbol {
        return this._nome;
    }
    public set nome(value: string | Symbol) {
        this._nome = value;
    }
    public get path(): string {
        return this._path;
    }
    public set path(value: string) {
        this._path = value;
    }
    public get listaParametri(): ListaTerminaleParametro {
        return this._listaParametri;
    }
    public set listaParametri(value: ListaTerminaleParametro) {
        this._listaParametri = value;
    }
    /* end : get e ste */
    async PrintMenu() {
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            element.PrintMenu();
        }
    }
    EseguiChiamata(path: string) {
        const header = {};//questa dovro costruirla a seconda dei permessi e delle restrizioni
        superagent.post(path + '/' + this.nome)
            .set({})
            .send('');
    }
    PrintCredenziali(pathRoot?: string) {
        const tab = '\t\t\t';
        let parametri = "";
        console.log(tab + 'TerminaleMetodo' + '->' + 'PrintCredenziali');
        console.log(tab + this.nome + ' | ' + this.path + ' ;');

        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        if (pathRoot != undefined) console.log(tab + this.nome + ' | ' + '/' + pathRoot + '/' + this.path + '  |  ' + parametri);
        else console.log(tab + this.nome + ' | ' + "/" + this.path + '  |  ' + parametri);
        console.log(this.pathGlobal);


    }
    PrintStamp() {
        let parametri = "";
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        const tmp = this.nome + ' | ' + '/' + this.pathGlobal + '/' + this.path + '  |  ' + parametri;
        //console.log(tmp);
        return tmp;
    }
    ConfiguraRotta(rotte: Router, pathglobal: string): Router {
        this.pathGlobal = pathglobal + '/' + this.path;
        if (this.metodoAvviabile != undefined) {
            //rotte.get('/' + this.nome, this.metodoAvviabile);
            switch (this.tipo) {
                case TypeMetodo.get:
                    (<IReturn>this.metodoAvviabile).body;
                    rotte.get("/" + this.path.toString(),
                        (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                            const tmp = this.metodoAvviabile.apply(this, parametri);

                            res.status((<IReturn>tmp).stato).send((<IReturn>tmp).body);
                            return res;
                        });
                    break;
                case TypeMetodo.post:
                    (<IReturn>this.metodoAvviabile).body;
                    rotte.post("/" + this.path.toString(),
                        (req: Request, res: Response) => {
                            console.log('Risposta a chiamata : ' + this.pathGlobal);
                            const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                            const tmp = this.metodoAvviabile.apply(this, parametri);
                            //const tmp = this.metodoAvviabile(req.body.nome);
                            res.status((<IReturn>tmp).stato).send((<IReturn>tmp).body);
                            return res;
                        });
                    break;
                default:
                    break;
            }
        }
        return rotte;
    }
    async ChiamaLaRotta(headerpath?: string) {
        if (headerpath == undefined) {
            headerpath = "http://localhost:3000"
        }
        console.log('chiamata per : ' + head + this.pathGlobal + ' | Verbo: ' + this.tipo);

        const parametri = await this.listaParametri.SoddisfaParamtri();
        let ritorno;
        switch (this.tipo) {
            case TypeMetodo.get:
                try {
                    ritorno = await superagent
                        .get(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json');
                } catch (error) {
                    console.log(error);

                }
            case TypeMetodo.post:
                try {
                    ritorno = await superagent
                        .post(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json');
                } catch (error) {
                    console.log(error);

                }
                return ritorno;
            case TypeMetodo.purge:
                try {
                    ritorno = await superagent
                        .purge(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json');
                } catch (error) {
                    console.log(error);

                }
                return ritorno;
            case TypeMetodo.patch:
                try {
                    ritorno = await superagent
                        .patch(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json');
                } catch (error) {
                    console.log(error);

                }
                return ritorno;
            case TypeMetodo.delete:
                try {
                    ritorno = await superagent
                        .delete(headerpath + this.pathGlobal)
                        .query(JSON.parse(parametri.query))
                        .send(JSON.parse(parametri.body))
                        .set('accept', 'json');
                } catch (error) {
                    console.log(error);

                }
                return ritorno;
            default:
                break;
        }
    }
    async SoddisfaParamtri() {
        const body = [];
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                + element.tipo + '|Inserire valore :';
            const scelta = await chiedi({ message: messaggio, type: 'text', name: 'scelta' });
            body.push({ nome: element.nome, valore: scelta.scelta });
        }

        return body;
    }
    CercaParametroSeNoAggiungi(nome: string, parameterIndex: number, tipoParametro: IType, posizione: EPosizione) {
        this.listaParametri.push(new TerminaleParametro(nome, tipoParametro, posizione, parameterIndex))//.lista.push({ propertyKey: propertyKey, Metodo: target });                                           
    }

}

export function CheckMetodoMetaData(nomeMetodo: string, classe: TerminaleClasse) {
    let tmp: ListaTerminaleMetodo = Reflect.getMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni
    if (tmp == undefined) {//se non c'è 
        tmp = new ListaTerminaleMetodo(classe.rotte);//lo creo
        Reflect.defineMetadata(ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, targetTerminale);//e lo aggiungo a i metadata
    }
    let terminale = tmp.CercaConNome(nomeMetodo, classe.path); //cerca la mia funzione
    if (terminale == undefined)/* se non c'è */ {
        terminale = new TerminaleMetodo(nomeMetodo, "", classe.nome); // creo la funzione
    }
    return terminale;
}

export enum TypeMetodo {
    get, put, post, patch, purge, delete, indefinita
}
export type TypeMetod ="get"| "put"| "post"| "patch"| "purge"| "delete";

function decoratoreMetodo(tipo: TypeMetod, path?: string): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());

        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;
            metodo.tipo = TypeMetodo[ tipo];
            if (path == undefined) metodo.path = propertyKey.toString();
            else metodo.path = path;
            SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    }
}

export { decoratoreMetodo as mpMetRev };
export { decoratoreMetodo as mpMet };
export { decoratoreMetodo as mpM };
export { decoratoreMetodo as mpMetodo };
export { decoratoreMetodo as mpDecoratoreMetodo };
export { decoratoreMetodo as mpDecMetodo };
export { decoratoreMetodo as mpDecMet };


export { decoratoreMetodo as MPMetRev };
export { decoratoreMetodo as MPM };
export { decoratoreMetodo as MPMetodo };
export { decoratoreMetodo as MPDecoratoreMetodo };
export { decoratoreMetodo as MPDecMetodo };
export { decoratoreMetodo as MPDecMet };
