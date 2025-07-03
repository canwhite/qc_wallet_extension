import React from "react";
import { IconAlertSquareRounded, IconAlertCircle } from "@tabler/icons-react";

type Props = {
  className?: string;
  text: string;
};

export default function Warning({ className = "", text }: Props) {
  return (
    <div className="flex items-center w-full bg-yellow-100 rounded p-4">
      <IconAlertCircle stroke={2} className="text-red-400 w-5 h-5" />
      <p className="flex-1 justify-start text-[12px] text-red-400 pl-2">
        {text}
      </p>
    </div>
  );
}
