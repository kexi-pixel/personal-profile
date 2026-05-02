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

type SectionId = (typeof sections)[number]["id"];

export function Navbar() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;

      if (pageBottom - scrollBottom <= 24) {
        setActiveSection((current) => (current === "contact" ? current : "contact"));
        return;
      }

      const viewportProbe = window.innerHeight * 0.34;
      let nextActiveSection: SectionId = sections[0].id;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= viewportProbe && rect.bottom >= viewportProbe) {
          nextActiveSection = section.id;
          nearestDistance = 0;
          break;
        }

        const distanceToSection = Math.min(
          Math.abs(rect.top - viewportProbe),
          Math.abs(rect.bottom - viewportProbe),
        );

        if (distanceToSection < nearestDistance) {
          nearestDistance = distanceToSection;
          nextActiveSection = section.id;
        }
      }

      setActiveSection((current) =>
        current === nextActiveSection ? current : nextActiveSection,
      );
    };

    const requestSectionUpdate = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", requestSectionUpdate, { passive: true });
    window.addEventListener("resize", requestSectionUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestSectionUpdate);
      window.removeEventListener("resize", requestSectionUpdate);
    };
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
