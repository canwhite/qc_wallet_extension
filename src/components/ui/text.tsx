import React from "react";
import { cn } from "@/lib/utils";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "error" | "success" | "warning";
  size?: "sm" | "base" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
  as?: React.ElementType;
}

export function Text({
  children,
  className,
  variant = "default",
  size = "base",
  weight = "normal",
  as: Component = "span",
  ...props
}: TextProps) {
  const variantClasses = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    error: "text-destructive",
    success: "text-success",
    warning: "text-warning"
  };

  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg"
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold"
  };

  return (
    <Component
      className={cn(variantClasses[variant], sizeClasses[size], weightClasses[weight], className)}
      {...props}>
      {children}
    </Component>
  );
}
