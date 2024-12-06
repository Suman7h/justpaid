
"use client";

import { usePathname } from "next/navigation";
import { Page } from "../page/page";

export default function RouteHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthRoute = pathname.startsWith("/auth");

  return (<Page />)  ;
}
