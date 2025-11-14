import { AdminApi } from "../../../lib/api";
import { DashboardShell } from "../../../components/DashboardShell";

export default async function BakersPage() {
  const bakers = await AdminApi.listBakers();
  return (
    <DashboardShell>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bakers</h1>
          <p className="text-stone-500">Manage onboarding, verification, and payouts</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {bakers.map((baker: any) => (
            <div key={baker.id} className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{baker.businessName}</h3>
                  <p className="text-stone-500">{baker.location.city}</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {baker.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <p className="mt-4 text-sm text-stone-600">{baker.description}</p>
              <div className="mt-4 text-sm text-stone-500">Specialties: {baker.specialties.join(", ")}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
