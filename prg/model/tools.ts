

export var targetTerminale = { name: 'Terminale' };

export interface IPrintabile {
    PrintMenu(): any
}

export enum IType {
    number, text, date
}

export type TipoParametro ="number"| "text"| "date";
