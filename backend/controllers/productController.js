import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";

const cleanProductFromCarts = async (productId, validSizes) => {
  try {
    const users = await userModel.find({ cartData: { $exists: true, $ne: {} } });

    for (const user of users) {
      let cartData = user.cartData;

      if (!cartData[productId]) continue;

      
      for (const size of Object.keys(cartData[productId])) {
        if (!validSizes.includes(size)) {
          delete cartData[productId][size];
        }
      }

      
      if (Object.keys(cartData[productId]).length === 0) {
        delete cartData[productId];
      }

      await userModel.findByIdAndUpdate(user._id, { cartData });
    }

    
  } catch (error) {
    
  }
};


// function for add product

const addProduct = async (req,res)=>{

    try {
        
        const {name, description, price, category, subCategory, sizes, bestseller}=req.body

        const image1 = req.files.image1 && req.files.image1[0]    
        const image2 = req.files.image2 && req.files.image2[0]    
        const image3 = req.files.image3 && req.files.image3[0]    
        const image4 = req.files.image4 && req.files.image4[0]    

        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)

        let imageUrl = await Promise.all(
            images.map(async (item) =>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price:Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);

        await product.save()
        
        res.json({success:true,message:"Product Added"})   
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message}) 
    }
    
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, category, subCategory, sizes, bestseller, removedImages } = req.body

    const product = await productModel.findById(id)
    if (!product) {
      return res.json({ success: false, message: "Product not found" })
    }

    // Start with current images
    let imageUrls = [...product.image]

    // Handle removed images (delete from Cloudinary and remove from array)
    if (removedImages) {
      const removedIndices = JSON.parse(removedImages)
      for (const index of removedIndices) {
        if (imageUrls[index]) {
          // Delete from Cloudinary
          try {
            const urlParts = imageUrls[index].split('/')
            const uploadIndex = urlParts.indexOf('upload')
            if (uploadIndex !== -1) {
              const pathWithVersion = urlParts.slice(uploadIndex + 1).join('/')
              const publicId = pathWithVersion.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '')
              await cloudinary.uploader.destroy(publicId)
            }
          } catch (err) {
            console.log('Error deleting image from Cloudinary:', err.message)
          }
          // Set to null (will be filtered later)
          imageUrls[index] = null
        }
      }
    }

    // Handle new image uploads - replace at specific positions
    const imageMap = {
      image1: 0,
      image2: 1,
      image3: 2,
      image4: 3
    }

    for (const [fieldName, index] of Object.entries(imageMap)) {
      if (req.files[fieldName]) {
        const file = req.files[fieldName][0]
        // Delete old image at this position if exists
        if (imageUrls[index]) {
          try {
            const urlParts = imageUrls[index].split('/')
            const uploadIndex = urlParts.indexOf('upload')
            if (uploadIndex !== -1) {
              const pathWithVersion = urlParts.slice(uploadIndex + 1).join('/')
              const publicId = pathWithVersion.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '')
              await cloudinary.uploader.destroy(publicId)
            }
          } catch (err) {
            console.log('Error deleting old image:', err.message)
          }
        }
        // Upload new image
        const result = await cloudinary.uploader.upload(file.path)
        imageUrls[index] = result.secure_url
      }
    }

    // Filter out null values and ensure array has max 4 elements
    imageUrls = imageUrls.filter(url => url !== null).slice(0, 4)

    const parsedSizes = JSON.parse(sizes)

    await productModel.findByIdAndUpdate(id, {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true" || bestseller === true,
      sizes: parsedSizes,
      image: imageUrls
    })

    
    await cleanProductFromCarts(id, parsedSizes)

    res.json({ success: true, message: "Product Updated and Cart Updated" })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}



//function for list product
const listProducts = async (req,res)=>{
    try {

        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message}) 
    }


}


//function for removing product from cartData
const removeProductFromCarts = async (productId) => {
  try {
    const users = await userModel.find({ "cartData": { $exists: true, $ne: {} } });

    for (const user of users) {
      let cartData = user.cartData;

      if (cartData[productId]) {
        delete cartData[productId]; // remove the product from cartData
        await userModel.findByIdAndUpdate(user._id, { cartData });
      }
    }

    
  } catch (error) {
    
  }
};


//function for removing product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Delete product images from Cloudinary
    if (product.image && product.image.length > 0) {
      for (const imageUrl of product.image) {
        try {
          const urlObj = new URL(imageUrl);
          const pathParts = urlObj.pathname.split("/");
          const uploadIndex = pathParts.indexOf("upload");
          if (uploadIndex !== -1) {
            const afterUpload = pathParts.slice(uploadIndex + 1);
            if (afterUpload.length > 0) {
              const publicIdWithExt = afterUpload.slice(1).join("/");
              const publicId = publicIdWithExt.split(".")[0];
              await cloudinary.uploader.destroy(publicId);
            }
          }
        } catch (err) {
          console.log(`Error deleting image: ${err.message}`);
          
        }
      }
    }

    // Delete product from database
    await productModel.findByIdAndDelete(id);

    // Delete all reviews related to this product
    await reviewModel.deleteMany({ productId: id });

    // Remove product from all users' carts
    await removeProductFromCarts(id);

    res.json({ success: true, message: "Product removed and deleted from all users carts" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function for single product info
const singleProduct = async (req,res)=>{
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message}) 
    }

}

// Function to delete single image from Cloudinary and update product
const deleteImage = async (req, res) => {
  try {
    const { imageUrl, productId } = req.body;
    
    if (!imageUrl || !productId) {
      return res.json({ success: false, message: "Image URL and Product ID required" });
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) {
      return res.json({ success: false, message: "Invalid Cloudinary URL" });
    }
    
    // Get the part after 'upload/' (including version and path)
    const pathWithVersion = urlParts.slice(uploadIndex + 1).join('/');
    // Remove version number (v1234567890/)
    const publicId = pathWithVersion.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok' || result.result === 'not found') {
      // Find product and remove the image from image array
      const product = await productModel.findById(productId);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      // Remove the image URL from the product's image array
      product.image = product.image.filter(img => img !== imageUrl);
      await product.save();

      res.json({ success: true, message: "Image deleted successfully" });
    } else {
      res.json({ success: false, message: "Failed to delete image from Cloudinary" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {listProducts, addProduct, removeProduct, singleProduct, updateProduct, deleteImage}