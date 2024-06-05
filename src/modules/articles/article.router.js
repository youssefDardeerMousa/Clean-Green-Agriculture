import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../../utils/multer.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { articleValidationSchema } from "./article.validation.js";
import { CreateArticle, GetArticle ,DeleteArticle,UpdateArticle, GetArticleById} from "./article.controller.js";
const router = Router();

router.post('/' ,isAuthenticated,isAuthorized("admin"),fileUpload(filterObject.image).single("articleImage")
,isValid(articleValidationSchema),CreateArticle);
router.get('/' ,isAuthenticated,GetArticle);
router.get('/:articleId' ,isAuthenticated,GetArticleById);
router.delete('/:articleId' ,isAuthenticated,DeleteArticle);
router.put('/:articleId' ,isAuthenticated,isAuthorized("admin"),fileUpload(filterObject.image).single("articleImage"),UpdateArticle)






export default router;