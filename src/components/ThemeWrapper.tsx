import React from "react";

export interface ThemeWrapperProps {
  theme?: "dark" | "light" | "minimal";
  children: React.ReactNode;
}

export function ThemeWrapper({ theme = "dark", children }: ThemeWrapperProps) {
  let bgStyles = "";
  let textStyles = "";

  if (theme === "light") {
    bgStyles = "bg-gradient-to-b from-stone-50 via-neutral-100 to-stone-100";
    textStyles = "text-neutral-900";
  } else if (theme === "minimal") {
    bgStyles = "bg-black";
    textStyles = "text-neutral-100";
  } else {
    // dark (default)
    bgStyles = "bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))]";
    textStyles = "text-neutral-100";
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between transition-colors duration-300 relative selection:bg-violet-500 selection:text-white ${bgStyles} ${textStyles}`}
    >
      {/* Decorative ambient background spots for dark theme */}
      {theme === "dark" && (
        <>
          <div
            className="pointer-events-none fixed top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[130px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none fixed bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[130px]"
            aria-hidden="true"
          />
        </>
      )}

      {/* Main container */}
      <main className="w-full max-w-md px-5 py-12 md:py-16 flex flex-col items-center z-10 flex-1">
        {children}
      </main>

      {/* Subtle footer */}
      <footer className="w-full py-6 text-center text-xs opacity-50 z-10 select-none">
        <p>© {new Date().getFullYear()} • Dicebooth Links</p>
      </footer>
    </div>
  );
}

export default ThemeWrapper;
