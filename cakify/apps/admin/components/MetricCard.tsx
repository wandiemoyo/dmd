import { ReactNode } from "react";

export const MetricCard = ({ title, value, trend }: { title: string; value: string; trend?: ReactNode }) => (
  <div className="rounded-2xl border border-stone-200 bg-white p-6">
    <p className="text-sm text-stone-500">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
    {trend && <div className="mt-2 text-sm text-green-600">{trend}</div>}
  </div>
);
