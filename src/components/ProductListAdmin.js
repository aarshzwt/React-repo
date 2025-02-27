import React, { useState, useEffect } from "react";
import { FaTrash, FaPen } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setProducts, setError } from "../redux/slices/productSlice";
import toast from "react-hot-toast";



const ProductCard = React.memo(({ product}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`products/${productId}`);
        dispatch(setProducts(prevProducts =>
          prevProducts.filter(product => product.id !== productId)
        ));
        toast.success("Product has been deleted successfully");
      } catch (error) {
        toast.success("Failed to delete product");
        dispatch(setError('Failed to delete product'));
      }
    }
  };

  return (
    <div className="relative group bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={`http://localhost:5000${product.image_url}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => navigate(`/products/update/${product.id}`)}
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
            aria-label="Edit product"
          >
            <FaPen className="w-5 h-5 text-blue-600 transition-transform duration-200 hover:scale-110" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
            aria-label="Delete product"
          >
            <FaTrash className="w-5 h-5 text-red-500 transition-transform duration-200 hover:scale-110" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div>
          <span className="text-xl font-bold text-gray-900">
          ₹{product.price}
          </span>
        </div>
      </div>
    </div>
  );
});

const ProductGridAdmin = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async (page =1) => {
    dispatch(setLoading());
    try {
      const response = await axiosInstance.get('products',{
        params: {
            page: page,
            limit: 5
        },
    });
      dispatch(setProducts(response.data.products));
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      dispatch(setError('Failed to fetch products'));
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
};

const renderPageNumbers = () => {
    console.log("totalpages in renderPageNumbers()", totalPages)
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-2 mx-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === i
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                aria-label={`Page ${i}`}
                aria-current={currentPage === i ? 'page' : undefined}
            >
                {i}
            </button>
        );
    }

    return pageNumbers;
};


  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

       <nav className="flex flex-wrap items-center justify-center space-x-2 my-8" aria-label="Pagination">
                      <button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="First page"
                      >
                          <FaAngleDoubleLeft className="w-5 h-5" />
                      </button>
                      <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Previous page"
                      >
                          <FaAngleLeft className="w-5 h-5" />
                      </button>
                      {renderPageNumbers()}
                      <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Next page"
                      >
                          <FaAngleRight className="w-5 h-5" />
                      </button>
                      <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Last page"
                      >
                          <FaAngleDoubleRight className="w-5 h-5" />
                      </button>
                  </nav>
    </div>
  );
};

export default ProductGridAdmin;