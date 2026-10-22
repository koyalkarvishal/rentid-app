'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [tenantIdCode, setTenantIdCode] = useState('TID-2026-7FMC6G');
  const [shareIdentity, setShareIdentity] = useState(true);
  const [shareHouseDetails, setShareHouseDetails] = useState(true);
  const [shareRentalHistory, setShareRentalHistory] = useState(true);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    try {
      const res = await fetch('/api/tenant/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantIdCode,
          shareIdentity,
          shareHouseDetails,
          shareRentalHistory,
        }),
      });
      if (res.ok) {
        setMsg('Privacy preferences updated successfully!');
      } else {
        setMsg('Failed to update preferences');
      }
    } catch {
      setMsg('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-blue-400">Tenant Dashboard</h1>
          <p className="text-xs text-slate-400">Manage your privacy & public profile controls.</p>
        </div>

        {msg && <p className="text-xs text-emerald-400 font-semibold">{msg}</p>}

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Your Tenant ID</label>
            <input
              type="text"
              value={tenantIdCode}
              onChange={(e) => setTenantIdCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shareIdentity}
                onChange={(e) => setShareIdentity(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
              />
              <span>Share Email & Mobile Number</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shareHouseDetails}
                onChange={(e) => setShareHouseDetails(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
              />
              <span>Share House No, Address & Rent Details</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shareRentalHistory}
                onChange={(e) => setShareRentalHistory(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
              />
              <span>Share Landlord Reviews & History</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-500 font-semibold p-3 rounded-lg text-sm transition-all"
          >
            Save Privacy Settings
          </button>
        </div>
      </div>
    </div>
  );
}