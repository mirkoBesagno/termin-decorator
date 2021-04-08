
export const targetTerminale = { name: 'Terminale' };

export interface IPrintabile {
    PrintMenu(): any
}

export enum IType {
    number, text, date
}

export interface IResponse{
    codiceErrore: number;
    messaggioErrore: string;    
}