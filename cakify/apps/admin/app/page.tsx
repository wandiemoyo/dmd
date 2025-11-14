import { MetricCard } from "../components/MetricCard";
import { OrdersTable } from "../components/OrdersTable";
import { DashboardShell } from "../components/DashboardShell";
import { AdminApi } from "../lib/api";

export default async function DashboardPage() {
  const [orders, bakers] = await Promise.all([AdminApi.listOrders(), AdminApi.listBakers()]);
  const totalGMV = orders.reduce((acc: number, order: any) => acc + order.totalAmount, 0);

  return (
    <DashboardShell>
      <main className="flex-1 p-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Gross volume" value={`$${totalGMV.toFixed(2)}`} trend={<span>+12% vs last week</span>} />
          <MetricCard title="Active bakers" value={bakers.length.toString()} />
          <MetricCard title="Open orders" value={orders.filter((o: any) => o.status !== "delivered").length.toString()} />
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Live orders</h2>
          <OrdersTable orders={orders} />
        </section>
      </main>
    </DashboardShell>
  );
}
