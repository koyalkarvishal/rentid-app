import { prisma } from '@/lib/prisma';

export default async function VerifyTenantPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  const tenantProfile = await prisma.tenantProfile.findUnique({
    where: { tenantIdCode: tenantId },
    include: {
      user: true,
      consentSetting: true,
      receivedReviews: {
        include: {
          landlord: {
            include: { user: true },
          },
          tenancy: {
            include: { property: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!tenantProfile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-red-500/30 text-center">
          <h1 className="text-xl font-bold text-red-400 mb-2">Invalid RENTID</h1>
          <p className="text-slate-400 text-sm">This Tenant ID was not found in our system.</p>
        </div>
      </div>
    );
  }

  const { user, consentSetting, receivedReviews } = tenantProfile;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-emerald-500/40 shadow-2xl relative space-y-4">
        <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
          <span>✓</span> VERIFIED TENANT
        </div>

        <div className="text-center mt-2">
          <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-blue-400 mb-2 border-2 border-blue-500">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-xl font-bold">{user.fullName}</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">{tenantProfile.tenantIdCode}</p>
        </div>

        <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-700/60 text-xs">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Status</span>
            <span className="text-emerald-400 font-medium">Active Member</span>
          </div>

          {consentSetting?.shareIdentity && (
            <>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Email</span>
                <span className="text-slate-200">{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Mobile</span>
                <span className="text-slate-200">{user.mobile}</span>
              </div>
            </>
          )}

          {consentSetting?.shareHouseDetails && (
            <>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">House / Flat No</span>
                <span className="text-slate-200">{tenantProfile.houseNo || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Address</span>
                <span className="text-slate-200">{tenantProfile.currentAddress || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Current Rent</span>
                <span className="text-emerald-400 font-semibold">₹{tenantProfile.currentRent || 0}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deposit Paid</span>
                <span className="text-blue-400 font-semibold">₹{tenantProfile.depositPaid || 0}</span>
              </div>
            </>
          )}
        </div>

        {/* Verified Landlord Reviews Section */}
        {consentSetting?.shareRentalHistory && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Landlord History & Reviews</h2>
            {receivedReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                No landlord reviews added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {receivedReviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-900 p-3 rounded-lg border border-slate-700/60 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-semibold">
                        {'⭐'.repeat(Math.round(rev.overallRating))} ({rev.overallRating}/5)
                      </span>
                      <span className="text-slate-500 text-[10px]">By: {rev.landlord.user.fullName}</span>
                    </div>
                    <p className="text-slate-300 italic">"{rev.comment}"</p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                      <span>House: {rev.tenancy.property.houseNo}</span>
                      <span>Rent: ₹{rev.tenancy.property.rentAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="pt-2 text-center text-xs text-slate-500">
          Powered by <span className="font-bold text-blue-400">RENTID Platform</span>
        </div>
      </div>
    </div>
  );
}