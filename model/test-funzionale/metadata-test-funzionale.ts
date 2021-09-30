import { ITestAPI } from "./lista-test-funzionale";
import { ITest } from "./utility-test-funzionale";



export class TerminaleTest {

    static nomeMetadataKeyTarget = "TestTerminaleTarget";
    test: ITest;
    constructor(item: ITest) {
        this.test = item;
    }
    
}
export class TerminaleTestAPI {

    static nomeMetadataKeyTarget = "TestTerminaleTarget";
    test: ITestAPI;
    constructor(item: ITestAPI) {
        this.test = item;
    }
    
}