"use client";

import { useState } from "react";
import { db } from "../Firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Items() {
  const [item, setItem] = useState({
    barcode: "",
    name: "",
    price: "",
    quantity: "",
  });
  const [items, setItems] = useState([]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const addItem = async () => {
    await addDoc(collection(db, "items"), {
      ...item,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
    });
    setItem({ barcode: "", name: "", price: "", quantity: "" });
    fetchItems();
  };

  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, "items"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Item Register</h1>
      <div className="space-y-2">
        <input
          name="barcode"
          placeholder="Barcode"
          value={item.barcode}
          onChange={handleChange}
        />
        <input
          name="name"
          placeholder="Item Name"
          value={item.name}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Price"
          value={item.price}
          onChange={handleChange}
        />
        <input
          name="quantity"
          placeholder="Quantity"
          value={item.quantity}
          onChange={handleChange}
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <hr className="my-4" />
      <h2 className="text-xl">All Items</h2>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            {i.name} - {i.price}₮ (Qty: {i.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
}
