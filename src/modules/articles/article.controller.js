import { Article } from "../../../DB/models/article.model.js";
import { CatchError } from "../../../utils/catch_error.js";
import cloudinary from "../../../utils/cloudnairy.js";

export const CreateArticle = CatchError(async (req, res,next) => {

// check user 
    const user = req.user;
    const {title,content,image,publishedDate,createdBy} = req.body
    // check file
    if (!req.file) {
        return next(new Error("Please upload an image",{cause:400}))
    } 
    const {secure_url,public_id}= await cloudinary.uploader.upload( req.file.path, //path of fill(image/pdf ..)
    {folder:`${process.env.foldercloudnairy}/Blogs`})
     
    // create article
    const article = await Article.create({
        title,
        content,
        publishedDate,
        createdBy,
        image: [
            {
                url: secure_url,
                id: public_id
            }
        ],
        createdBy: user._id
    });
    return res.status(201).json({status:201,success:true,article})
})

export const GetArticle = CatchError(async (req, res,next) => {
    const article = await Article.find()
    return res.status(200).json({status:200,success:true,article})
})
export const GetArticleById = CatchError(async (req, res, next) => {
    const { articleId } = req.params;
    if (!articleId) {
        return next(new Error("Article ID is required", { cause: 400 }));
    }
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new Error("Article not found", { cause: 404 }));
    }
    return res.status(200).json({ status: 200, success: true, article });
});

// Update an Article
export const UpdateArticle = CatchError(async (req, res, next) => {
    // Destructure request body
    const { title, content, publishedDate } = req.body;
    const { articleId } = req.params;

    // Check if articleId is provided
    if (!articleId) {
        return next(new Error("Article ID is required", { cause: 400 }));
    }

    // Find the article by ID
    let article = await Article.findById(articleId);
    if (!article) {
        return next(new Error("Article not found", { cause: 404 }));
    }
    if(req.file){
        const {secure_url,public_id}= await cloudinary.uploader.upload( req.file.path, //path of fill(image/pdf ..)
    {folder:`${process.env.foldercloudnairy}/Blogs`})
    article.image.url=secure_url
    article.image.id=public_id
    }
   
    // Update the fields if provided
    if (title) article.title = title;
    if (content) article.content = content;
    if (publishedDate) article.publishedDate = publishedDate;

    // Save the updated Article
    await article.save();

    // Respond with the updated article
    return res.status(200).json({
        status: 200,
        success: true,
        article
    });
});
export const DeleteArticle = CatchError(async (req, res, next) => {
    const { articleId } = req.params;
    if (!articleId) {
        return next(new Error("Article ID is required", { cause: 400 }));
    }
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new Error("Article not found", { cause: 404 }));
    }
    const result= await cloudinary.uploader.destroy(article.image.id)
    console.log(result); 
    await Article.findByIdAndDelete(articleId);
    
    if (!article) {
        return next(new Error("Article not found", { cause: 404 }));
    }
    return res.status(200).json({ status: 200, success: true, message: "Article deleted successfully" });
});

