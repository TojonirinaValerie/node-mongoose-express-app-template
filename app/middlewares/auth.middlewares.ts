import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";
import authConfig from '../configs/auth.config';
import { ApiResponse } from '../interfaces/api-response.interface';
import User from '../models/user.model';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['x-access-token'];

    if(!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    jwt.verify( token.toString(), authConfig.secret, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
        
        next();
    });
}

const checkDuplicatePseudo = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({pseudo: req.body.pseudo})
    .exec( (err, findUser) => {
        
        if(err) {
            const response: ApiResponse = {
                succes: false, 
                message: `Erreur serveur : ${err}`
            }
            return res.status(500).json(response);
        }

        if(findUser) {
            const response: ApiResponse = {
                succes: false, 
                message: "Pseudo déjà utiliser."
            }
            
            return res.status(400).json(response);
        }
        
        next();
    });
}

const checkDuplicateEmail = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({email: req.body.email})
    .exec( (err, findUser) => {
        
        if(err) {
            const response: ApiResponse = {
                succes: false, 
                message: `Erreur serveur : ${err}`
            }
            return res.status(500).json(response);
        }

        if(findUser) {
            const response: ApiResponse = {
                succes: false, 
                message: "Email déjà utiliser."
            }
            
            return res.status(400).json(response);
        }
        
        next();
    });
}

const authMiddlewares = {
    verifyToken,
    checkDuplicatePseudo,
    checkDuplicateEmail
}

export default authMiddlewares;