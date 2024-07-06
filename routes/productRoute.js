import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { 
    createProductController, 
    deleteProductController, 
    getProductController, 
    getSingleProductController, 
    productPhotoController, 
    updateProductController ,
    productFilterController,
    productCountController,
    productListController,
    searchController
} from '../controller/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);
router.get('/get-product', getProductController);
router.get('/get-product/:slug', getSingleProductController);
router.get('/product-photo/:pid', productPhotoController);
router.delete('/delete-product/:pid', deleteProductController);
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);
router.post('/product-filters', productFilterController)
router.get('/product-count', productCountController)
router.get('/product-list/:page', productListController)
router.get('/search/:keyword', searchController)

export default router;
