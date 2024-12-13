import { NextResponse } from 'next/server';
import pool from '../../../db/pool';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT classification_id as id,
             name
      FROM classifications;
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
