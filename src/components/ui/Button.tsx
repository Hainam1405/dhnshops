"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const baseCls =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none select-none";

const variantCls: Record<Variant, string> = {
  solid: "bg-accent text-accent-ink hover:bg-fg",
  outline: "border border-line-strong text-fg hover:border-accent hover:text-accent",
  ghost: "text-fg hover:text-accent",
};

const sizeCls: Record<Size, string> = {
  sm: "h-9 px-4 text-xs uppercase tracking-widest",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-sm uppercase tracking-widest",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  href?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const cls = cn(baseCls, variantCls[variant], sizeCls[size], className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
