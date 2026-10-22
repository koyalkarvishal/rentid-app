'use client';

import { useState } from 'react';

export default function LandlordReviewPage() {
  const [tenantIdCode, setTenantIdCode] = useState('TID-2026-7FMC6G');
  const [landlordName, setLandlordName] = useState('');
  const [landlordMobile, setLandlordMobile] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [overallRating, setOverallRating] = useState('5');
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('/api/landlord/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landlordName,
          landlordMobile,
          houseNo,
          propertyAddress,
          tenantIdCode,
          rentAmount,
          depositAmount,
          overallRating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('✓ Review & Tenancy record submitted successfully!');
        setComment('');
      } else {
        setMsg(`Error: ${data.error}`);
      }
    } catch {
      setMsg('Server error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <h1 className="text-xl font-bold text-blue-400">Landlord Review & Tenancy Portal</h1>
        <p className="text-xs text-slate-400">Enter house details and submit feedback for your tenant.</p>

        {msg && <p className="text-xs text-center text-emerald-400 font-semibold">{msg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Landlord Name</label>
              <input
                type="text"
                required
                placeholder="Ramesh Kumar"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Landlord Mobile</label>
              <input
                type="text"
                required
                placeholder="9876543210"
                value={landlordMobile}
                onChange={(e) => setLandlordMobile(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Tenant ID Code</label>
              <input
                type="text"
                required
                value={tenantIdCode}
                onChange={(e) => setTenantIdCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">House No / Flat No</label>
              <input
                type="text"
                required
                placeholder="Flat 402, Building A"
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Property Address</label>
            <input
              type="text"
              required
              placeholder="Banjara Hills, Hyderabad"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                required
                placeholder="15000"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Deposit Paid (₹)</label>
              <input
                type="number"
                required
                placeholder="30000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Rating</label>
            <select
              value={overallRating}
              onChange={(e) => setOverallRating(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5/5) Excellent Tenant</option>
              <option value="4">⭐⭐⭐⭐ (4/5) Good Tenant</option>
              <option value="3">⭐⭐⭐ (3/5) Average Tenant</option>
              <option value="2">⭐⭐ (2/5) Poor</option>
              <option value="1">⭐ (1/5) Bad Experience</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Review & Remarks</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Paid rent on time every month, property clean, smooth exit..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 font-semibold p-3 rounded-lg text-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review & Record Tenancy'}
          </button>
        </form>
      </div>
    </div>
  );
}