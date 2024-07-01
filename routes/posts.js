import { getfeedposts, getuserposts, likepost,commentpost } from "../controler/posts.js";

import verifytoken  from "../middleware/auth.js";
import { Router } from "express";
const router=Router();

router.get('/',verifytoken,getfeedposts);
router.get("/:userid/post", verifytoken, getuserposts);

router.patch("/:id/like", verifytoken, likepost).patch("/:id/comment",verifytoken,commentpost)

 export default router;