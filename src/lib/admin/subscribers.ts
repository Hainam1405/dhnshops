import { promises as fs } from "fs";
import path from "path";
import { hasDb } from "@/lib/db/client";
import * as db from "@/lib/db/subscribers";

/**
 * Newsletter subscribers.
 *
 * Env-gated exactly like the catalog and order stores: Postgres when
 * DATABASE_URL is set, otherwise data/subscribers.json for local dev.
 *
 * This exists because the signup form used to discard the address and then tell
 * the visitor "check your inbox" — collecting an email and throwing it away is
 * worse than not having the form at all.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "subscribers.json");

/** Deliberately permissive: reject the obviously-broken, let the mail provider judge the rest. */
export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

let lockChain: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lockChain.then(fn, fn);
  lockChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readFileStore(): Promise<string[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/** Atomic write: temp file then rename, so a reader never sees a truncated file. */
async function writeFileStore(emails: string[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(emails, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

/** Idempotent: subscribing twice is a no-op, not an error the visitor must see. */
export async function addSubscriber(email: string): Promise<void> {
  if (hasDb) return db.addSubscriber(email);
  return withLock(async () => {
    const emails = await readFileStore();
    if (emails.includes(email)) return;
    emails.unshift(email);
    await writeFileStore(emails);
  });
}

export async function listSubscribers(): Promise<string[]> {
  if (hasDb) return db.listSubscribers();
  return readFileStore();
}
