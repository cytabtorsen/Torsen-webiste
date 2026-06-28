"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-reveal wrapper. Gentle fade + translate (≈320ms) when the section
 * enters the viewport. Honors prefers-reduced-motion (renders static, no motion).
 *
 * This is the ONLY ambient motion on the page besides the signature hero —
 * the motion budget is deliberately small.
 */
export function Section({
  id,
  children,
  className = "",
  as = "section",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "footer";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: [0.21, 0.5, 0.31, 1] },
    },
  };

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Shared centered page gutter. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-content px-6 sm:px-8 ${className}`}>{children}</div>
  );
}
