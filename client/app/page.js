'use client';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  // Inventory State
  const [inventory, setInventory] = useState([]);
  const [newPet, setNewPet] = useState({ petType: '', breed: '', price: '', status: 'Available' });
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // Boarding State
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [numBirds, setNumBirds] = useState(1);

  // Date Inclusion Billing Checkboxes
  const [includeStartDay, setIncludeStartDay] = useState(true);
  const [includeEndDay, setIncludeEndDay] = useState(false);

  const [newBooking, setNewBooking] = useState({
    customerName: '',
    phone: '',
    petType: 'Bird',
    breed: '',
    startDate: '',
    endDate: '',
    requirements: '',
    cageType: 'Shop Cage',
    birdCount: 1,
    rates: [150],
    status: 'Active'
  });

  // Modal State for Return / Completion
  const [selectedBookingForReturn, setSelectedBookingForReturn] = useState(null);
  const [returnDateInput, setReturnDateInput] = useState('');

  // AI Care Advisor State
  const [aiForm, setAiForm] = useState({ petType: 'Bird', breed: 'Lovebird', age: '1 year', dietaryNotes: 'Prefers fresh fruits' });
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Fetch Data ---
  const fetchInventory = async () => {
    try {
      setInventoryLoading(true);
      const res = await fetch('http://localhost:5000/api/inventory');
      if (res.ok) setInventory(await res.json());
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setInventoryLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await fetch('http://localhost:5000/api/bookings');
      if (res.ok) setBookings(await res.json());
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchBookings();
  }, []);

  // --- Handlers: Inventory ---
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
        fetchInventory();
      }
    } catch (err) {
      console.error('Failed to add pet:', err);
    }
  };

  const handleDeletePet = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) fetchInventory();
    } catch (err) {
      console.error('Failed to delete pet:', err);
    }
  };

  // --- Handlers: Bird Rates & Billing Math ---
  const handleNumBirdsChange = (count) => {
    const totalCount = parseInt(count) || 1;
    setNumBirds(totalCount);
    const updatedRates = Array.from({ length: totalCount }, (_, i) => newBooking.rates[i] || 150);
    setNewBooking({ ...newBooking, birdCount: totalCount, rates: updatedRates });
  };

  const handleRateChange = (index, value) => {
    const updatedRates = [...newBooking.rates];
    updatedRates[index] = parseFloat(value) || 0;
    setNewBooking({ ...newBooking, rates: updatedRates });
  };

  const calculateTotalCost = (sDate = newBooking.startDate, eDate = newBooking.endDate, startInc = includeStartDay, endInc = includeEndDay) => {
    if (!sDate || !eDate) return { days: 0, totalCost: 0 };
    const start = new Date(sDate);
    const end = new Date(eDate);
    
    const diffTime = end.getTime() - start.getTime();
    let calculatedDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (startInc && endInc) {
      calculatedDays += 1;
    } else if (!startInc && !endInc) {
      calculatedDays = Math.max(1, calculatedDays - 1);
    }

    const finalDays = Math.max(1, calculatedDays);
    const dailySum = newBooking.rates.reduce((sum, r) => sum + (parseFloat(r) || 0), 0);
    return { days: finalDays, totalCost: finalDays * dailySum };
  };

  // --- Register Boarding ---
  const handleAddBooking = async (e) => {
    e.preventDefault();
    const { days, totalCost } = calculateTotalCost();

    const payload = {
      customerName: newBooking.customerName,
      phone: newBooking.phone,
      petType: newBooking.petType,
      breed: newBooking.breed,
      birdCount: numBirds,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      cageType: newBooking.cageType,
      ratesSummary: newBooking.rates.join(', '),
      days,
      totalCost,
      requirements: newBooking.requirements,
      status: 'Active'
    };

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNumBirds(1);
        setIncludeStartDay(true);
        setIncludeEndDay(false);
        setNewBooking({
          customerName: '',
          phone: '',
          petType: 'Bird',
          breed: '',
          startDate: '',
          endDate: '',
          requirements: '',
          cageType: 'Shop Cage',
          birdCount: 1,
          rates: [150],
          status: 'Active'
        });
        fetchBookings();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to register boarding (${res.status}): ${errData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Failed to add booking:', err);
    }
  };

  // --- Modal Action: Open Return Dialog ---
  const openReturnModal = (booking) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedBookingForReturn(booking);
    setReturnDateInput(todayStr); // Defaults to today's date
  };

  // --- Modal Action: Submit Return / Completion ---
  const handleConfirmReturn = async () => {
    if (!selectedBookingForReturn) return;

    const booking = selectedBookingForReturn;
    const actualEndDate = returnDateInput || booking.endDate;

    // Recalculate bill for actual return date
    const start = new Date(booking.startDate);
    const end = new Date(actualEndDate);
    const diffDays = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)));
    const ratesArr = (booking.ratesSummary || '150').split(',').map(r => parseFloat(r) || 0);
    const dailySum = ratesArr.reduce((a, b) => a + b, 0);
    const updatedTotalCost = diffDays * dailySum;

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endDate: actualEndDate,
          days: diffDays,
          totalCost: updatedTotalCost,
          status: 'Completed'
        })
      });

      if (res.ok) {
        setSelectedBookingForReturn(null);
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to complete booking:', err);
    }
  };

  // --- Handlers: AI Care Assistant ---
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
      setAiResult(`Network Error: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };

  const { days, totalCost } = calculateTotalCost();
  const activeBookings = bookings.filter(b => b.status !== 'Completed');
  const completedBookings = bookings.filter(b => b.status === 'Completed');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 border-b pb-4 bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">🏡 Eden Nest Pets</h1>
        <p className="text-gray-500 mt-1">Integrated Management & AI Care Advisory Dashboard</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Section 1: Active Retail Inventory */}
        <section className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">🐦 Active Retail Inventory</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              SQLite Connected
            </span>
          </div>

          <form onSubmit={handleAddPet} className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6 bg-slate-50 p-4 rounded-lg border">
            <input 
              type="text" 
              placeholder="Pet Type (e.g. Bird)" 
              value={newPet.petType} 
              onChange={(e) => setNewPet({ ...newPet, petType: e.target.value })} 
              className="border p-2 rounded text-sm bg-white" 
              required 
            />
            <input 
              type="text" 
              placeholder="Breed (e.g. Lovebird)" 
              value={newPet.breed} 
              onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })} 
              className="border p-2 rounded text-sm bg-white" 
              required 
            />
            <input 
              type="number" 
              placeholder="Price (INR)" 
              value={newPet.price} 
              onChange={(e) => setNewPet({ ...newPet, price: e.target.value })} 
              className="border p-2 rounded text-sm bg-white" 
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

        {/* Section 2: Boarding Tracker */}
        <section className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">🗓️ Active Boarding Placements</h2>
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Multi-Pet & Flexible Date Calculator
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleAddBooking} className="bg-purple-50 p-5 rounded-lg border border-purple-200 mb-6">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">Register New Boarding</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <input 
                type="text" 
                placeholder="Owner Name" 
                value={newBooking.customerName} 
                onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })} 
                className="border p-2 rounded text-sm bg-white" 
                required 
              />
              <input 
                type="tel" 
                placeholder="Owner Phone Number" 
                value={newBooking.phone} 
                onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })} 
                className="border p-2 rounded text-sm bg-white" 
                required 
              />
              <input 
                type="text" 
                placeholder="Bird Breed/Species" 
                value={newBooking.breed} 
                onChange={(e) => setNewBooking({ ...newBooking, breed: e.target.value })} 
                className="border p-2 rounded text-sm bg-white" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Number of Birds</label>
                <select 
                  value={numBirds} 
                  onChange={(e) => handleNumBirdsChange(e.target.value)}
                  className="border p-2 rounded text-sm bg-white w-full"
                >
                  <option value={1}>1 Bird</option>
                  <option value={2}>2 Birds</option>
                  <option value={3}>3 Birds</option>
                  <option value={4}>4 Birds</option>
                  <option value={5}>5 Birds</option>
                </select>
              </div>

              {/* Start Date + Checkbox */}
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Boarded Date</label>
                <input 
                  type="date" 
                  value={newBooking.startDate} 
                  onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })} 
                  className="border p-2 rounded text-sm w-full bg-white mb-1" 
                  required 
                />
                <label className="flex items-center gap-1.5 text-xs text-purple-900 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeStartDay} 
                    onChange={(e) => setIncludeStartDay(e.target.checked)} 
                    className="rounded text-purple-600"
                  />
                  Include Start Day in Bill
                </label>
              </div>

              {/* End Date + Checkbox */}
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Expected Return Date</label>
                <input 
                  type="date" 
                  value={newBooking.endDate} 
                  onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })} 
                  className="border p-2 rounded text-sm w-full bg-white mb-1" 
                  required 
                />
                <label className="flex items-center gap-1.5 text-xs text-purple-900 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeEndDay} 
                    onChange={(e) => setIncludeEndDay(e.target.checked)} 
                    className="rounded text-purple-600"
                  />
                  Include Return Day in Bill
                </label>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Cage Selection</label>
                <select 
                  value={newBooking.cageType} 
                  onChange={(e) => setNewBooking({ ...newBooking, cageType: e.target.value })}
                  className="border p-2 rounded text-sm bg-white w-full"
                >
                  <option value="Shop Cage">Shop Cage</option>
                  <option value="Private Cage">Private Cage</option>
                  <option value="Large Flight Cage">Large Flight Cage</option>
                </select>
              </div>
            </div>

            {/* Rates Config */}
            <div className="bg-white p-3 rounded border mb-3">
              <label className="text-xs font-semibold text-purple-900 block mb-2">
                💰 Rate Per Day Configuration ({numBirds} {numBirds > 1 ? 'Birds' : 'Bird'})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: numBirds }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                      Bird {index + 1} Rate (₹/day):
                    </span>
                    <input 
                      type="number" 
                      placeholder="Rate" 
                      value={newBooking.rates[index] || ''} 
                      onChange={(e) => handleRateChange(index, e.target.value)}
                      className="border p-1.5 rounded text-sm w-full bg-slate-50"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <input 
                type="text" 
                placeholder="Special Dietary / Care Requirements" 
                value={newBooking.requirements} 
                onChange={(e) => setNewBooking({ ...newBooking, requirements: e.target.value })} 
                className="border p-2 rounded text-sm bg-white sm:col-span-2" 
              />
              <div className="bg-purple-100 p-2 rounded border border-purple-300 text-right">
                <span className="text-xs text-purple-900 block">Calculated ({days} Billed Days):</span>
                <span className="text-lg font-bold text-purple-900">₹{totalCost}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white font-medium py-2 px-4 rounded hover:bg-purple-700 transition text-sm shadow"
            >
              + Register Boarding Placement
            </button>
          </form>

          {/* Active Boardings */}
          <div className="space-y-4 mb-8">
            {bookingsLoading ? (
              <p className="text-center text-gray-400 py-4">Loading active boarding placements...</p>
            ) : activeBookings.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No active boarding placements recorded.</p>
            ) : (
              activeBookings.map((booking) => (
                <div key={booking.id} className="border p-4 rounded-lg bg-slate-50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{booking.customerName}</h3>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">
                        📞 {booking.phone || 'N/A'}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                        🦜 {booking.birdCount || 1} {booking.birdCount > 1 ? 'Birds' : 'Bird'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Breed/Species:</strong> {booking.breed || booking.petType}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Timeline:</strong> {booking.startDate} to {booking.endDate} ({booking.days || 1} Billed Days)
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      <strong>Rates Breakdown:</strong> ₹{booking.ratesSummary || booking.ratePerDay} / day
                    </p>
                    {booking.requirements && (
                      <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded mt-2">
                        <strong>Care Notes:</strong> {booking.requirements}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded font-mono">
                      {booking.cageType}
                    </span>
                    <span className="text-sm font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded border border-purple-200">
                      Total: ₹{booking.totalCost || 0}
                    </span>
                    <button 
                      onClick={() => openReturnModal(booking)}
                      className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-3 py-1.5 rounded bg-emerald-100 hover:bg-emerald-200 transition border border-emerald-300"
                    >
                      ✓ Returned to Owner
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Historical Log */}
          {completedBookings.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-md font-semibold text-slate-700 mb-3">📜 Boarding History Log (Completed Returns)</h3>
              <div className="space-y-3">
                {completedBookings.map((history) => (
                  <div key={history.id} className="border p-3 rounded-lg bg-gray-50 flex justify-between items-center opacity-75">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{history.customerName}</span>
                      <span className="text-xs text-gray-500 ml-2">({history.birdCount} {history.breed})</span>
                      <p className="text-xs text-gray-500">Returned on: {history.endDate} | Billed Days: {history.days}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border">
                        Earned: ₹{history.totalCost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Section 3: Gemini AI Care Advisor */}
        <section className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">✨ Gemini AI Care Advisor</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded">AI Powered</span>
          </div>
          <form onSubmit={handleGenerateCare} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
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

      {/* Modern React Modal Dialog for Return Confirmation */}
      {selectedBookingForReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Confirm Return for {selectedBookingForReturn.customerName}
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Expected return date was: <strong>{selectedBookingForReturn.endDate}</strong>. 
              Confirm or adjust the actual date when the bird is being returned below:
            </p>

            <div className="mb-4">
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Actual Return Date:
              </label>
              <input 
                type="date" 
                value={returnDateInput}
                onChange={(e) => setReturnDateInput(e.target.value)}
                className="border p-2 rounded text-sm w-full bg-slate-50"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setSelectedBookingForReturn(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmReturn}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded shadow"
              >
                Confirm Return & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}