import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    brand: "",
    image: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (!formData.category_id) {
      newErrors.category_id = "category id is required";
    }
    if (!formData.brand.trim()) {
      newErrors.brand = "Product brand is required";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "The file type must be JPG, PNG, or WEBP."
        }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) { 
        setErrors((prev) => ({
          ...prev,
          image: "The file must be less than 2MB."
        }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }

  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("brand", formData.brand);

      if (formData.image) {
        formDataToSend.append("productImg", formData.image);
      }
      console.log(formDataToSend)

      try {
        const response = await axiosInstance.post("products", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success('Product Added Successfully');
          setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            category_id: "",
            brand: "",
            image: null,
          });
          setImagePreview(null); // Clear image preview
        }

      } catch (error) {
        console.error("There was an error submitting the form", error);
        setErrors((prev) => ({
          ...prev,
          form: "An error occurred while adding the product. Please try again.",
        }));
      }finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className={`block w-full pl-7 rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="4"
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Provide detailed product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock *</label>
              <input
                type="number"
                id="stock"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: Math.floor(e.target.value) }))}
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.stock ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                min="0"
                step="1"
                placeholder="Enter stock"

              />
              {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700"> category_id </label>
              <input
                type="number"
                id="category_id"
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.category_id ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                min="1"
                step="1"
                placeholder="Enter category_id"
              />
              {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
            </div>


            {/* <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div> */}

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.brand ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter brand name"
              />
               {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload file</span>
                      <input
                        id="image"
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB</p>
                </div>
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
              {imagePreview && (
                <div className="mt-3 flex items-center">
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                  <button type="button" onClick={removeImage} className="ml-2 text-red-500">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

          </div>

          <div className="mt-6 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center`}
            >
              {isSubmitting ? "Submitting..." : "Add Product"}
            </button>
          </div>
        </form>

       
      </div>
    </div>
  );
};

export default ProductForm;