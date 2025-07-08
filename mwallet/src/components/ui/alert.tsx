import React from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  text: string;
};

export function Alert({ className = "", text }: Props) {
  return (
    <div className={cn("flex w-full items-center rounded bg-yellow-100 p-4", className)}>
      <IconAlertCircle stroke={2} className="h-5 w-5 text-red-400" />
      <p className="flex flex-1 items-start pl-2 text-left text-[12px] text-red-400">{text}</p>
    </div>
  );
}
