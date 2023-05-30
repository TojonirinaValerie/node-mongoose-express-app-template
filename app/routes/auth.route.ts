import express, {Express, Request, Response, Router} from 'express';
import { login, signup } from '../controllers/auth.controller';
import authMiddlewares from '../middlewares/auth.middlewares';

const router: Router = express.Router();

router.post('/login', login);
router.post('/signup',[
    authMiddlewares.checkDuplicatePseudo,
    authMiddlewares.checkDuplicateEmail
], signup);

export default router;