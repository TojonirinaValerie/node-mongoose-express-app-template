import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { ApiResponse } from './interfaces/api-response.interface';
import route from './routes/index.route';
import dbConfig from './configs/db.config';
import middlewares from './middlewares/index.middlewares';
// import mongoose from 'mongoose'

// ------------------- App configs ---------------------------
const app: Express = express();

app.use(bodyParser.json())
app.use((req:Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, x-acces-token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// -----------------------------------------------------------

// ---------------------- BD ---------------------------------
const mongoose = require('mongoose');
mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => {
    console.log('Connexion à MongoDB réussie !');
}).catch( () => {
    console.log('Connexion à MongoDB échouée !');
    process.exit();
});
// -----------------------------------------------------------

// ---------------------- Routes -----------------------------

app.get('/', (req: Request, res: Response, next: NextFunction) =>{
    const response: ApiResponse = {
        succes: true,
        message: "Bienvenue sur l'application"
    };
    res.json(response);
});

app.use('/api/auth', route.auth);
app.use('/api/user',[middlewares.auth.verifyToken] , route.user);

// -----------------------------------------------------------


const PORT = process.env.port || 8080;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});