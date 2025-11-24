import React, { useEffect, useState } from 'react';
import image from '../../assets/images/image.png'
import { IoIosChatbubbles } from "react-icons/io";
import { getAdminToken } from '../../utils/auth';

const EditOrder = ({ card1, orderData}) => {
     console.log("Received Order:", orderData);
     const [loading, setLoading] = useState(false);

    const product = orderData?.items?.[0]?.product || {};
     const token = getAdminToken();

  const [form, setForm] = useState({
    order_uid: "",
    product_id: "",
    payment_status: "",
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
    let paymentLabel = orderData.payment_status === 1 ? "paid" :
                       orderData.payment_status === 2 ? "refund" : "pending";

    setForm({
      order_uid: orderData?.order_uid || "",
      product_id: orderData?.items?.[0]?.product_id || "",
      payment_status: paymentLabel,
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
}, [orderData]);



 
  const handleSubmit = async () => {
  setLoading(true);

  try {
    const response = await fetch(`https://backend.craftdelhi.com/backend/api/order/updatedetails/${orderData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_status: form.payment_status,
        shipping_address_id: orderData.shipping_address_id,
        order_status: orderData.order_status,
        payment_method: orderData.payment_method,
        payment_type: orderData.payment_type,
        total_amount: orderData.total_amount,
        tracking_company: orderData.tracking_company || "",
        tracking_number: orderData.tracking_number || "",
        tracking_link: orderData.tracking_link || "",
        buyer_note: form.description,
        estimated_delivery_from: orderData.estimated_delivery_from || null,
        estimated_delivery_to: orderData.estimated_delivery_to || null,
        tracking_status: orderData.tracking_status || "",
      })
    });

    if (!response.ok) throw new Error("Failed to update order");

    alert("Order Updated Successfully!");

    card1(null); // close modal  
  } catch (error) {
    alert("Error Updating Order");
    console.error(error);
  } finally {
    setLoading(false);
  }
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
  <button className="flex items-center gap-2 p-2 bg-[#024a63] rounded border border-white text-white text-[10px] font-semibold">
    <IoIosChatbubbles className="text-white text-lg" />
    Chat With Seller
  </button>

  {/* See Chats Button */}
  <button className="p-2 bg-[#024a63] rounded flex items-center text-white text-[10px] font-semibold">
    See Chats
  </button>
</div>

  </div>

  {/* Divider */}
  <div className="border-2 border-[#d9d9d9]"></div>
</div>



        <div className=" bg-white rounded-lg">
  <div className="grid md:grid-cols-3 gap-3">
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
      <select className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
      value={form.payment_status || ""}
    onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
>
       <option value="">Select Status</option>
    <option value="pending">Pending</option>
    <option value="paid">Paid</option>
    <option value="refund">Refund</option>
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
                defaultValue={item?.product?.name}
                className="w-full bg-gray-100 focus:bg-white transition-all duration-200 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#024a63] outline-none"
              />
            </td>

            {/* Quantity */}
            <td className="p-4">
              <input
                type="number"
                defaultValue={item.quantity}
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
      defaultValue={item.price}
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
                defaultValue="20 x 15 x 10 cm"
                className="w-full bg-gray-100 focus:bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#024a63] outline-none"
              />
            </td>

            {/* Category */}
            <td className="p-4">
              <input
                type="text"
                defaultValue="Handmade Craft"
                className="w-full bg-gray-100 focus:bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#024a63] outline-none"
              />
            </td>

            {/* Image */}
            <td className="p-4 flex justify-center">
              <img
  src={item?.product?.main_image_url || image}
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
    className="p-4 bg-white h-28 resize-none rounded border border-[#d9d9d9] text-xs text-black focus:ring-2 focus:ring-[#024a63] outline-none"
    placeholder="Enter full delivery address..."
    value={form.shipping_address_text || ""}
    onChange={(e) =>
      setForm({
        ...form,
        shipping_address_text: e.target.value
      })
    }
  />
</div>


  {/* Address Details */}
  <div className="grid md:grid-cols-3 gap-3 mt-3">
    {/* State */}
    <div className="flex flex-col">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">State</label>
      <input
        className="h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
        value={form.state || ""}
        onChange={(e) => setForm({ ...form, state: e.target.value })}
        placeholder="Enter State"
      />
    </div>

    {/* Colony / Locality */}
    <div className="flex flex-col">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">City</label>
      <input
        type="text"
        className="h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
        value={form.city || ""}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
        placeholder="Enter City"
      />
    </div>

    {/* Area */}
    <div className="flex flex-col">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">Postal Code</label>
      <input
        type="text"
        className="h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
         value={form.postal_code || ""}
        onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
        placeholder="Enter Postal Code"
      />
    </div>
  </div>
</div>

       

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
  <button onClick={()=>card1(null)} className="px-4 py-2 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium font-['Montserrat'] leading-none">
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