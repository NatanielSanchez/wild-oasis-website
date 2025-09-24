import { ReactNode } from "react";
import SideNavigation from "../_components/SideNavigation";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-full grid-cols-[16rem_1fr] gap-12">
      <SideNavigation />
      <div>{children}</div>
    </div>
  );
}

export default Layout;
