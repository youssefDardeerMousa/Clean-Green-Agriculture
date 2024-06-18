import productModel from "../../../DB/models/product.model.js";
import subCategoryModel from "../../../DB/models/subcategory.model.js";
import { WishlistModel } from "../../../DB/models/wishlist.model.js";

export const addToWishlist = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.body;

  try {
    let wishlist = await WishlistModel.findOne({ user: _id });

    if (!wishlist) {
      wishlist = new WishlistModel({ user: _id });
    }

    // Try to find the item in products first
    const product = await productModel.findById(id);
    if (product) {
      if (wishlist.products.some(p => p.productId.equals(id))) {
        return res.status(400).json({ message: "Product already in wishlist" });
      } else {
        wishlist.products.push({ productId: id });
      }
    } else {
      // If not found in products, try to find it in subcategories
      const subcategory = await subCategoryModel.findById(id);
      if (subcategory) {
        if (wishlist.subcategories.some(s => s.subcategoryId.equals(id))) {
          return res.status(400).json({ message: "Subcategory already in wishlist" });
        } else {
          wishlist.subcategories.push({ subcategoryId: id });
        }
      } else {
        // If not found in both, return an error
        return res.status(404).json({ message: "Item not found" });
      }
    }

    await wishlist.save();
    res.status(200).json({ message: "Item added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
export const removeFromWishlist = async (req, res) => {
  const { _id } = req.user;
    const { id } = req.body;

  try {
    const wishlist = await WishlistModel.findOne({ user: _id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Try to find the item in products first
    const product = await productModel.findById(id);
    if (product) {
      wishlist.products = wishlist.products.filter(p => !p.productId.equals(id));
    } else {
      // If not found in products, try to find it in subcategories
      const subcategory = await subCategoryModel.findById(id);
      if (subcategory) {
        wishlist.subcategories = wishlist.subcategories.filter(s => !s.subcategoryId.equals(id));
      } else {
        // If not found in both, return an error
        return res.status(404).json({ message: "Item not found in wishlist" });
      }
    }

    await wishlist.save();
    res.status(200).json({ message: "Item removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  const { _id } = req.user;

  try {
    const wishlist = await WishlistModel.findOne({ user: _id })
      .populate("products.productId")
      .populate("subcategories.subcategoryId");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const productCount = wishlist.products.length;
    const subcategoryCount = wishlist.subcategories.length;
    const totalCount = productCount + subcategoryCount;

    res.status(200).json({ 
      wishlist, 
      counts: {
        productCount,
        subcategoryCount,
        totalCount
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
