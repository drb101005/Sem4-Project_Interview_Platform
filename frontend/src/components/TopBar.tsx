export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-ink">{title}</h1>
      {subtitle ? <p className="text-slate">{subtitle}</p> : null}
    </div>
  );
}
