"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HousePlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBanner } from "@/components/status-banner";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push("/registro");
        return;
      }

      const body = await response.json().catch(() => null);
      setError(body?.error ?? "No se pudo iniciar sesión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border bg-background p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full border-2 border-primary text-primary">
            <HousePlus className="size-6" />
          </span>
          <div>
            <h1 className="text-lg font-bold">Domicilios San Pedro</h1>
            <p className="text-sm text-muted-foreground">Droguería</p>
          </div>
        </div>

        <Input
          type="password"
          placeholder="Clave"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && (
          <StatusBanner variant="error" onDismiss={() => setError(null)}>
            {error}
          </StatusBanner>
        )}

        <Button type="submit" size="lg" className="gap-2" disabled={enviando || password.length === 0}>
          <LogIn className="size-4" />
          {enviando ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </main>
  );
}
