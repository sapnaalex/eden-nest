'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  const [inventory] = useState([
    { id: 1, petType: 'Bird', breed: 'Lovebird', price: '1500', status: 'Available' },
    { id: 2, petType: 'Rabbit', breed: 'Angora', price: '2500', status: 'Available' }
  ]);
  
  const [bookings] = useState([
    { id: 1, customerName: 'Sapna', petType: 'Bird', startDate: '2026-07-20', endDate: '2026-07-25', cageType: 'Shop Cage' }
  ]);

  const [aiForm, setAiForm] = useState({ petType: 'Bird', breed: 'Lovebird', age: '1 year', dietaryNotes: 'Prefers fresh fruits' });
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

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
      setAiResult(`Network Error: ${err.message}. Check if backend is running on http://localhost:5000 and CORS is enabled.`);
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
        {/* Section 1: E-Commerce Retail Inventory */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">🐦 Active Retail Inventory</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Live Updates</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <th className="p-3">Type</th>
                  <th className="p-3">Breed</th>
                  <th className="p-3">Price (INR)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-600">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.petType}</td>
                    <td className="p-3">{item.breed}</td>
                    <td className="p-3">₹{item.price}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
        <section className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">✨ Gemini AI Smart Care Advisor</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded">AI Powered</span>
          </div>
          <form onSubmit={handleGenerateCare} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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