import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  className: string;
  children: ReactNode;
};

export function Row({ className = "", children }: Props) {
  return <div className={cn("flex px-2 flex-1", className)}>{children}</div>;
}
