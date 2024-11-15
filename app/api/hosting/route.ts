import { NextResponse } from 'next/server';
import { getAccounts, createAccount, deleteAccount } from '@/app/lib/db';

export async function GET() {
  try {
    const accounts = await getAccounts();
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const account = await createAccount({
      ...data,
      startDate: new Date(data.startDate),
      expiryDate: new Date(data.expiryDate),
    });
    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    await deleteAccount(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 });
  }
}