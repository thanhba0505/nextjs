"use client";

export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between px-4 text-xs text-zinc-600 dark:text-zinc-300">
        <span>© {new Date().getFullYear()} Next Frontend</span>
        <span>Footer placeholder</span>
      </div>
    </footer>
  );
}
