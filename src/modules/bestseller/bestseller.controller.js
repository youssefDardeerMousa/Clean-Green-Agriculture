import { BestSellerModel } from "../../../DB/models/bestseller.model.js";
import productModel from "../../../DB/models/product.model.js";
import subCategoryModel from "../../../DB/models/subcategory.model.js";
import { CatchError } from "../../../utils/catch_error.js";

// add best seller
export const bestselleradd = CatchError(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const product = await productModel.findById(id);
    const subcategory = await subCategoryModel.findById(id);

    let bestSeller = await BestSellerModel.findOne({ user });

    if (product) {
        if (!bestSeller) {
            bestSeller = new BestSellerModel({ user, product: [id] });
        } else {
            if (!bestSeller.product.includes(id)) {
                bestSeller.product.push(id);
            }
        }
        await bestSeller.save();
        return res.status(200).json({ success: true, message: "Product added to best seller" });
    } else if (subcategory) {
        if (!bestSeller) {
            bestSeller = new BestSellerModel({ user, subcategory: [id] });
        } else {
            if (!bestSeller.subcategory.includes(id)) {
                bestSeller.subcategory.push(id);
            }
        }
        await bestSeller.save();
        return res.status(200).json({ success: true, message: "Subcategory added to best seller" });
    }

    return res.status(400).json({ success: false, message: "Product or subcategory not found" });
});

// all best seller
export const AllBestSeller=CatchError(async (req,res,next)=>{
 let bestseller= await BestSellerModel.find().populate({
    path: 'product',
    model: 'Product'
}).populate({
    path: 'subcategory',
    model: 'Subcategory'
});
 return res.json({bestseller})
})