import React, { useEffect, useState } from 'react';
import image from '../../assets/images/image.png'
import { IoIosChatbubbles } from "react-icons/io";
import { getAdminToken } from '../../utils/auth';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';

const EditOrder = ({ card1, orderData }) => {
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState('');
  const navigate = useNavigate();

  const product = orderData?.items?.[0]?.product || {};
  const token = getAdminToken();

  const [form, setForm] = useState({
    order_uid: "",
    product_id: "",
    payment_status: "",
    order_status: "",
    product_name: "",
    created_at: "",
    quantity: "",
    price: "",
    description: "",
    shipping_address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    }
  });

  useEffect(() => {
    if (orderData) {

      setForm({
        order_uid: orderData?.order_uid || "",
        product_id: orderData?.items?.[0]?.product_id || "",
        payment_status: orderData.payment_status ?? 0,
        order_status: orderData.order_status ?? 0,
        product_name: product?.name || "",
        created_at: orderData?.created_at
          ? new Date(orderData.created_at).toISOString().split("T")[0]
          : "",
        quantity: orderData?.items?.[0]?.quantity || "",
        price: orderData?.items?.[0]?.price || "",
        description: product?.description || "",
        shipping_address: {
          street: orderData?.shipping_address?.street || "",
          city: orderData?.shipping_address?.city || "",
          state: orderData?.shipping_address?.state || "",
          postal_code: orderData?.shipping_address?.postal_code || "",
          country: orderData?.shipping_address?.country || "",
        }
      });
    }
  }, [orderData, product?.description, product?.name]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}admin/orderstatus-update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: orderData.id,
          order_status: Number(form.order_status),
          payment_status: Number(form.payment_status),
        })
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to update order");
      }

      toast.success("Order Updated Successfully 🎉");
      card1(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error updating order");
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithSeller = async () => {
    if (!orderData?.id) return;
    setChatLoading('seller');
    try {
      const response = await fetch(`${process.env.REACT_APP_CHAT_API_BASE}/createroom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contextType: 'ORDER',
          contextId: `ORDER_ID_${orderData.id}`,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.roomId) {
        throw new Error(result.message || 'Unable to open seller chat');
      }
      navigate(`/chat?roomId=${encodeURIComponent(result.roomId)}&orderId=${orderData.id}`, {
        state: { orderData, chatMode: 'seller' },
      });
    } catch (error) {
      toast.error(error.message || 'Unable to open seller chat');
    } finally {
      setChatLoading('');
    }
  };

  const handleSeeChats = () => {
    if (!orderData?.id) return;
    navigate(
      `/chat?mode=order-history&orderId=${orderData.id}&orderUid=${encodeURIComponent(orderData.order_uid || '')}`,
      { state: { orderData, chatMode: 'order-history' } }
    );
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-white ">
      <div className="w-full max-w-[980px] bg-white rounded-xl shadow-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2.5  bg-white rounded-md ">
          {/* Order Information Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <h2 className="text-black text-2xl font-bold font-['Montserrat']">Order Information:</h2>

            {/* Buttons for Chat */}
            <div className="flex gap-2 flex-wrap">
              {/* Chat With Seller Button */}
              <button
                type="button"
                onClick={handleChatWithSeller}
                disabled={chatLoading === 'seller'}
                className="flex items-center gap-2 p-2 bg-[#024a63] rounded border border-white text-white text-[10px] font-semibold disabled:opacity-60"
              >
                <IoIosChatbubbles className="text-white text-lg" />
                {chatLoading === 'seller' ? 'Opening…' : 'Chat With Seller'}
              </button>

              {/* See Chats Button */}
              <button
                type="button"
                onClick={handleSeeChats}
                className="p-2 bg-[#024a63] rounded flex items-center text-white text-[10px] font-semibold"
              >
                See Chats
              </button>
            </div>

          </div>

          {/* Divider */}
          <div className="border-2 border-[#d9d9d9]"></div>
        </div>



        <div className=" bg-white rounded-lg">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Order ID */}
            <div className="flex flex-col gap-1">
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">Order ID</label>
              <input
                type="text"
                className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
                value={form.order_uid}
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">Seller Name</label>
              <input
                type="text"
                className="h-14 px-3 bg-gray-50 rounded border border-[#e0e4f4] text-xs text-black"
                value={orderData?.seller_name || (orderData?.seller_id ? `Seller ${orderData.seller_id}` : '')}
                readOnly
              />
            </div>

            {/* Product ID */}
            <div className="flex flex-col gap-1">
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">Product ID</label>
              <input
                type="text"
                className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
                value={form.product_id || ""}
                readOnly
              />
            </div>

            {/* Payment Status */}
            <div className="flex flex-col gap-1">
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">Payment Status</label>
              <select
                className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
                value={form.payment_status ?? ""}
                onChange={(e) =>
                  setForm({ ...form, payment_status: Number(e.target.value) })
                }
              >
                <option value="">Select Status</option>
                <option value={0}>Pending</option>
                <option value={1}>Paid</option>
                <option value={2}>Refund</option>
                <option value={4}>Cancelled</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">Order Status</label>
              <select
                className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
                value={form.order_status ?? ""}
                onChange={(e) => setForm({ ...form, order_status: Number(e.target.value) })}
              >
                <option value={0}>Pending</option>
                <option value={1}>Accepted</option>
                <option value={2}>Out for Delivery</option>
                <option value={3}>Delivered</option>
                <option value={4}>Cancelled</option>
              </select>
            </div>
          </div>



        </div>


        {/* Sleek Modern Product Table */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[#024a63] text-xl font-semibold tracking-wide">Products Summary</h2>
            <span className="text-sm text-gray-500">({orderData?.items?.length || 0} Items)</span>
          </div>

          <div className="overflow-x-auto rounded-xl bg-white border border-gray-200 shadow-md">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gradient-to-r from-[#024a63] to-[#046c87] text-white text-left text-xs uppercase tracking-wide">
                  <th className="p-4">ID</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Image</th>
                </tr>
              </thead>

              <tbody>
                {orderData?.items?.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-[#f4fbff] transition-all duration-200"
                  >
                    {/* Index */}
                    <td className="p-4 font-semibold text-[#024a63]">{i + 1}</td>

                    {/* Product name input */}
                    <td className="p-4">
                      <input
                        type="text"
                        value={item?.product?.name || ''}
                        readOnly
                        className="w-full bg-gray-100 focus:bg-white transition-all duration-200 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#024a63] outline-none"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="p-4">
                      <input
                        type="number"
                        value={item.quantity || ''}
                        readOnly
                        className="w-20 text-center bg-gray-100 focus:bg-white border border-gray-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-[#024a63] outline-none"
                      />
                    </td>

                    {/* Price */}
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-2">

                        {/* Rs Text */}
                        <span className="text-gray-500 text-xs font-medium">Rs</span>

                        {/* Input */}
                        <input
                          type="number"
                          value={item.price || ''}
                          readOnly
                          className="
        w-24
        bg-gray-100
        focus:bg-white
        border
        border-gray-300
        rounded-lg
        px-2
        py-2
        text-sm
        outline-none
        focus:ring-2
        focus:ring-[#024a63]
        transition-all
      "
                        />
                      </div>
                    </td>


                    {/* Dimensions */}
                    <td className="p-4">
                      <input
                        type="text"
                        value={item?.product?.dimension || ''}
                        readOnly
                        className="w-full bg-gray-100 focus:bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#024a63] outline-none"
                      />
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <input
                        type="text"
                        value={item?.product?.category_id || ''}
                        readOnly
                        className="w-full bg-gray-100 focus:bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#024a63] outline-none"
                      />
                    </td>

                    {/* Image */}
                    <td className="p-4 flex justify-center">
                      <img
                        src={getImageUrl(item?.product?.main_image_url, "thumbnail", image)}
                        alt={item?.product?.name || 'Product'}
                        className="w-14 h-14 rounded-lg shadow-md border border-gray-200 object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>




        <div className=" bg-white rounded-lg ">
          {/* Header */}
          <h2 className="text-black text-2xl font-bold font-['Montserrat']">Delivery Information:</h2>

          {/* Divider */}
          <div className="border-2 border-[#d9d9d9] my-2"></div>

          {/* Delivery Address */}
          <div className="flex flex-col gap-2">
            <label className="text-black text-[10px] font-bold uppercase tracking-widest">
              Delivery Address
            </label>

            <textarea
              className="p-4 bg-gray-50 h-28 resize-none rounded border border-[#d9d9d9] text-xs text-black outline-none"
              value={form.shipping_address?.street || ""}
              readOnly
            />
          </div>


          {/* Address Details */}
          <div className="grid md:grid-cols-3 gap-3 mt-3">
            {/* State */}
            <div className="flex flex-col">
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">State</label>
              <input
                className="h-12 px-3 bg-gray-50 rounded border border-[#e0e4f4] text-xs text-black"
                value={form.shipping_address?.state || ""}
                readOnly
              />
            </div>

            {/* Colony / Locality */}
            <div className="flex flex-col">
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">City</label>
              <input
                type="text"
                className="h-12 px-3 bg-gray-50 rounded border border-[#e0e4f4] text-xs text-black"
                value={form.shipping_address?.city || ""}
                readOnly
              />
            </div>

            {/* Area */}
            <div className="flex flex-col">
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">Postal Code</label>
              <input
                type="text"
                className="h-12 px-3 bg-gray-50 rounded border border-[#e0e4f4] text-xs text-black"
                value={form.shipping_address?.postal_code || ""}
                readOnly
              />
            </div>
          </div>
        </div>



        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={() => card1(null)} className="px-4 py-2 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium font-['Montserrat'] leading-none">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-12 px-4 py-2 rounded text-white text-sm font-medium font-['Montserrat'] leading-none transition-all 
  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#024a63] hover:bg-[#035c75]"}`}
          >
            {loading ? "Updating..." : "Update Order"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default EditOrder;
