import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (loadingAuth || errorAuth || !user) {
      setCartItems([]);
      setProductDetails({});
      setTotalCost(0);
      setLoadingCart(false);
      return;
    }

    setLoadingCart(true);
    setErrorCart(null);

    const userCartCollectionRef = collection(db, 'users', user.uid, 'cartItems');

    const unsubscribe = onSnapshot(userCartCollectionRef, async (cartSnapshot) => {
      const newCartItems = [];
      const productIdsToFetch = new Set();
      cartSnapshot.forEach(doc => {
        const cartItem = { id: doc.id, ...doc.data() };
        newCartItems.push(cartItem);
        productIdsToFetch.add(cartItem.productId);
      });

      const newProductDetails = { ...productDetails };
      let currentTotal = 0;

      for (const productId of productIdsToFetch) {
        if (!newProductDetails[productId]) {
          try {
            const productDocRef = doc(db, 'products', productId);
            const productDocSnap = await getDoc(productDocRef);

            if (productDocSnap.exists()) {
              newProductDetails[productId] = { id: productDocSnap.id, ...productDocSnap.data() };
            } else {
              console.warn(`Product with ID ${productId} referenced in cart not found.`);
              newProductDetails[productId] = null;
            }
          } catch (err) {
            console.error(`Error fetching product ${productId} details:`, err);
            newProductDetails[productId] = null;
          }
        }
      }

      newCartItems.forEach(cartItem => {
        const product = newProductDetails[cartItem.productId];
        if (product) {
          currentTotal += product.cost * cartItem.quantity;
        }
      });

      setCartItems(newCartItems);
      setProductDetails(newProductDetails);
      setTotalCost(currentTotal);
      setLoadingCart(false);

    }, (err) => {
      console.error('Error with real-time cart listener:', err);
      setErrorCart('Failed to load cart. Please try again.');
      setLoadingCart(false);
    });

    return () => unsubscribe();
  }, [user, loadingAuth, errorAuth]);

  const handleRemoveFromCart = async (cartItemId, productName) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'cartItems', cartItemId));
      toast.success(`"${productName}" removed from cart.`);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(`Failed to remove "${productName}" from cart: ${error.message}`);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity, productName) => {
    if (newQuantity < 1) {
      toast.error('Quantity cannot be less than 1. Please remove the item instead.');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', user.uid, 'cartItems', cartItemId), {
        quantity: newQuantity
      });
      toast.success(`Quantity of "${productName}" updated.`);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(`Failed to update quantity for "${productName}": ${error.message}`);
    }
  };

  if (loadingAuth) {
    return <p className="text-center my-5 text-gray-600">Loading authentication status...</p>;
  }

  if (errorAuth) {
    return <p className="text-center my-5 text-red-600">Authentication Error: {errorAuth.message}</p>;
  }

  if (!user) {
    return <p className="text-center my-5 text-gray-700">Please log in to view your cart.</p>;
  }

  if (loadingCart) {
    return <p className="text-center my-5 text-gray-600">Loading your project items...</p>;
  }

  if (errorCart) {
    return <p className="text-center my-5 text-red-600">{errorCart}</p>;
  }

  const hasItems = cartItems.some(item => productDetails[item.productId]);

  return (

    <div className="max-w-4xl mx-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white mt-8">
        <Link className='font-bold text-[20px] text-blue-500' to={"/"}>Home</Link>
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Your Project Cart</h2>

      <h3 className="text-right text-2xl font-bold text-blue-600 border-b pb-3 mb-6 border-gray-200">
        Total Estimated Cost: <span className="text-green-600">${totalCost.toFixed(2)}</span>
      </h3>

      {!hasItems ? (
        <p className="text-center text-gray-600 py-10">
          ${`Your cart is empty. Add items from the 'Available Items' section to start tracking costs!`}
        </p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((cartItem) => {
            const product = productDetails[cartItem.productId];

            if (!product) {
              console.warn(`Product details not available for cart item ID: ${cartItem.id} (Product ID: ${cartItem.productId})`);
              return null;
            }

            return (
              <li key={cartItem.id} className="flex items-center p-4 border border-gray-100 rounded-md bg-gray-50 shadow-sm transition-transform duration-200 hover:shadow-md">
                {/* Product Avatar */}
                {product.avatar && (
                  <img
                    src={product.avatar}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md mr-4 flex-shrink-0 border border-gray-200"
                  />
                )}
                <div className="flex-grow">
                  <h4 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Cost per unit: <span className="font-medium">${product.cost.toFixed(2)}</span>
                  </p>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-1">
                    <label htmlFor={`qty-${cartItem.id}`} className="text-gray-700 text-sm">Quantity:</label>
                    <input
                      type="number"
                      id={`qty-${cartItem.id}`}
                      min="1"
                      value={cartItem.quantity}
                      onChange={(e) => handleUpdateQuantity(cartItem.id, parseInt(e.target.value, 10), product.name)}
                      className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <strong className="text-lg text-blue-700">
                      Subtotal: <span className="text-green-600">${(product.cost * cartItem.quantity).toFixed(2)}</span>
                    </strong>
                  </div>
                  {/*----------Date Added-----------*/}
                  {cartItem.dateAddedToCart && (
                    <p className="text-gray-500 text-xs mt-1">
                      Added: {cartItem.dateAddedToCart.toDate().toLocaleDateString()}
                    </p>
                  )}
                </div>
                {/* ---------Remove Button----------*/}
                <button
                  onClick={() => handleRemoveFromCart(cartItem.id, product.name)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 text-sm flex-shrink-0 ml-4"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Cart;