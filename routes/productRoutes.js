const express = require("express");

const router = express.Router();
const productController = require("../controllers/productController");
const {verifyUser} = require('../middlewares/verifyUser');

router.post("/addItem", verifyUser,productController.addItem);
router.get("/getAllItems",verifyUser ,productController.getAllItems);
router.delete("/deleteProduct/:id",verifyUser ,productController.deleteProduct);
router.post("/updateItem",verifyUser ,productController.updateItem);
router.post('/searchItems/', verifyUser, productController.searchItems)

router.post("/addCategory", verifyUser,productController.addCategory);
router.get("/getAllCategory",verifyUser ,productController.getAllCategory);
router.patch('/updateCategory/:id', verifyUser, productController.updateCategory)
router.delete("/deleteCategory/:id",verifyUser ,productController.deleteCategory);

// router.delete("/deleteProduct/:id",verifyUser ,productController.deleteProduct);
// router.post("/updateItem",verifyUser ,productController.updateItem);

router.post('/addProductAgeLimit', verifyUser, productController.addProductAgeLimit)
router.get('/getAllProductAgeLimit', verifyUser, productController.getAllProductAgeLimit)
router.patch('/updateAgeLimit/:id', verifyUser, productController.updateAgeLimit)
router.delete("/deleteAgeLimit/:id",verifyUser ,productController.deleteAgeLimit);


module.exports = router;
