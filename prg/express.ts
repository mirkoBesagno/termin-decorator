
import express from "express";
import { Request, Response, Router } from "express";

const app = express(); // questa parte va generata nel main!
const rotteXXX = Router(); // questa in ogni classe
rotteXXX.get/* questa per ogni metodo */("/ciao", () => { 

});
app.use('/rotteXXX', rotteXXX); //questa in ogni classe


app.listen(3000) // questa nel main