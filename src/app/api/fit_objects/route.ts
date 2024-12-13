import { NextResponse } from 'next/server'
import pool from '../../../db/pool'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const queryParams = url.searchParams

    // Parse query comparison here because prepared statements don't work with these symbols
    const queryComparison = queryParams.get('comparison')
    let comparison = ''
    switch (queryComparison) {
      case '>=':
        comparison = '>='
        break;

      case '=':
        comparison = '='
        break;
    
      default:
        comparison = '<='
        break;
    }

    const insertValues: string[] = []
    let preparedStatement = `
      SELECT *
      FROM objects
      NATURAL JOIN (
        SELECT *
        FROM objects_dimensions
        NATURAL JOIN (
          SELECT *
          FROM dimensions
          WHERE 1=1
    `

    const height = queryParams.get('height')
    if (height) {
      preparedStatement += `
        AND height ${comparison} ?
      `
      insertValues.push(`${height}`)
    }

    const width = queryParams.get('width')
    if (width) {
      preparedStatement += `
        AND width ${comparison} ?
      `
      insertValues.push(`${width}`)
    }

    const depth = queryParams.get('depth')
    if (depth) {
      preparedStatement += `
        AND depth ${comparison} ?
      `
      insertValues.push(`${depth}`)
    }

    preparedStatement += `
        ) as filtered_dimensions
      ) as filtered_objects_dimensions
      NATURAL JOIN (
        SELECT artist_id,
               name as artist_name
        FROM artists
      ) as filtered_artists;
    `

    const [rows] = await pool.execute(preparedStatement, insertValues)

    const dataDict = (rows as Array<any>).reduce((acc: any, row: any) => {
      if (!acc[row.object_id]) {
        acc[row.object_id] = {
          title: row.title,
          artist: row.artist_name,
          dimensions: [{
            id: row.dimensions_id,
            description: row.description,
            height: row.height,
            width: row.width,
            depth: row.depth,
          }]
        }
      } else {
        acc[row.object_id].dimensions.push({
          id: row.dimensions_id,
          description: row.description,
          height: row.height,
          width: row.width,
          depth: row.depth,
        })
      }
      return acc
    }, {})

    return NextResponse.json(Object.entries(dataDict))
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch objects' }, { status: 500 })
  }
}
