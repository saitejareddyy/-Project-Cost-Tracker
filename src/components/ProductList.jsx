import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, increment, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null); 

  useEffect(() => {
    setLoadingProducts(true);
    setErrorProducts(null);

    const productsCollectionRef = collection(db, 'products'); 

    const unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoadingProducts(false);
    }, (err) => {
      console.error('Error fetching products:', err);
      setErrorProducts('Failed to load products.');
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, []); 
  
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    setAddingToCartId(product.id); 

    try {
      const cartItemRef = doc(db, 'users', user.uid, 'cartItems', product.id);
      const cartDoc = await getDoc(cartItemRef); 

      if (cartDoc.exists()) {
        await updateDoc(cartItemRef, {
          quantity: increment(1), 
          dateAddedToCart: Timestamp.now() 
        });
        toast.success(`Increased quantity of "${product.name}" in cart!`);
      } else {
       
        await setDoc(cartItemRef, { 
          productId: product.id,
          quantity: 1, 
          dateAddedToCart: Timestamp.now() 
        });
        toast.success(`"${product.name}" added to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(`Failed to add "${product.name}" to cart: ${error.message}`);
    } finally {
      setAddingToCartId(null); 
    }
  };



  if (loadingProducts) {
    return <p className="text-center my-5 text-gray-600">Loading available items...</p>;
  }

  if (errorProducts) {
    return <p className="text-center my-5 text-red-600">{errorProducts}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white mt-8">
        <Link className='font-bold text-[20px] text-blue-500' to={"/"}>Home</Link>
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Available Project Items</h2>

      
      {loadingAuth && (
        <p className="text-center text-gray-500 mb-4">Checking login status...</p>
      )}
      {errorAuth && (
        <p className="text-center text-red-500 mb-4">Authentication Error: Cannot add items to cart.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center p-5 border border-gray-100 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            {product.avatar && (
              <img
                src={product.avatar}
                alt={product.name}
                className="w h-32 object-cover rounded-md mb-4 border border-gray-200"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{product.name}</h3>
            <p className="text-gray-600 text-sm text-center mb-3 line-clamp-3">
              {product.description}
            </p>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              ${product.cost.toFixed(2)}
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={!user || loadingAuth || errorAuth || addingToCartId === product.id}
              className={`
                px-5 py-2 rounded-md font-semibold text-white transition duration-200
                ${
                  (!user || loadingAuth || errorAuth || addingToCartId === product.id)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75'
                }
              `}
            >
              {addingToCartId === product.id ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;