import { useState } from "react";
import { FiUsers, FiShoppingBag, FiPackage, FiMenu, FiSun, FiMoon, FiBell } from "react-icons/fi";
import { BiSearchAlt } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const mockProducts = [
    {
      id: 1,
      name: "Premium Headphones",
      price: 199.99,
      stock: 45,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
      id: 2,
      name: "Wireless Mouse",
      price: 49.99,
      stock: 120,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46"
    }
  ];

  const mockUsers = [
    {
      id: "U001",
      username: "john_doe",
      email: "john@example.com",
      registrationDate: "2023-01-15",
      role: "Admin",
      status: "Active"
    },
    {
      id: "U002",
      username: "jane_smith",
      email: "jane@example.com",
      registrationDate: "2023-02-20",
      role: "User",
      status: "Active"
    }
  ];

  const mockOrders = [
    {
      id: "ORD001",
      customerName: "John Doe",
      orderDate: "2023-12-01",
      total: 299.99,
      status: "Processing"
    },
    {
      id: "ORD002",
      customerName: "Jane Smith",
      orderDate: "2023-12-02",
      total: 149.99,
      status: "Delivered"
    }
  ];

  const stats = [
    { title: "Total Products", value: "1,234", icon: <FiPackage /> },
    { title: "Total Users", value: "5,678", icon: <FiUsers /> },
    { title: "Total Orders", value: "9,101", icon: <FiShoppingBag /> },
    { title: "Revenue", value: "$50,234", icon: <FiShoppingBag /> }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-white transition-transform dark:bg-gray-800 lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-xl font-semibold dark:text-white">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {[
              { name: "Dashboard", icon: <MdDashboard />, id: "dashboard" },
              { name: "Products", icon: <FiPackage />, id: "products" },
              { name: "Users", icon: <FiUsers />, id: "users" },
              { name: "Orders", icon: <FiShoppingBag />, id: "orders" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center rounded-lg px-4 py-2 text-sm ${activeSection === item.id ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"} dark:text-white`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? "lg:ml-64" : ""} flex flex-1 flex-col`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <FiMenu className="h-6 w-6 dark:text-white" />
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <FiSun className="h-6 w-6 text-yellow-400" />
                ) : (
                  <FiMoon className="h-6 w-6" />
                )}
              </button>
              <button className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiBell className="h-6 w-6 dark:text-white" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4">
          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
              >
                <div className="flex items-center">
                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Sections */}
          {activeSection === "products" && (
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold dark:text-white">Products</h2>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="px-4 py-2 text-left">Image</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Stock</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducts.map((product) => (
                      <tr key={product.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </td>
                        <td className="px-4 py-2 dark:text-white">{product.name}</td>
                        <td className="px-4 py-2 dark:text-white">
                          ${product.price}
                        </td>
                        <td className="px-4 py-2 dark:text-white">{product.stock}</td>
                        <td className="px-4 py-2">
                          <button className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                            Edit
                          </button>
                          <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold dark:text-white">Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Username</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2 dark:text-white">{user.id}</td>
                        <td className="px-4 py-2 dark:text-white">{user.username}</td>
                        <td className="px-4 py-2 dark:text-white">{user.email}</td>
                        <td className="px-4 py-2 dark:text-white">{user.role}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "orders" && (
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold dark:text-white">Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Total</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2 dark:text-white">{order.id}</td>
                        <td className="px-4 py-2 dark:text-white">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-2 dark:text-white">
                          {order.orderDate}
                        </td>
                        <td className="px-4 py-2 dark:text-white">
                          ${order.total}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
