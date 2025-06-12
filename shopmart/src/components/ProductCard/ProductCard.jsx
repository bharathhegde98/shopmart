import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext"; // <-- Use your CartContext

const ProductCard = ({ title, productItem }) => {
  const { addToCart } = useCart(); // <-- Context method
  const router = useNavigate();

  const handleClick = () => {
    router(`/shop/${productItem.id}`);
  };

  const handleAdd = () => {
    addToCart(productItem, 1); // Assuming your context takes (product, quantity)
    toast.success("Product has been added to cart!");
  };

  return (
    <Col md={3} sm={5} xs={10} className="product mtop">
      {title === "Big Discount" && (
        <span className="discount">{productItem.discount}% Off</span>
      )}
      <img
        loading="lazy"
        onClick={handleClick}
        src={productItem.imgUrl}
        alt={productItem.productName}
      />
      <div className="product-like">
        <ion-icon name="heart-outline"></ion-icon>
      </div>
      <div className="product-details">
        <h3 onClick={handleClick}>{productItem.productName}</h3>
        <div className="rate">
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>
        <div className="price">
          <h4>${productItem.price}</h4>
          <button
            aria-label="Add"
            type="button"
            className="add"
            onClick={handleAdd}
          >
            <ion-icon name="add"></ion-icon>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
