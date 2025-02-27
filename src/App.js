import './App.css';
import './index.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Welcome from './components/Welcome.js';
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
import OrderHistory from './components/OrderHistory.js';
import OrderStatusUpdate from './components/OrderStatusUpdate.js';
import ProductsByCategoryGrid from './components/ProductsByCategory.js';
import AddCategoryForm from './components/AddCategoryForm.js';
import PaymentSuccess from './components/PaymentSuccess.js'
import Layout from './components/Layout.js';
import PrivateRoute from './components/PrivateRoute.js';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout></Layout>}>

          <Route path="/" element={<Welcome />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path="/products/:id" element={<ProductCard />} />
          <Route path="/productsByCategory/:id" element={<ProductsByCategoryGrid />} />


          <Route path='/cart' element={<PrivateRoute roles={['customer']}><Cart /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute roles={['customer']}> <PaymentSuccess /> </PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute roles={['customer']}> <OrderConfirmation /> </PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute roles={['customer']}> <OrderHistory /> </PrivateRoute>} />

          <Route path="/orders/update" element={<PrivateRoute roles={['admin']}><OrderStatusUpdate /></PrivateRoute>} />
          <Route path="/product/add" element={<PrivateRoute roles={['admin']}><ProductForm /></PrivateRoute>} />
          <Route path="/admin/product" element={<PrivateRoute roles={['admin']}><ProductGridAdmin /></PrivateRoute>} />
          <Route path="/products/update/:id" element={<PrivateRoute roles={['admin']}><ProductUpdateForm /></PrivateRoute>} />
          <Route path='/users' element={<PrivateRoute roles={['admin']}><UsersList /></PrivateRoute>} />
          <Route path='/category/add' element={<PrivateRoute roles={['admin']}>< AddCategoryForm /></PrivateRoute>} />

          <Route path="/users/profile" element={<PrivateRoute roles={['customer', 'admin']}> <UserProfile /> </PrivateRoute>} />
          <Route path="/users/profile/update" element={<PrivateRoute roles={['customer', 'admin']}> <UpdateUserProfile /> </PrivateRoute>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
