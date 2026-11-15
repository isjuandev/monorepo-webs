import type { Session } from "@/lib/security/sessions.ts";

declare global {
  namespace App {
    interface Locals {
      session: Readonly<Session> | null;
    }
  }
}
