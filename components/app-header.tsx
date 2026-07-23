import { HousePlus } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full border-2 border-primary text-primary">
          <HousePlus className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Domicilios San Pedro</p>
          <p className="text-xs text-muted-foreground">Droguería</p>
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium whitespace-nowrap text-secondary-foreground">
        <span className="size-1.5 rounded-full bg-primary" />
        Sesión activa
      </span>
    </header>
  );
}
