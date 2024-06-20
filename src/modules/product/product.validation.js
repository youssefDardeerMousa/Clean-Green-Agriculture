import joi from "joi";

// create product
export const createProductSchema = joi
  .object({
    Name: joi.string().required().min(2).max(20),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    categoryId: joi.string(),
    subcategoryId: joi.string()
  })
  .required();

// delete product + get single product
export const productIdSchema = joi
  .object({
    productId: joi.string().required(),
  })
  .required();


  export const validateSearchProduct = (req, res, next) => {
    console.log('Received query:', req.query);
  
    const schema = Joi.object({
      name: joi.string().required(),
    });
  
    const { error } = schema.validate(req.query);
  
    if (error) {
      console.log('Validation error:', error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
    
    next();
  };