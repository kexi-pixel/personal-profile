"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "capabilities", label: "Capabilities" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export function Navbar() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.7],
      },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 rounded-[28px] border border-white/50 bg-white/68 px-3 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:rounded-full sm:py-2">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="#overview"
            className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold tracking-[-0.02em] text-slate-900"
          >
            JY Chen
          </Link>
        </div>
        <nav className="hide-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto sm:justify-center">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className={`relative whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors sm:text-sm ${
                  isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-highlight"
                    className="absolute inset-0 -z-10 rounded-full bg-slate-950/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                ) : null}
                {section.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
