import { NextResponse } from 'next/server'
import pool from '../../../db/pool'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const queryParams = url.searchParams

    const insertValues: string[] = []
    let preparedStatement = `
      SELECT *
      FROM objects
    `

    const culture = queryParams.get('culture')
    if (culture) {
      preparedStatement += `
        NATURAL JOIN (
          SELECT *
          FROM objects_cultures
          NATURAL JOIN (
            SELECT culture_id,
                   name as culture_name
            FROM cultures
            WHERE name LIKE ?
          ) as filtered_cultures
        ) as filtered_objects_cultures
      `
      insertValues.push(`%${culture}%`)
    }

    const artist = queryParams.get('artist')
    if (artist) {
      preparedStatement += `
        NATURAL JOIN (
          SELECT artist_id,
                name as artist_name
          FROM artists
          WHERE name LIKE ?
        ) as filtered_artists
      `
      insertValues.push(`%${artist}%`)
    } else {
      preparedStatement += `
        NATURAL JOIN (
          SELECT artist_id,
                 name as artist_name
          FROM artists
        ) as filtered_artists
      `
    }

    const period = queryParams.get('period')
    if (period) {
      preparedStatement += `
        NATURAL JOIN (
          SELECT period_id,
                 name as period_name
          FROM periods
          WHERE name LIKE ?
        ) as filtered_periods
      `
      insertValues.push(`%${period}%`)
    } else {
      preparedStatement += `
        LEFT JOIN (
          SELECT period_id,
                 name as period_name
          FROM periods
        ) as filtered_periods
        ON objects.period_id = filtered_periods.period_id
      `
    }

    preparedStatement += `
      WHERE 1=1
    `

    const title = queryParams.get('title')
    if (title) {
      preparedStatement += `
        AND title LIKE ?
      `
      insertValues.push(`%${title}%`)
    }

    const dated = queryParams.get('dated')
    if (dated) {
      preparedStatement += `
        AND dated LIKE ?
      `
      insertValues.push(`%${dated}%`)
    }

    const acquisitionId = queryParams.get('acquisitionId')
    if (acquisitionId) {
      preparedStatement += `
        AND acquisition_id = ?
      `
      insertValues.push(acquisitionId)
    }

    const classificationId = queryParams.get('classificationId')
    if (classificationId) {
      preparedStatement += `
        AND classification_id = ?
      `
      insertValues.push(classificationId)
    }

    preparedStatement += `;`

    const [rows] = await pool.execute(preparedStatement, insertValues)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch objects' }, { status: 500 })
  }
}
