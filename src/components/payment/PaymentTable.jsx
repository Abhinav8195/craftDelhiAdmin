import React, { useEffect, useMemo, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { LuPenLine } from "react-icons/lu";
import { IoIosAddCircle } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import AddPayment from './AddPayment';
import EditPayment from './EditPayment';
import PaymentDelete from './PaymentDelete';
import { getAdminToken } from '../../utils/auth';
import { getSellerNameMap } from '../../utils/sellerNames';
import { toast } from 'react-toastify';

const PAYMENT_STATUS = {
  0: 'Unpaid',
  1: 'Paid',
  2: 'Refunded',
  4: 'Failed',
};

const PaymentTable = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [DeleteUser, setDeleteUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [paymnetModal, setPaymentModal] = useState(null);
  const [EditModal, setEditModal] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPayments = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}admin/orders-view`,
          {
            headers: { Authorization: `Bearer ${getAdminToken()}` },
            signal: controller.signal,
          }
        );
        const body = await response.json();
        if (!response.ok || !body.success) {
          throw new Error(body.message || 'Failed to load payments');
        }

        const orders = body.data || [];
        let sellerNames = new Map();
        if (orders.some((order) => !order.seller_name && order.seller_id)) {
          try {
            sellerNames = await getSellerNameMap(getAdminToken());
          } catch (sellerError) {
            console.warn('Seller names could not be loaded', sellerError);
          }
        }

        const payments = orders.map((order) => ({
          id: order.payment_uid || (order.payment_id ? `PAY-${order.payment_id}` : '—'),
          internalOrderId: order.id,
          orderId: order.order_uid || '—',
          seller: order.seller_name || sellerNames.get(String(order.seller_id)) || (order.seller_id ? `Seller ${order.seller_id}` : '—'),
          price: `₹${Number(order.total_amount || 0).toFixed(2)}`,
          date: order.created_at,
          status: PAYMENT_STATUS[Number(order.payment_status)] || 'Unknown',
        }));

        setUpdatedUsers(payments);
        setLoadError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLoadError(error.message || 'Failed to load payments');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
    return () => controller.abort();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return updatedUsers.filter((payment) => {
      const matchesSearch = !query || [payment.id, payment.orderId, payment.seller]
        .some((value) => String(value || '').toLowerCase().includes(query));
      const matchesStatus = !statusFilter || payment.status === statusFilter;
      const matchesDate = !selectedDate || (
        payment.date && new Date(payment.date).toLocaleDateString('en-CA') === selectedDate
      );
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, selectedDate, statusFilter, updatedUsers]);

  const openDeleteModal=(user)=>{
    setDeleteUser(user);
  }
  const closeDeleteModal = () => {
    setDeleteUser(null);
  };
 
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index); 
  };
  const openPaymentModal = (user) => {
    console.log('Opening modal for:', user); // Debugging line
    setPaymentModal(user); // Ensure this triggers correctly
};

const closePaymentModal = () => {
    setPaymentModal(null); 
};

const openEditPayment=(user)=>{
    setEditModal(user);
}

const closeEditModal = () => {
    setEditModal(null); 
};


   const handleSelectStatus = async (internalOrderId, status) => {
      const statusCode = { Unpaid: 0, Paid: 1, Refunded: 2 }[status];
      const previousPayments = updatedUsers;
      setUpdatedUsers((current) => current.map((payment) =>
        payment.internalOrderId === internalOrderId ? { ...payment, status } : payment
      ));
      setDropdownOpen(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}admin/orderstatus-update`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAdminToken()}`,
            },
            body: JSON.stringify({
              order_id: internalOrderId,
              payment_status: statusCode,
            }),
          }
        );
        const body = await response.json();
        if (!response.ok || body.success === false) {
          throw new Error(body.message || 'Failed to update payment status');
        }
        toast.success('Payment status updated');
      } catch (error) {
        setUpdatedUsers(previousPayments);
        toast.error(error.message || 'Failed to update payment status');
      }
    };
  
     const statusColors = {
        Refunded: '#ffc600',
        Paid: '#69d297',
        Unpaid: '#fe0000',
        Failed: '#fe0000',
        Unknown: '#d1d5db'
      };
  
  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[-30px]">
      {/* Table Section */}
      <div className="flex flex-col gap-3 overflow-auto w-full min-h-screen">
 <div className="w-full flex flex-wrap justify-between items-center gap-3">
  <div className="text-black text-2xl font-bold w-full sm:w-auto">Payment List's</div>
  </div>
  {/* Dropdown और Search Input Flex */}
  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-between sm:justify-start">
  <div className="w-full sm:w-[206px] mb-2 sm:mb-0">
    <DateInputField 
      label="Select Date" 
      name="selectedDate" 
      value={selectedDate} 
      onChange={(e) => setSelectedDate(e.target.value)} 
    />
  </div>

  {/* Dropdown */}
  <div className="w-full sm:w-[206px] mb-2 sm:mb-0">
    <select
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
      className="w-full h-10 text-xs bg-white border border-gray-300 rounded px-2"
    >
      <option value="">All payment statuses</option>
      <option value="Paid">Paid</option>
      <option value="Unpaid">Unpaid</option>
      <option value="Refunded">Refunded</option>
      <option value="Failed">Failed</option>
    </select>
  </div>

  {/* Search Box */}
  <div className="relative w-full sm:w-[239px] mb-2 sm:mb-0">
    <input
      placeholder="Search payment, order or seller"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      className="w-full h-10 text-black text-xs border border-gray-300 rounded px-3 pr-10"
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
      <FaSearch />
    </div>
  </div>

  {/* Add New Payment Button */}
  <div onClick={() => openPaymentModal('user')} className="ml-auto h-10 p-4 bg-[#024a63] rounded border border-white justify-center items-center gap-3 inline-flex overflow-hidden mt-2 sm:mt-0">
    <div className="w-4 h-4 relative overflow-hidden text-white">
      <IoIosAddCircle />
    </div>
    <div className="text-center text-white text-sm font-medium font-['Montserrat'] leading-none">
      Add New Payment
    </div>
  </div>
</div>

        {loading && (
          <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-600">
            Loading payments...
          </div>
        )}
        {!loading && loadError && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </div>
        )}
        {!loading && !loadError && filteredUsers.length === 0 && (
          <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-600">
            No payments found.
          </div>
        )}

        {/* Table Headers */}
        <div className="w-full justify-start items-start gap-px inline-flex overflow-auto">
          <div className="w-[130px] flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Payment ID
  </div>
</div>
            {/* Table Rows */}
            {filteredUsers.map((user) => (
            <div key={`payment-${user.internalOrderId}`} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.id}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    ORDER ID
  </div>
</div>
            {filteredUsers.map((user) => (
              <div key={`order-${user.internalOrderId}`} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.orderId}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
   Seller Name
  </div>
</div>
            {filteredUsers.map((user) => (
             <div key={`seller-${user.internalOrderId}`} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.seller}</div>
              </div>
            ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
   Total Price
  </div>
</div>
            {filteredUsers.map((user) => (
             <div key={`price-${user.internalOrderId}`} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.price}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Date
  </div>
</div>
            {filteredUsers.map((user) => (
             <div key={`date-${user.internalOrderId}`} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.date ? new Date(user.date).toLocaleDateString('en-GB') : '—'}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Payment Status
  </div>
</div>
           {filteredUsers.map((user, index) => (
                                      <div key={`status-${user.internalOrderId}`} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
                                        <div className={`p-1 rounded-sm justify-center items-center gap-2.5 flex `} style={{ backgroundColor: statusColors[user.status] }} >
                                          <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.status}</div>
                                        </div>
                                        <div className="w-4 h-4 relative ">
                                          <IoIosArrowDown onClick={() => toggleDropdown(index)} />
                                       
                        
                                        
                                        {dropdownOpen === index && (
                                          <div className="absolute left-0 right-0 top-full z-50 bg-white border border-[#e0e4f4] mt-1 rounded w-24 shadow-md">
                                          <div 
                                            className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm"
                                            onClick={() => handleSelectStatus(user.internalOrderId, 'Paid')}
                                          >
                                              Paid
                                            </div>
                                            <div 
                                              className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm" 
                                              onClick={() => handleSelectStatus(user.internalOrderId, 'Unpaid')}
                                            >
                                              Unpaid
                                            </div>
                                            <div 
                                              className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm" 
                                              onClick={() => handleSelectStatus(user.internalOrderId, 'Refunded')}
                                            >
                                              Refunded
                                            </div>
                                          </div>
                                        )}
                                         </div>
                                      </div>
                                    ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-center items-center gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
  Actions
  </div>
</div>

  {filteredUsers.map((user) => (
    <div key={`actions-${user.internalOrderId}`} className="h-[88px] gap-5 p-3 bg-white justify-center items-center inline-flex">
      <button className="w-4 h-4 relative overflow-hidden" onClick={() => openEditPayment(user)}>
        <LuPenLine  />
      </button>
      <button className="w-4 h-4 relative overflow-hidden " onClick={() => openDeleteModal(user)}>
        <FaTrash />
      </button>
    </div>
  ))}
</div>

        </div>
      </div>

    {EditModal&&(
    <EditPayment  user={EditModal} close={closeEditModal}/>
    )}
      {paymnetModal && (
                <AddPayment user={paymnetModal} close={closePaymentModal} />
            )}

{DeleteUser && (
  
      <PaymentDelete user={DeleteUser} close={closeDeleteModal} />


)}

    </div>
  );
};

const DateInputField = ({ label, name, value, onChange }) => {
    return (
      <div>
       
        <div className="relative w-full">
          <input
            type="date"
            className="w-full h-10 px-3  bg-white rounded border border-[#e0e4f4] text-xs"
            name={name}
            value={value}
            onChange={onChange}
          />
         
        </div>
      </div>
    );
  };

export default PaymentTable;
