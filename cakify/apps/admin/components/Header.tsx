"use client";

import { Bell } from "lucide-react";

export const Header = () => (
  <header className="flex items-center justify-between border-b border-stone-200 bg-white px-8 py-4">
    <div>
      <p className="text-sm text-stone-500">Operational dashboard</p>
      <h1 className="text-2xl font-bold">Good day, Admin</h1>
    </div>
    <button className="rounded-full border border-stone-200 p-2">
      <Bell />
    </button>
  </header>
);
