import { Order } from "@cakify/types";

export const OrdersTable = ({ orders }: { orders: Order[] }) => (
  <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
    <table className="w-full text-left text-sm">
      <thead className="bg-stone-50 text-stone-500">
        <tr>
          <th className="px-4 py-3">Order</th>
          <th className="px-4 py-3">Customer</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3">Scheduled</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-t border-stone-100">
            <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
            <td className="px-4 py-3">{order.customerId}</td>
            <td className="px-4 py-3 capitalize">{order.status.replace(/_/g, " ")}</td>
            <td className="px-4 py-3 font-semibold">${order.totalAmount.toFixed(2)}</td>
            <td className="px-4 py-3">{new Date(order.scheduledTime).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
