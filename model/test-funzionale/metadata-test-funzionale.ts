import { ITest } from "./utility-test-funzionale";



export class TerminaleTest {

    static nomeMetadataKeyTarget = "TestTerminaleTarget";
    test: ITest;
    constructor(item: ITest) {
        this.test = item;
    }
    
}