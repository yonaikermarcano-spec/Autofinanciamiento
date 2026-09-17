"use client";

import React, { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import ClientPortal from "@/components/ClientPortal";
import { Building2, Smartphone, Moon, Sun } from "lucide-react";

export default function Home() {
  const [viewMode, setViewMode] = useState<"ADMIN" | "CLIENT">("ADMIN");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = (localStorage.getItem("autolending_theme") as "light" | "dark") || "light";
    const savedView = (localStorage.getItem("autolending_view") as "ADMIN" | "CLIENT") || "ADMIN";
    setTheme(savedTheme);
    setViewMode(savedView);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    const handleThemeEvent = (e: CustomEvent<{ theme: "light" | "dark" }>) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme);
        localStorage.setItem("autolending_theme", e.detail.theme);
        document.documentElement.classList.toggle("dark", e.detail.theme === "dark");
      }
    };

    window.addEventListener("autolending_theme_sync" as any, handleThemeEvent);
    return () => window.removeEventListener("autolending_theme_sync" as any, handleThemeEvent);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("autolending_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.dispatchEvent(new CustomEvent("autolending_theme_sync", { detail: { theme: nextTheme } }));
  };

  const handleSelectView = (mode: "ADMIN" | "CLIENT") => {
    setViewMode(mode);
    localStorage.setItem("autolending_view", mode);
  };

  return (
    <div className="relative min-h-screen bg-google-surface-light dark:bg-google-surface-dark text-slate-900 dark:text-zinc-100">
      {/* Selector Flotante de Modo Dual - Google M3 Pill */}
      <nav 
        aria-label="Selector de Vista"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-1.5rem)] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-full shadow-xl shadow-zinc-900/10 dark:shadow-black/40 flex items-center gap-1 transition-all duration-200"
      >
        <button
          onClick={() => handleSelectView("ADMIN")}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            viewMode === "ADMIN" 
              ? "bg-google-blue-600 text-white shadow-sm font-bold" 
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Financiadora</span>
        </button>

        <button
          onClick={() => handleSelectView("CLIENT")}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            viewMode === "CLIENT" 
              ? "bg-google-blue-600 text-white shadow-sm font-bold" 
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Portal Cliente</span>
        </button>

        <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          title={theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
          className="p-1.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition cursor-pointer"
        >
          {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-600" />}
        </button>
      </nav>

      {viewMode === "ADMIN" ? (
        <Dashboard />
      ) : (
        <ClientPortal onSwitchToAdmin={() => handleSelectView("ADMIN")} />
      )}
    </div>
  );
}
