import logo from './logo.svg';
import './App.css';
import './index.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Welcome from './components/Welcome.js';
import {CustomNavbar} from './components/Navbar.js';
import Signup from './components/Signup.js';
import Login from './components/Login.js';
import ProductCard from './components/ProductCard.js';
import Cart from './components/Cart.js';
import UserProfile from './components/UserProfile.js';
import UpdateUserProfile from './components/UpdateUserProfile.js';
import OrderConfirmation from './components/OrderConfirmation.js';

function App() {
  return (
    <>
    <CustomNavbar/>
    <Routes>
      <Route path="/" element={<Welcome></Welcome>} />
      <Route path='/signup' element={<Signup></Signup>} />
      <Route path='/login' element={<Login />} />
      <Route path="/products/:id" element={<ProductCard />} />
      <Route path='/cart' element={<Cart></Cart>} />
      <Route path="/users/profile" element={<UserProfile />} />
      <Route path="/users/profile/update" element={<UpdateUserProfile />} />
      <Route path="/order" element={<OrderConfirmation />} />

    </Routes>
    </>
  );
}

export default App;
