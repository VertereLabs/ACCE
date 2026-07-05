"use client";

// Sign-in page — Story 1.2 (AC1, AC2, AC3).
// Public route: src/app/sign-in/page.tsx
// Passwordless only — no password field ever shown (AC1).
// On success → "Check your email" confirmation state + sonner success toast.
// On error → sonner error toast (AC5).

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);

    try {
      const result = await authClient.signIn.magicLink({
        email: email.trim(),
        callbackURL: "/portal",
      });

      // Better Auth returns an object with `error` when the send fails.
      if (result?.error) {
        toast.error(result.error.message ?? "Could not send magic link. Please try again.");
        return;
      }

      setSubmitted(true);
      toast.success("Magic link sent! Check your inbox.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          {/* ACCE brand mark */}
          <div className="flex justify-center mb-2">
            <span
              aria-hidden="true"
              className="text-3xl font-bold"
              style={{ color: "#1a2744" }}
            >
              ACCE
            </span>
            <span
              aria-hidden="true"
              className="text-3xl font-bold ml-1"
              style={{ color: "#d4a91e" }}
            >
              Tutors
            </span>
          </div>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a magic link.
            No password needed.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {submitted ? (
            // Confirmation state after successful send
            <div
              className="text-center space-y-3 py-4"
              role="status"
              aria-live="polite"
            >
              <p className="text-lg font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground">
                We sent a sign-in link to <strong>{email}</strong>.
                Click it to access your portal. The link expires in 15 minutes.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-describedby="email-hint"
                  disabled={loading}
                  // Visible focus ring handled by the Input component (NFR10).
                />
                <p id="email-hint" className="text-xs text-muted-foreground">
                  We&apos;ll email you a secure, one-time sign-in link.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email.trim()}
                aria-busy={loading}
              >
                {loading ? "Sending…" : "Send me a magic link"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
