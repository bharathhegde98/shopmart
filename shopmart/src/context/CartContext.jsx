import { createContext, useContext, useState, useEffect } from "react"; // Import useEffect

// The context itself doesn't change
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. UPDATE: Initialize state from localStorage or an empty array
  const [cartList, setCartList] = useState(() => {
    try {
      const savedCart = localStorage.getItem("shopmartCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  // 2. ADD: A useEffect hook to save the cart to localStorage whenever it changes
  useEffect(() => {
    // This function will run every time the `cartList` state is updated
    localStorage.setItem("shopmartCart", JSON.stringify(cartList));
  }, [cartList]); // The dependency array ensures this runs only when `cartList` changes

  // Your existing functions remain the same
  const addToCart = (product) => {
    const productIndex = cartList.findIndex((item) => item.id === product.id);
    if (productIndex !== -1) {
      const updatedList = [...cartList];
      updatedList[productIndex].qty += 1;
      setCartList(updatedList);
    } else {
      setCartList([...cartList, { ...product, qty: 1 }]);
    }
  };

  const decreaseQty = (product) => {
    const productIndex = cartList.findIndex((item) => item.id === product.id);
    if (productIndex !== -1) {
      const updatedList = [...cartList];
      if (updatedList[productIndex].qty === 1) {
        updatedList.splice(productIndex, 1);
      } else {
        updatedList[productIndex].qty -= 1;
      }
      setCartList(updatedList);
    }
  };

  const deleteProduct = (product) => {
    setCartList(cartList.filter((item) => item.id !== product.id));
  };

  return (
    <CartContext.Provider
      value={{ cartList, addToCart, decreaseQty, deleteProduct }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Your custom hooks are perfect
export const useCartContext = () => useContext(CartContext);
export const useCart = useCartContext;