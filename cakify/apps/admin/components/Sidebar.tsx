 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cake, MapPin, Truck, Users } from "lucide-react";
import clsx from "classnames";

const links = [
  { href: "/", label: "Overview", icon: Cake },
  { href: "/dashboard/orders", label: "Orders", icon: Truck },
  { href: "/dashboard/bakers", label: "Bakers", icon: Users },
  { href: "/dashboard/promos", label: "Promos", icon: MapPin }
];

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="bg-white border-r border-stone-200 w-64 min-h-screen p-6">
      <div className="text-2xl font-bold mb-8">Cakify Admin</div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-2 transition",
                active ? "bg-brand/10 text-brand" : "text-stone-600 hover:bg-stone-100"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
