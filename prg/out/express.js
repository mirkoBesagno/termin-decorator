"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const app = express_1.default(); // questa parte va generata nel main!
const rotteXXX = express_2.Router(); // questa in ogni classe
rotteXXX.get /* questa per ogni metodo */("/ciao", () => {
});
app.use('/rotteXXX', rotteXXX); //questa in ogni classe
app.listen(3000); // questa nel main
//# sourceMappingURL=express.js.map