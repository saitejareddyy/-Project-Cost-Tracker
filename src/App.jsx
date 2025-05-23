import { Route, Routes, useNavigate } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import { onAuthStateChanged } from "firebase/auth"
import { useEffect } from "react"
import { auth } from "./firebase"
import ProductList from "./components/ProductList"
import Cart from "./components/Cart"

const App = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    onAuthStateChanged(auth, async (user) => {
      if(user){
        console.log("Logged In");
        navigate("/");
      }
      else{
        console.log("Logged Out");
        navigate("/login");
      }
    });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/products" element={<ProductList/>} />
        <Route path="/cart" element={<Cart/>} />
      </Routes>
    </div>
  )
}

export default App