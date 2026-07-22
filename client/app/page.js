'use client';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  // Inventory state (starts empty, fetched from backend DB)
  const [inventory, setInventory] = useState([]);
  const [newPet, setNewPet] = useState({ petType: '', breed: '', price: '', status: 'Available' });
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // Boarding state (mock display)
  const [bookings] = useState([
    { id: 1, customerName: 'Sapna', petType: 'Bird', startDate: '2026-07-20', endDate: '2026-07-25', cageType: 'Shop Cage' }
  ]);

  // AI Care Advisor state
  const [aiForm, setAiForm] = useState({ petType: 'Bird', breed: 'Lovebird', age: '1 year', dietaryNotes: 'Prefers fresh fruits' });
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  // --- API 1: Fetch Live Inventory from SQLite ---
  const fetchInventory = async () => {
    try {
      setInventoryLoading(true);
      const res = await fetch('http://localhost:5000/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // --- API 2: Add New Pet to Backend DB ---
  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!newPet.petType || !newPet.breed || !newPet.price) return;

    try {
      const res = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet)
      });

      if (res.ok) {
        setNewPet({ petType: '', breed: '', price: '', status: 'Available' });
        fetchInventory(); // Refresh live table
      }
    } catch (err) {
      console.error('Failed to add pet:', err);
    }
  };

  // --- API 3: Delete Pet from Backend DB ---
  const handleDeletePet = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchInventory(); // Refresh live table
      }
    } catch (err) {
      console.error('Failed to delete pet:', err);
    }
  };

  // --- API 4: Generate AI Care Plan ---
  const handleGenerateCare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResult('');
    try {
      const res = await fetch('http://localhost:5000/api/ai/care-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm)
      });
      const data = await res.json();
      if (!res.ok) {
        setAiResult(`Backend Error (${res.status}): ${data.error || 'Failed to fetch'}`);
      } else {
        setAiResult(data.recommendations);
      }
    } catch (err) {
      setAiResult(`Network Error: ${err.message}. Check if backend is running on http://localhost:5000.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 border-b pb-4 bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">🏡 Eden Nest Pets</h1>
        <p className="text-gray-500 mt-1">Integrated Management & AI Care Advisory Dashboard</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Section 1: E-Commerce Retail Inventory (Connected to SQLite DB) */}
        <section className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">🐦 Active Retail Inventory</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              SQLite Connected
            </span>
          </div>

          {/* Form to Add New Pet */}
          <form onSubmit={handleAddPet} className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6 bg-slate-50 p-4 rounded-lg border">
            <input 
              type="text" 
              placeholder="Pet Type (e.g. Bird)" 
              value={newPet.petType} 
              onChange={(e) => setNewPet({ ...newPet, petType: e.target.value })} 
              className="border p-2 rounded text-sm" 
              required 
            />
            <input 
              type="text" 
              placeholder="Breed (e.g. Lovebird)" 
              value={newPet.breed} 
              onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })} 
              className="border p-2 rounded text-sm" 
              required 
            />
            <input 
              type="number" 
              placeholder="Price (INR)" 
              value={newPet.price} 
              onChange={(e) => setNewPet({ ...newPet, price: e.target.value })} 
              className="border p-2 rounded text-sm" 
              required 
            />
            <select 
              value={newPet.status} 
              onChange={(e) => setNewPet({ ...newPet, status: e.target.value })}
              className="border p-2 rounded text-sm bg-white"
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
            </select>
            <button 
              type="submit" 
              className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition text-sm"
            >
              + Add Pet
            </button>
          </form>

          {/* Table displaying Inventory */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <th className="p-3">ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Breed</th>
                  <th className="p-3">Price (INR)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-600">
                {inventoryLoading ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-400">Loading live inventory...</td>
                  </tr>
                ) : inventory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-400">No pets in database. Add one above!</td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 text-xs text-gray-400">#{item.id}</td>
                      <td className="p-3 font-medium">{item.petType}</td>
                      <td className="p-3">{item.breed}</td>
                      <td className="p-3">₹{item.price}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDeletePet(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Boarding & Cage Log Tracker */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">🗓️ Current Boarding Placements</h2>
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">DSA Managed</span>
          </div>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-lg bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-800">{booking.customerName}'s {booking.petType}</h3>
                  <p className="text-xs text-gray-500 mt-1">Timeline: {booking.startDate} to {booking.endDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded font-mono">
                    {booking.cageType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Gemini AI Smart Assistant */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">✨ Gemini AI Care Advisor</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded">AI Powered</span>
          </div>
          <form onSubmit={handleGenerateCare} className="grid grid-cols-1 gap-3 mb-4">
            <input 
              type="text" 
              placeholder="Pet Type (e.g. Bird)" 
              value={aiForm.petType} 
              onChange={(e) => setAiForm({...aiForm, petType: e.target.value})}
              className="border p-2 rounded text-sm"
              required 
            />
            <input 
              type="text" 
              placeholder="Breed (e.g. Lovebird)" 
              value={aiForm.breed} 
              onChange={(e) => setAiForm({...aiForm, breed: e.target.value})}
              className="border p-2 rounded text-sm"
              required 
            />
            <input 
              type="text" 
              placeholder="Age" 
              value={aiForm.age} 
              onChange={(e) => setAiForm({...aiForm, age: e.target.value})}
              className="border p-2 rounded text-sm" 
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-600 text-white font-medium py-2 px-4 rounded hover:bg-emerald-700 transition"
            >
              {loading ? 'Generating...' : 'Generate Care Routine'}
            </button>
          </form>
          {aiResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-slate-800 text-sm">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-2" {...props} />,
                  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                  em: ({ node, ...props }) => <em className="italic text-slate-700" {...props} />,
                }}
              >
                {aiResult}
              </ReactMarkdown>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}