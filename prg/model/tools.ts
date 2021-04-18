

export var targetTerminale = { name: 'Terminale' };

export interface IPrintabile {
    PrintMenu(): any
}
export interface IDescrivibile {
    descrizione:string;
    sommario:string;
}

export type TipoParametro ="number"| "text"| "date";
