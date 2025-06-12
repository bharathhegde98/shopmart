// src/components/CartSidebar.jsx
import { useCartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import "./cart-sidebar.css";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartList, addToCart, decreaseQty } = useCartContext();

  const totalPrice = cartList.reduce(
    (price, item) => price + item.qty * item.price,
    0
  );

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-sidebar-header">
        <h2>Shopping Cart</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      {cartList.length === 0 ? (
        <p className="empty-cart">No items in the cart.</p>
      ) : (
        <>
          <div className="cart-items-list">
            {cartList.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.imgUrl} alt={item.productName} />
                <div>
                  <h6>{item.productName}</h6>
                  <p>${item.price} × {item.qty}</p>
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${totalPrice}</h3>
            <Link to="/cart" className="view-cart-link" onClick={onClose}>
              View Full Cart
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
