import type { ReactNode } from "react";
import { LogoMark } from "./Logo";
import hero from "@/assets/hero.jpg";

export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-[80vh] items-center justify-center px-4 py-12">
      <img src={hero} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-hero-fade" />
      <div className="w-full max-w-md rounded-3xl border border-border glass p-8 shadow-glow">
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark size={72} />
          <p className="font-display text-lg font-extrabold">Goku <span className="text-brand">Streaming</span></p>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z"/></svg>
  );
}
