import { Check, TriangleAlert, X } from "lucide-react";

interface StatusBannerProps {
  variant: "success" | "error";
  children: React.ReactNode;
  onDismiss: () => void;
}

// docs/front-end-spec.md#statusbanner — feedback in-situ, nunca un modal
// bloqueante; varios banners pueden coexistir (un lote puede tener éxitos
// y conflictos al mismo tiempo).
export function StatusBanner({ variant, children, onDismiss }: StatusBannerProps) {
  const isSuccess = variant === "success";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
        isSuccess ? "bg-success-bg text-success" : "bg-error-bg text-destructive"
      }`}
    >
      <span className="flex size-6 shrink-0 items-center justify-center">
        {isSuccess ? <Check className="size-5" /> : <TriangleAlert className="size-5" />}
      </span>
      <div className="flex-1 font-medium">{children}</div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar mensaje"
        className="shrink-0 opacity-70 hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
