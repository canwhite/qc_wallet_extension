import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  className: string;
  children: ReactNode;
};

export function Row({ className = "", children }: Props) {
  return <div className={cn("flex flex-1 px-2", className)}>{children}</div>;
}
