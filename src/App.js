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
import ProductForm from './components/ProductForm.js';
import ProductGridAdmin from './components/ProductListAdmin.js';
import ProductUpdateForm from './components/ProductUpdateForm.js';
import UsersList from './components/UsersList.js';
import AdminDashboard from './components/AdminDashboard.js';
import OrderHistory from './components/OrderHistory.js';
import OrderStatusUpdate from './components/OrderStatusUpdate.js';
import ProductsByCategoryGrid from './components/ProductsByCategory.js';
import AddCategoryForm from './components/AddCategoryForm.js';

function App() {
  return (
    <>
    <CustomNavbar/>
    <Routes>
      <Route path="/" element={<Welcome></Welcome>} />
      <Route path='/signup' element={<Signup></Signup>} />
      <Route path='/login' element={<Login />} />
      <Route path="/products/:id" element={<ProductCard />} />
      <Route path= "/productsByCategory/:id" element= {<ProductsByCategoryGrid />} />
      <Route path='/cart' element={<Cart></Cart>} />
      <Route path="/users/profile" element={<UserProfile />} />
      <Route path="/users/profile/update" element={<UpdateUserProfile />} />
      <Route path="/order" element={<OrderConfirmation />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/orders/update" element={<OrderStatusUpdate />} />
      <Route path="/product/add" element={<ProductForm />} />
      <Route path="/admin/product" element={<ProductGridAdmin />} />
      <Route path="/products/update/:id" element={<ProductUpdateForm />} />
      <Route path='/users' element={<UsersList/>} />
      <Route path= '/admin' element={<AdminDashboard />} />
      <Route path='/category/add' element={< AddCategoryForm/>} />

    </Routes>
    </>
  );
}

export default App;
