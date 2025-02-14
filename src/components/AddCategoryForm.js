import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const AddCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
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

      if (formData.image) {
        formDataToSend.append("categoryImg", formData.image);
      }

      try {
        const response = await axiosInstance.post("categories", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success('Category Added Successfully');
          setFormData({
            name: "",
            image: null,
          });
          setImagePreview(null); // Clear image preview
        }

      } catch (error) {
        console.error("There was an error submitting the form", error);
        setErrors((prev) => ({
          ...prev,
          form: "An error occurred while adding the category. Please try again.",
        }));
      } finally {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter category name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category Image</label>
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
              {isSubmitting ? "Submitting..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryForm;
