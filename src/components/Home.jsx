import { Link } from "react-router-dom";
import { logout, auth } from "../firebase"; 
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth"; 

const Home = () => {
  const [user, loadingAuth] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.message || "Failed to log out. Please try again.");
    }
  };

  
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* ----------Navbar Section-------------- */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Cost Tracker</h1>
        <div className="flex items-center space-x-6">
          <Link to={"/products"} className="text-gray-600 hover:text-blue-700 transition duration-200">
            Items
          </Link>
          <Link to={"/cart"} className="text-gray-600 hover:text-blue-700 transition duration-200">
            Cart
          </Link>
          {user ? ( 
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
            >
              Logout
            </button>
          ) : ( 
            <>
              <Link to={"/login"} className="text-blue-600 hover:text-blue-800 font-medium">
                Login
              </Link>
              <Link to={"/signup"} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          {user ? (
            <>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-fade-in-down">
                Welcome Back, {user.displayName || user.email}!
              </h1>
              <p className="text-xl mb-8 opacity-90 animate-fade-in">
                Ready to manage your next project's costs?
              </p>
              <div className="flex justify-center space-x-4 animate-fade-in-up">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-300"
                >
                  Start Adding Items
                </Link>
                <Link
                  to="/cart"
                  className="bg-blue-800 text-white hover:bg-blue-900 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-300"
                >
                  View My Cart
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-fade-in-down">
                Effortlessly Track Your Project Costs
              </h1>
              <p className="text-xl mb-8 opacity-90 animate-fade-in">
                Gain clarity, stay on budget, and ensure project success with our intuitive cost tracking solution.
              </p>
              <div className="flex justify-center space-x-4 animate-fade-in-up">
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-800 text-white hover:bg-blue-900 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-300"
                >
                  Login
                </Link>
              </div>
              <div className="mt-12">
                 <img src="https://images.unsplash.com/photo-1557804506-6962f3a61d62?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Project Tracking Dashboard" className="max-w-2xl mx-auto rounded-lg shadow-2xl" />
              </div>
            </>
          )}
        </div>
      </section>

      {/* --- */}

      {/*----------Features Section-------------*/}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Empowering Your Project Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Instant Cost Overview</h3>
              <p className="text-gray-700">
                Add project items and watch your total estimated cost update dynamically. Stay informed, always.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-100">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Secure & Personal Data</h3>
              <p className="text-gray-700">
                Your project expenses are tied to your secure account, accessible only by you and saved in the cloud.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-100">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">Flexible Item Management</h3>
              <p className="text-gray-700">
                Easily add, remove, and adjust quantities of items in your project cart to reflect your evolving needs.
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-100">
              <h3 className="text-xl font-semibold text-yellow-700 mb-3">Comprehensive Catalog</h3>
              <p className="text-gray-700">
                Browse a curated list of common project resources to quickly build your cost breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------Tech Stack Section-----------*/}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Built With Modern Technologies</h2>
          <p className="text-gray-600 mb-12">
            This Project Cost Tracker is developed using a robust and scalable stack, ensuring a fast and reliable experience:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            <div className="flex flex-col items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="h-20 w-20 mb-3" />
              <span className="text-xl font-semibold text-gray-700">React</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="Tailwind CSS" className="h-20 w-20 mb-3" />
              <span className="text-xl font-semibold text-gray-700">Tailwind CSS</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" alt="Firebase" className="h-20 w-20 mb-3" />
              <span className="text-xl font-semibold text-gray-700">Firebase</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://vitejs.dev/logo.svg" alt="Vite" className="h-20 w-20 mb-3" />
              <span className="text-xl font-semibold text-gray-700">Vite (Build Tool)</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="h-20 w-20 mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a2 2 0 11-4 0m4 0h-4"></path></svg>
              <span className="text-xl font-semibold text-gray-700">React Hot Toast</span>
            </div>
          </div>
        </div>
      </section>

      {/* -----------Simple Footer-----------*/}
      <footer className="bg-gray-800 text-white py-8 text-center text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Project Cost Tracker. All rights reserved.</p>
          <p className="mt-2">Built with ❤️ for your next project.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;