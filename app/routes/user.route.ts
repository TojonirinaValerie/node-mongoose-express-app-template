import express, {Express, Request, Response, Router} from 'express';

const router: Router = express.Router();

router.get('/', (req: Request , res: Response ) => {
    res.json({message:"user route index"});
});

export default router;