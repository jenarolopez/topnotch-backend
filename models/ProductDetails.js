const poolConnection = require("../config/connectDB");
const Product = require("./product");

class ProductDetails {
  #productId;
  #orderId;
  #customerId;
  #quantity;

  constructor(ctorProductDetails) {
    const {
      customer_id = "",
      product_id = "",
      order_id = "",
    } = ctorProductDetails;
    this.#productId = product_id;
    this.#orderId = order_id;
    this.#customerId = customer_id;
    this.#quantity = 1;
  }

  selectItemById = async () => {
    try {
      const selectQuery = `SELECT * FROM product_details WHERE product_id = ? AND customer_id = ? AND is_active = ? AND order_id IS NULL`;
      const [result, _] = await poolConnection.execute(selectQuery, [
        this.#productId,
        this.#customerId,
        true,
      ]);
      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  addItem = async () => {
    try {
      const product = await this.selectItemById();
      if (!product?.id) {
        const insertQuery = `INSERT INTO product_details (product_id, customer_id, quantity, is_active) VALUES (?, ?, ?, ?)`;

        const [result, _] = await poolConnection.execute(insertQuery, [
          this.#productId,
          this.#customerId,
          this.#quantity,
          true,
        ]);
        return {
          result,
          action: "insert",
        };
      } else {
        const UpdateQuery = `UPDATE product_details SET quantity = ? WHERE id = ?`;

        const [result, _] = await poolConnection.execute(UpdateQuery, [
          product?.quantity + 1,
          product?.id,
        ]);
        
        return {
          result,
          action: "update",
        };
      }
    } catch (error) {
      console.error("...", error.message);
    }
  };

  getItems = async () => {
    try {
      const selectQuery = `SELECT 
          pd.id, 
          p.id as product_id,
          p.product_name,
          p.product_price,
          p.product_description,
          p.pet_type, 
          p.product_date_added,
          pal.age_limit as product_age_limit,
          pc.category as product_category,
          p.product_image_url,
          p.product_image_id,
          pd.quantity,
          p.product_stocks
        FROM product_details pd
        INNER JOIN products p
        ON p.id = pd.product_id
        INNER JOIN product_age_limit pal
        ON p.age_limit_id = pal.id
        INNER JOIN product_category pc
        ON p.category_id = pc.id
        WHERE order_id IS NULL AND
        pd.customer_id = ? AND 
        pd.is_active = ?`;

      const [result, _] = await poolConnection.execute(selectQuery, [
        this.#customerId,
        true,
      ]);

      if (result.length > 0) {
        return result;
      }
      return false;
    } catch (error) {
      console.error(error.message);
    }
  };

  deleteItem = async () => {
    try {
      const deleteQuery = `
      DELETE FROM product_details WHERE id = ? AND customer_id = ? AND is_active = ?;
      `;
      const [result, _] = await poolConnection.execute(deleteQuery, [
        this.#productId,
        this.#customerId,
        true,
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error(error.message);
    }
  };

  updateQuantity = async (action, product) => {
    try {
      const { quantity } = product;

      if (quantity - 1 <= 0 && action === "decremeant") {
        const deleteQuery = `
      DELETE FROM product_details
      WHERE id = ?
      `;
        const [result, _] = await poolConnection.execute(deleteQuery, [
          this.#productId,
        ]);

        action = "delete";
        return {
          result,
          action,
        };
      }

      const updateQuery = `
      UPDATE product_details SET quantity = ?
      WHERE id = ?
      `;
      const [result, _] = await poolConnection.execute(updateQuery, [
        action === "incremeant" ? quantity + 1 : quantity - 1,
        this.#productId,
      ]);

      return {
        result,
        action,
      };
    } catch (error) {
      console.error(error.message);
    }
  };

  insertOrderId = async (products) => {
    try {
      const updateQuery = `UPDATE product_details SET order_id = ? WHERE id IN (?);`;
      const productIds = products.map((product) => product.id);

      const result = await poolConnection.query(updateQuery, [
        this.#orderId,
        productIds,
      ]);
      return result;
    } catch (error) {
      console.error(error.message);
    }
  };
}

module.exports = ProductDetails;
