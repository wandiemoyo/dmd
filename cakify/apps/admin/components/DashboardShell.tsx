import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const DashboardShell = ({ children }: { children: ReactNode }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  </div>
);
