
import {Login} from "../controler/auth.js";


// import verifytoken from "../middleware/auth.js";

import express from 'express';

const router=express.Router();



  router.post("/login", Login);
  // router.post("/updateUser",updateUser)


 export default router;
