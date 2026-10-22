"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tenant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          Tenant Registration
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                EMAIL
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                MOBILE NUMBER
              </label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter mobile number"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Tenant"}
            </button>
          </form>
        ) : (
          /* Success / Result Section */
          <div className="text-center space-y-4">
            <div className="bg-slate-900 border border-blue-500/40 p-4 rounded-xl">
              <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">
                Digital RENTID Card
              </div>
              <div className="text-lg font-bold">
                {result?.user?.fullName || result?.fullName || "Tenant"}
              </div>
              <div className="text-sm font-mono text-slate-400 mb-3">
                {result?.tenantIdCode || result?.tenantId || ""}
              </div>

              <div className="bg-white p-3 rounded-lg inline-block mb-3">
                {(result?.qrCodeUrl || result?.qrCode) && (
                  <img
                    src={result.qrCodeUrl || result.qrCode}
                    alt="Tenant QR Code"
                    className="w-40 h-40 object-contain"
                  />
                )}
              </div>

              <p className="text-xs text-slate-400">
                Scan this QR code to verify tenant profile
              </p>
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