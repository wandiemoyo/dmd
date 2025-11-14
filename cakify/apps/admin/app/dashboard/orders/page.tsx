import { AdminApi } from "../../../lib/api";
import { OrdersTable } from "../../../components/OrdersTable";
import { DashboardShell } from "../../../components/DashboardShell";

export default async function OrdersPage() {
  const orders = await AdminApi.listOrders();
  return (
    <DashboardShell>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-stone-500">Live feed of customer purchases</p>
        </div>
        <OrdersTable orders={orders} />
      </div>
    </DashboardShell>
  );
}
