'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // <-- Yeh page reload aur redirect hone se rokta hai
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/tenant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Success! Profile Created with ID: ${data.data?.id || 'RENTID-101'}`);
      } else {
        setMessage(`Error: ${data.error || 'Failed to create profile'}`);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4">
      <div className="bg-[#151C2C] border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-1">RENTID</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Create Your Verified Tenant Digital ID</p>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 text-center ${message.startsWith('Success') ? 'bg-green-500/10 border border-green-500 text-green-400' : 'bg-red-500/10 border border-red-500 text-red-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Shiva"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="shiva58@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              placeholder="3692580147"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Register & Generate RENTID'}
          </button>
        </form>
      </div>
    </div>
  );
}