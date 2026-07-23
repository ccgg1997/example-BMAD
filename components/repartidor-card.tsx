import { Check, User } from "lucide-react";

interface RepartidorCardProps {
  nombre: string;
  selected: boolean;
  onSelect: () => void;
}

// docs/front-end-spec.md#repartidorcard — selector táctil, nunca un <select>
// de texto: "la selección por tarjeta es un principio de diseño validado,
// no un detalle estético".
export function RepartidorCard({ nombre, selected, onSelect }: RepartidorCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex flex-1 flex-col items-center gap-2 rounded-xl border-2 py-3 transition-colors duration-150 ease-out ${
        selected ? "border-primary bg-accent" : "border-border bg-background"
      }`}
    >
      {selected && (
        <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" />
        </span>
      )}
      <span
        className={`flex size-11 items-center justify-center rounded-full ${
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        <User className="size-5" />
      </span>
      <span className="text-sm font-medium">{nombre}</span>
    </button>
  );
}
