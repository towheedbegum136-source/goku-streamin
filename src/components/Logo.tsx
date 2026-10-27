import { Link } from "@tanstack/react-router";
import logo from "@/assets/goku-logo.png.asset.json";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <img
      src={logo.url}
      alt="Goku Streaming logo"
      width={size}
      height={size}
      className="rounded-xl shadow-glow object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <LogoMark size={size} />
      <span className="font-display text-xl font-extrabold tracking-tight">
        Goku <span className="text-brand">Streaming</span>
      </span>
    </Link>
  );
}
