import { nanoid } from "nanoid";
import cloudinary from "../../../utils/cloudnairy.js";
import productModel from "../../../DB/models/product.model.js";
import subCategoryModel from "../../../DB/models/subcategory.model.js";

import { CatchError } from "../../../utils/catch_error.js";
import { Category } from "../../../DB/models/category.model.js";

export const addProduct = CatchError(async (req, res, next) => {
  const { categoryId, subcategoryId } = req.body;

  // check category existence
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("Category not found!", { cause: 404 }));

  // check subcategory existence
  const subcategory = await subCategoryModel.findById(subcategoryId);
  if (!subcategory)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  // check files existence
  if (!req.files || !req.files.defaultImage)
    return next(new Error("Default Image file is missing!", { cause: 400 }));

  // create unique folder name
  const cloudFolder = nanoid();

  // upload sub files
  let images = [];

  for (const file of req.files.images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.foldercloudnairy}/products/${cloudFolder}`,
      }
    );
    images.push({ url: secure_url, id: public_id });
  }
  
  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.foldercloudnairy}/products/${cloudFolder}` }
  );

  // create product
  const product = await productModel.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images, // [{},{}...]
  });

  console.log("product final price", product.finalPrice);

  // send response
  return res.json({ success: true, results: product });
});



export const deleteProduct = CatchError(async (req, res, next) => {
  // data
  const { productId } = req.params;

  // check product existence
  const product = await productModel.findById(productId);
  if (!product) return next(new Error("Product not found!", { cause: 404 }));

  // check owner
  if (product.createdBy.toString() !== req.user._id.toString())
    return next(new Error("Not authorized (not the owner)", { cause: 401 }));

  // ====== delete from the cloud =======
  // delete_resources >>> takes array of ids to delete them all
  const ids = product.images.map((img) => img.id); // ids became array
  ids.push(product.defaultImage.id);

  // delete images
  const results = await cloudinary.api.delete_resources(ids);
  console.log(results);

  // delete folder
  // folder must be empty to delete it so we can't make it before deleting images
  await cloudinary.api.delete_folder(
    `${process.env.foldercloudnairy}/products/${product.cloudFolder}`
  );

  // delete product from DB
  await productModel.findByIdAndDelete(productId);

  // send response
  return res.json({ success: true, message: "Product deleted Successfully!" });
});

// export const allProducts = CatchError(async (req, res, next) => {
//   // data
//   const { page, fields, sort } = req.query;
//   const { categoryId } = req.params;

//   // products of specific category
//   if (categoryId) {
//     console.log("done");
//     const category = await categoryModel.findById(categoryId);

//     if (!category)
//       return next(new Error("Category not found!", { cause: 404 }));

//     const products = await productModel.find({ categoryId });
//     return res.json({ success: true, results: products });
//   }

//   // model keys
//   const modelKeys = Object.keys(productModel.schema.paths);

//   // spread to filter using strict query in model
//   // .find({ ...req.query }) // example: name="Oppo Phone X3"
//   // not the best way to search You have to write the full name
//   const products = await productModel
//     .find(search(modelKeys, req.query)) // example: name="op"
//     .paginate(page)
//     .customSelect(modelKeys, fields)
//     .sort(sort); // note that sort always applied first
//   return res.json({ success: true, results: products });
// });

export const allProducts = CatchError(async (req, res, next) => {
  
const products = await productModel.find()
  return res.json({ success: true, results: products });
});

export const singleProduct = CatchError(async (req, res, next) => {
  // data
  const { productId } = req.params;

  // check product existence
  const product = await productModel.findById(productId);
  if (!product) return next(new Error("Product not found!", { cause: 404 }));

  // response
  return res.json({ success: true, results: product });
});

// Patch product controller for updating defaultImage and subImages
export const updateProduct = CatchError(async (req, res, next) => {
  const productId = req.params.productId;
  const Name = req.body.Name
  // Check if product exists
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  // Update defaultImage if provided
  if (req.files.defaultImage) {
    const defaultImage = req.files.defaultImage[0];
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      defaultImage.path,
      { folder: `${process.env.foldercloudnairy}/products/${product.cloudFolder}` }
    );
  
    product.defaultImage = { url: secure_url, id: public_id };
  }

  // Update subImages if provided
  if (req.files.subImages) {
    const subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.foldercloudnairy}/products/${product.cloudFolder}` }
      );
      subImages.push({ url: secure_url, id: public_id });
    }

    product.images = subImages;
  }
  if(Name){
    product.Name=Name
  }
  // Save the updated product
  const updatedProduct = await product.save();

  // Send response
  return res.json({ success: true, results: updatedProduct });
});
export const SearchProduct = CatchError(async (req, res, next) => {
  const { name } = req.query;
  
  // Changed $regex usage
  const Product = await productModel.find({ Name: { $regex: new RegExp(name, 'i') } })
  
  return res.json({ status: 200, success: true, Product });
});