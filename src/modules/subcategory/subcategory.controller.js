import  { Category } from "./../../../DB/models/category.model.js";
import subCategoryModel from "./../../../DB/models/subcategory.model.js";
import { CatchError } from "../../../utils/catch_error.js";
import cloudinary from "../../../utils/cloudnairy.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
// category/categoryId/subcategory
export const createSubCategory = CatchError(async (req, res, next) => {
  const { categoryId } = req.params;
  const{Name}=req.body
  //Slug
  const Slug=slugify(Name)
  // Check files existence before querying the DB
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new Error("No files were uploaded!", { cause: 400 }));
  }
  
  // Check category
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("Category not found!", { cause: 404 }));

  // Create a unique folder name
  const cloudFolder = nanoid();

  // Upload sub files
  let images = [];

  for (const file of req.files.images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.foldercloudnairy}/subcategorys/${cloudFolder}`,
      }
    );
    images.push({ url: secure_url, id: public_id });
  }

  // Upload image file
  const imageFile = req.files.Image[0];
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    imageFile.path,
    { folder: `${process.env.foldercloudnairy}/subcategory` }
  );

  // Save subcategory in DB
  const subcategory = await subCategoryModel.create({
    ...req.body,
    cloudFolder,
    Slug,
    Image: { Id: public_id, Url: secure_url },
    images,
    categoryId,
    createdBy: req.user._id,
  });

  // Send response
  return res.json({ success: true, results: subcategory });
});


export const updateSubCategory = CatchError(async (req, res, next) => {
  // data
  const { categoryId, subcategoryId } = req.params;
  const Name = req.body.Name;

  // check category existence
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("Category not found!", { cause: 404 }));

  // check subcategory existence
  const subcategory = await subCategoryModel.findById(subcategoryId);
  if (!subcategory)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  // check subcategory owner
  if (subcategory.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not Authorized (not the owner)!"))
  }

  // check if subcategory belongs to this category
  if (subcategory.categoryId !== categoryId)
    return next(new Error("Subcategory doesn't belong to this category!"));

  // if name found update it & slug
  if (Name) {
    subcategory.Name = Name;
    subcategory.Slug = slugify(Name);
  }

  // update image
  if (req.files.Image) {
    const Image = req.files.Image[0];
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      Image.path,
      { folder: `${process.env.foldercloudnairy}/products/${product.cloudFolder}` }
    );
  
    subcategory.Image = { url: secure_url, id: public_id };
  }

  // Update subImages if provided
  if (req.files.images) {
    const images = [];
    for (const file of req.files.images) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.foldercloudnairy}/products/${product.cloudFolder}` }
      );
      images.push({ url: secure_url, id: public_id });
    }

    subcategory.images = images;
  }
  // save all changes to DB
  await subcategory.save();

  // send response
  return res.json({
    success: true,
    message: "Updated Successfully",
    results: subcategory,
  });
});

export const deleteSubCategory = CatchError(async (req, res, next) => {
  // data
  const { categoryId, subcategoryId } = req.params;

  // check category existence
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("Category not found!", { cause: 404 }));

  // check subcategory existence
  const subcategory = await subCategoryModel.findById(subcategoryId);
  if (!subcategory)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  // check subcategory owner
  if (subcategory.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not Authorized (not the owner)!"))
  }
  
  // // check if subcategory belongs to this category
  // if (subcategory.categoryId !== categoryId)
  //   return next(new Error("Subcategory doesn't belong to this category!"));

  // // delete image from cloudinary
  // const result = await cloudinary.uploader.destroy(subcategory.Image.id);
  // console.log(result); // has ok if the image deleted
  // if (result.result === "not found")
  //   return next(new Error("Image not found!", { cause: 404 }));

  // // delete subcategory from DB
  // await subCategoryModel.findByIdAndDelete(subcategoryId);

  // ====== delete from the cloud =======
  // delete_resources >>> takes array of ids to delete them all
  const ids = subcategory.images.map((img) => img.id); // ids became array
  ids.push(subcategory.Image.id);

  // delete images
  const results = await cloudinary.api.delete_resources(ids);
  console.log(results);

  // delete folder
  // folder must be empty to delete it so we can't make it before deleting images
  await cloudinary.api.delete_folder(
    `${process.env.foldercloudnairy}/subcategorys/${subcategory.cloudFolder}`
  );

  // delete Subcategory from DB
  await subCategoryModel.findByIdAndDelete(subcategoryId);
  return res.json({
    success: true,
    message: "Subcategory deleted successfully",
  });
});

export const allSubCategories = CatchError(async (req, res, next) => {
  const {categoryId}=req.params

  const subcategories = await subCategoryModel
    .find({categoryId})
    .populate([
      { path: "categoryId" },
      { path: "createdBy", select: "userName email" },
    ]);

  return res.json({ success: true, results: subcategories });
});
//search
export const SearchSubcategory = CatchError(async (req, res, next) => {
  const { name } = req.query;
  
  // Changed $regex usage
  const subcategories = await subCategoryModel.find({ Name: { $regex: new RegExp(name, 'i') } })
  
  return res.json({ status: 200, success: true, subcategories });
});
// singlesubcategory

export const singlesubcategory = CatchError(async (req, res, next) => {
  const {subcategoryId}=req.params;
  // check product existence
  const subcategory = await subCategoryModel.findById({_id:subcategoryId});
  if (!subcategory) return next(new Error("Product not found!", { cause: 404 }));
  // response
  return res.json({ success: true, results: subcategory });
});

