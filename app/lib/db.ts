import { sql } from '@vercel/postgres';
import { HostingAccount } from '../types/hosting';

export async function getAccounts() {
  try {
    const { rows } = await sql`
      SELECT * FROM HostingAccount 
      ORDER BY "expiryDate" ASC
    `;
    return rows as HostingAccount[];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function createAccount(account: Omit<HostingAccount, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const { rows } = await sql`
      INSERT INTO HostingAccount (domain, username, "startDate", "durationYears", "expiryDate")
      VALUES (${account.domain}, ${account.username}, ${account.startDate.toISOString()}, ${account.durationYears}, ${account.expiryDate.toISOString()})
      RETURNING *
    `;
    return rows[0] as HostingAccount;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function deleteAccount(id: number) {
  try {
    await sql`
      DELETE FROM HostingAccount 
      WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}