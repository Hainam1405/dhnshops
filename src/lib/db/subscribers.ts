import { ensureReady, getSql } from "./client";

/** Newsletter subscribers, stored in Postgres. Mirrors the file store's surface. */

export async function addSubscriber(email: string): Promise<void> {
  await ensureReady();
  const sql = getSql();
  await sql`
    INSERT INTO subscribers (email) VALUES (${email})
    ON CONFLICT (email) DO NOTHING`;
}

export async function listSubscribers(): Promise<string[]> {
  await ensureReady();
  const sql = getSql();
  const rows = (await sql`
    SELECT email FROM subscribers ORDER BY created_at DESC`) as { email: string }[];
  return rows.map((r) => r.email);
}
