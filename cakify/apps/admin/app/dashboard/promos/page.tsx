import { AdminApi } from "../../../lib/api";
import { DashboardShell } from "../../../components/DashboardShell";

export default async function PromosPage() {
  const promos = await AdminApi.listPromos();
  return (
    <DashboardShell>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Promo codes</h1>
          <p className="text-stone-500">Control incentives and campaigns</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.code} className="border-t border-stone-100">
                  <td className="px-4 py-3 font-mono text-xs">{promo.code}</td>
                  <td className="px-4 py-3">{promo.discountPercent}%</td>
                  <td className="px-4 py-3">{promo.isActive ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
