import { createInterface } from "node:readline";
import { hashPassword } from "../src/lib/security/passwords.ts";

/**
 * Lee la contraseña sin eco en TTY (modo raw). Ignora caracteres de control y secuencias
 * de escape (flechas) y restaura el modo raw ante fin, Ctrl+C, SIGTERM o excepciones.
 */
function readHidden(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    process.stderr.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    let done = false;
    const finish = (error?: Error) => {
      if (done) return;
      done = true;
      try {
        stdin.setRawMode(false);
      } finally {
        stdin.pause();
        stdin.removeListener("data", onData);
        process.removeListener("SIGTERM", onSigterm);
        process.stderr.write("\n");
      }
      if (error) reject(error);
      else resolve(value);
    };
    const onSigterm = () => finish(new Error("Cancelado."));
    const onData = (chunk: string) => {
      try {
        // Un chunk que empieza con ESC es una secuencia (flechas, etc.): se descarta entero.
        if (chunk.startsWith("\u001b")) return;
        for (const char of chunk) {
          if (char === "\r" || char === "\n" || char === "\u0004") return finish();
          if (char === "\u0003") return finish(new Error("Cancelado."));
          if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
          else if (char >= " ") value += char;
        }
      } catch (error) {
        finish(error instanceof Error ? error : new Error(String(error)));
      }
    };
    process.once("SIGTERM", onSigterm);
    stdin.on("data", onData);
  });
}

function readLine(): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin });
    let done = false;
    rl.once("line", (line) => {
      done = true;
      rl.close();
      resolve(line);
    });
    rl.once("close", () => {
      if (!done) resolve("");
    });
  });
}

async function main(): Promise<void> {
  if (process.argv.length > 2) {
    throw new Error("No se acepta la contraseña como argumento; se lee de la entrada estándar.");
  }
  const plain = process.stdin.isTTY
    ? await readHidden("Contraseña (mínimo 16 caracteres): ")
    : await readLine();
  process.stdout.write(`${await hashPassword(plain)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
