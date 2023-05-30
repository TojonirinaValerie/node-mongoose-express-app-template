import { Request, Response } from "express";
import { ApiResponse } from "../interfaces/api-response.interface";
import { IUser } from "../interfaces/user.interface";
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import authConfig from "../configs/auth.config";

export const login =  (req:Request, res: Response) => {
    let userEmail: string = req.body.email;
    let password: string = req.body.password;

    User.findOne({email: userEmail})
    .then( findUser => {
        
        // --------------------- Find User---------------------------
        if(!findUser) {
            const response: ApiResponse = {
                succes: false, 
                message: "Utilisateur non trouvé"
            }
            return res.status(404).json(response);
        }
        // ----------------------------------------------------------


        // -----------------------Verify password--------------------
        let isPasswordValid = bcrypt.compareSync(
            password,
            findUser.password
        );
        if(!isPasswordValid) {
            const response: ApiResponse = {
                succes: false, 
                message: "Mot de passe incorrect"
            }
            
            return res.status(401).json(response);
        }
        // -----------------------------------------------------------


        // ------------------------- create Token -----------------------------
        let token = jwt.sign({ id: findUser._id}, authConfig.secret, { expiresIn: 60});
        // --------------------------------------------------------------------

        
        // -------------------------- send response ------------------------
        const response: ApiResponse = {
            succes: true, 
            message: "Vous etes connecte."
        }
        const data = {
            token,
            pseudo: findUser.pseudo,
            email: findUser.email,
            userId: findUser._id
        }

        return res.status(200).json({
            ...response,
            data
        });
        // -----------------------------------------------------------------
    })
    .catch( error => {
        const response: ApiResponse = {
            succes: false, 
            message: "Erreur serveur"
        }
        console.log(error);
        return res.status(500).json(response);
    })
}

export const signup =  (req:Request, res: Response) => {

    const newUser: IUser = {
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }

    const user = new User(newUser);

    user.save()
    .then( ()=>{
        const response: ApiResponse = {
            succes: true, 
            message: "Utilisateur créé."
        }
        
        return res.status(201).json(response);
    })
    .catch( (error) => {
        const response: ApiResponse = {
            succes: false, 
            message: "Erreur serveur"
        }
        console.log(error);
        return res.status(500).json(response);
    });
}