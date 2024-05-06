import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import cloudinary from "../../../utils/cloudnairy.js";
import subCategoryModel from "../../../DB/models/subcategory.model.js";
import { CatchError } from "../../../utils/catch_error.js";

export const createCategory=CatchError(
    async(req,res,next)=>{
        //Name
        const {Name} = req.body
        //CreatedBy
        const CreatedBy=req.user._id;
        
        //file
        if(!req.file){
            return next(new Error("Category Image is Required ! " ,{cause:400}))
        }
       const {secure_url,public_id} = await cloudinary.uploader.upload(
            req.file.path, //path of fill(image/pdf ..)
            {folder:`${process.env.foldercloudnairy}/category`}
        )

        // store category in DB
        const category= await Category.create({Name,Slug:slugify(Name),Image:{url:secure_url,id:public_id,CreatedBy}})

        return res.status(201).json({status:201,success:true,category})
    }
)
export const UpdateCategory=CatchError(
    async(req,res,next)=>{
      // check category
     
      const CategoryId=req.params.categoryId;
      const category=await Category.findById({_id:CategoryId})
      if(!category) return next(new Error(`Category not found`,{cause:404}))
      //update Name if exist
        req.body.Name?category.Name=req.body.Name : category.Name;
        req.body.Name?category.Slug=slugify(req.body.Name) : category.Slug
        // file
        if(req.file){
            const {public_id,secure_url} = await cloudinary.uploader.upload(
                req.file.path
            )
            category.Image.url=secure_url
            category.Image.id= public_id
        }
        //save category
        await category.save()
        //  send response

        return res.status(200).json({status:200,success:true,Message:"Category Updated Successfully"})
    }
)

// delete category

export const DeleteCategory=CatchError(
    async(req,res,next)=>{
      // check category
     
      const CategoryId=req.params.categoryId;
     
      const category=await Category.findById({_id:CategoryId})
      if(!category) return next(new Error(`Category not found`,{cause:404}))
        //delete Image from cloudnairy
        const result= await cloudinary.uploader.destroy(category.Image.id)
        console.log(result); // if equel ok == it deleted
        // delete category from DB
        await subCategoryModel.deleteMany({ categoryId: CategoryId });
        await Category.findByIdAndDelete(CategoryId)
        // let subCategories = await subCategoryModel.find({ categoryId: CategoryId });

        // for (let i = 0; i < subCategories.length; i++) {
        //     await subCategories[i].deleteOne()
        // }
        
        // Delete all subcategories which related with category
       
        //  send response

        return res.status(200).json({status:200,success:true,Message:"Category Deleted Successfully"})
    }
)
export const GetAllCategory=CatchError(
    async(req,res,next)=>{
        const categories=await Category.find().populate('subcategory')
        return res.json({status:200,success:true,categories})
    }
)

// search category with Name
export const SearchCategory = CatchError(async (req, res, next) => {
    const { name } = req.query;
    
    // Changed $regex usage
    const categories = await Category.find({ Name: { $regex: new RegExp(name, 'i') } }).populate('subcategory');
    
    return res.json({ status: 200, success: true, categories });
});
