import { Link } from "@tanstack/react-router";
import logo from "@/assets/goku-logo.png.asset.json";
import { useSiteSettings } from "@/lib/settings";

export function LogoMark({ size = 40 }: { size?: number }) {
  const { site_name } = useSiteSettings();
  return (
    <img
      src={logo.url}
      alt={`${site_name} logo`}
      width={size}
      height={size}
      className="rounded-xl shadow-glow object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ size = 40 }: { size?: number }) {
  const { site_name } = useSiteSettings();
  const parts = site_name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts.pop() : null;
  return (
    <Link to="/" className="flex items-center gap-3">
      <LogoMark size={size} />
      <span className="font-display text-xl font-extrabold tracking-tight">
        {parts.join(" ")}
        {last && (
          <>
            {" "}
            <span className="text-brand">{last}</span>
          </>
        )}
      </span>
    </Link>
  );
}
