"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6"
      >
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-lg font-semibold">Domicilios San Pedro</h1>
          <p className="text-sm text-muted-foreground">Ingresa la clave para continuar</p>
        </div>

        <Input
          type="password"
          placeholder="Clave"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" disabled={enviando || password.length === 0}>
          {enviando ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </main>
  );
}
