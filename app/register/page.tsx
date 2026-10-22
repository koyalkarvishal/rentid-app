'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tenant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <h1 className="text-2xl font-bold text-center text-blue-400 mb-2">RENTID</h1>
        <p className="text-slate-400 text-center text-sm mb-6">Create Your Verified Tenant Digital ID</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="10 digit mobile number"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 font-semibold p-3 rounded-lg text-sm transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Generating ID Card...' : 'Register & Generate RENTID'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-slate-900 border border-blue-500/40 p-4 rounded-xl">
              <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">Digital RENTID Card</div>
             <div className="text-lg font-bold">
  {result?.user?.fullName || result?.fullName || "Tenant"}
</div>
<div className="text-sm font-mono text-slate-400 mb-3">
  {result?.tenantIdCode || result?.tenantId || ""}
</div>

<div className="bg-white p-3 rounded-lg inline-block mb-3">
  {result?.qrCodeUrl && (
    <img src={result.qrCodeUrl} alt="Tenant QR Code" className="w-40 h-40" />
  )}
</div>
              </div>
              
              <p className="text-xs text-slate-400">Scan this QR code to verify tenant profile</p>
            </div>

            <button
              onClick={() => setResult(null)}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Register Another Tenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}