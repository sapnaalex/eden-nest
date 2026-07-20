// client/app/page.js
'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  // Mock states to make the application immediately visible for UI review
  const [inventory, setInventory] = useState([
    { id: 1, petType: 'Bird', breed: 'Lovebird', price: '1500', status: 'Available' },
    { id: 2, petType: 'Rabbit', breed: 'Angora', price: '2500', status: 'Available' }
  ]);
  
  const [bookings, setBookings] = useState([
    { id: 1, customerName: 'Sapna', petType: 'Bird', startDate: '2026-07-20', endDate: '2026-07-25', cageType: 'Shop Cage' }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 border-b pb-4 bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">🏡 Eden Nest Pets</h1>
        <p className="text-gray-500 mt-1">Integrated Management & Boarding Dashboard</p>
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
      </main>
    </div>
  );
}