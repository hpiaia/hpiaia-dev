import { PowerGlitch } from "powerglitch";
import { useEffect, useRef } from "react";

export function GlitchLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    ref.current && PowerGlitch.glitch(ref.current);
  }, [ref]);

  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-white" ref={ref}>
      {children}
    </a>
  );
}
