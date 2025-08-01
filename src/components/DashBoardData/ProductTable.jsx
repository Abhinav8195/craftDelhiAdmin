import React, { useState, useEffect } from 'react';
import IconCube_02 from '../../assets/images/IconCube_02.png';
import IconImageIndentRight from '../../assets/images/IconImageIndentRight.png';
import { IoIosArrowDown } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const ProductTable = ({card1}) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusColors] = useState({
    Pending: '#ffc600',
    Approved: '#69d297',
    Rejected: '#fe0000'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("craftdelhiadmin_token");
        const response = await axios.get('https://backend.craftdelhi.com/backend/api/admin/products-view', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const filtered = response.data.data
            .filter(product => product.admin_approval === 0)
            .map(product => ({
              userId: product.id,
              name: product.product_name,
              productImage: product.main_image_url,
              seller: `${product.first_name || ''} ${product.last_name || ''}`.trim() || 'Unknown',
              status: 'Pending'
            }));

          setProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleSelectStatus = (index, status) => {
    const updated = [...products];
    updated[index].status = status;
    setProducts(updated);
    setDropdownOpen(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 md:px-8 mt-8">
      <div className="text-black text-xl md:text-2xl font-bold font-['Montserrat'] mb-6 text-center md:text-left">
        Pending Approvals
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
        <button onClick={() => card1(null)} className="text-left w-full">
        <div className="h-[180px] sm:h-[200px] p-4 bg-gradient-to-b from-[#ffeaea] to-white rounded-2xl border border-[#d9d9d9] shadow-md flex flex-col items-center justify-between">
          <img src={IconCube_02} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          <div className="text-black text-sm sm:text-base font-semibold text-center">
            Products Pending Approval
          </div>
          <div className="text-black text-2xl sm:text-3xl font-bold">{products.length}</div>
        </div>
        </button>

        <div className="h-[180px] sm:h-[200px] p-4 bg-gradient-to-b from-[#ffeaea] to-white rounded-2xl border border-[#d9d9d9] shadow-md flex flex-col items-center justify-between">
          <img src={IconImageIndentRight} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          <div className="text-black text-sm sm:text-base font-semibold text-center">
            Products Pending Actions
          </div>
          <div className="text-black text-2xl sm:text-3xl font-bold">{products.length}</div>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-lg md:text-xl font-bold text-black">Products Pending Approval</h2>
        <div className="relative w-full sm:w-[260px]">
          <input
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-3 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-lg border border-gray-200 relative">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-sm">
              <thead className="bg-[#36234e] sticky top-0 z-10 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Product ID</th>
                  <th className="px-4 py-3 text-left">Product Name</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Seller</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm">{product.userId}</td>
                    <td className="px-4 py-3 whitespace-nowrap truncate max-w-[160px] text-xs sm:text-sm">
                      {product.name}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={product.productImage}
                        alt={product.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap truncate max-w-[120px] text-xs sm:text-sm">
                      {product.seller}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 relative">
                        <span
                          className="px-2 py-1 rounded text-white text-[10px] sm:text-xs"
                          style={{ backgroundColor: statusColors[product.status] }}
                        >
                          {product.status}
                        </span>
                        <button onClick={() => toggleDropdown(index)} className="text-gray-600 text-base">
                          <IoIosArrowDown />
                        </button>

                        {dropdownOpen === index && (
                          <div className="absolute top-8 left-0 z-50 bg-white shadow-lg border border-gray-200 rounded-md w-28 text-xs">
                            {['Approved', 'Rejected', 'Pending'].map(status => (
                              <div
                                key={status}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectStatus(index, status)}
                              >
                                {status}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-6 text-sm">
                      No matching products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
