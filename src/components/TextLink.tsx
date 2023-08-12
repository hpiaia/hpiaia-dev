export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-white cursor-pointer">
      {children}
    </a>
  );
}
