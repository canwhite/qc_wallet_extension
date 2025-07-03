import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function ContentBox({ className = "", children }: Props) {
  return (
    <div className={cn("w-full h-full bg-white p-4", className)}>
      {children}
    </div>
  );
}
