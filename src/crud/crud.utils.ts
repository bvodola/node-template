import { Model as MongooseModel, QueryOptions } from 'mongoose'
import * as models from 'src/models/models'
import { GenericMongooseModel, OrQueryParam } from './crud.types'

/*
  buildOrQuery EXAMPLE
  let query = {
    $or: await buildOrQuery(q, [
      "name",
      "tags",
      { model: "Categories", index: "category_id", fields: ["name"] },
    ]),
  };
*/

export async function buildOrQuery(q: any, params: (string | OrQueryParam)[]) {
  let orQuery = []

  for (let param of params) {
    if (typeof param === 'string') {
      // Regular Params
      orQuery.push({
        [param]: {
          $regex: q,
          $options: 'i',
        },
      })
    } else {
      // Ref Params
      const Model: MongooseModel<any, {}, {}, {}, any> = models[param.model]
      const childOrQuery = await buildOrQuery(q, param.fields)
      if (Array.isArray(childOrQuery)) {
        const results = await Model.find({ $or: childOrQuery })
        results.forEach((result: any) => {
          orQuery.push({ [(param as OrQueryParam).index]: result._id })
        })
      }
    }
  }

  return orQuery
}

export function buildQuery(query: Record<string, string>) {
  let returnQuery: Record<string, string | number | boolean> = {}
  Object.keys(query).forEach((param) => {
    if (param !== 'q' && param[0] !== '_') {
      const val = query[param]
      if (val === 'true' || val === 'false') {
        returnQuery[param] = JSON.parse(val)
      } else if (!isNaN(Number(val))) {
        returnQuery[param] = Number(val)
      } else {
        returnQuery[param] = val
      }
    }
  })
  return returnQuery
}

export async function getMultipleEntriesById(Collection: any, ids: string[]) {
  try {
    if (typeof ids === 'string') ids = [ids]
    const ids_query = ids.map((_id) => ({
      _id,
    }))
    const results = await Collection.find({ $or: ids_query })
    return results
  } catch (err: unknown) {
    console.error(err)
    if (
      err &&
      typeof err === 'object' &&
      'response' in err &&
      err.response &&
      typeof err.response === 'object' &&
      'data' in err.response
    )
      return err.response.data
    else return err
  }
}

export async function getMany(
  Collection: GenericMongooseModel,
  reqQuery: any,
  textSearchParams?: (string | OrQueryParam)[],
) {
  try {
    // Get params from URL query
    const { q, _start = 0, _end = 10, _order = 'ASC', _sort } = reqQuery
    let query: Record<string, any> = {}
    let options: QueryOptions<any> = {
      skip: Number(_start),
      limit: Number(_end) - Number(_start),
    }

    if (_sort) {
      options.sort = {
        [_sort as string]: _order === 'ASC' ? 1 : -1,
      }
    }

    // ============
    // Search Query
    // ============
    // if (q && Array.isArray(textSearchParams) && textSearchParams.length > 0) {
    if (q) {
      // Create Text Query
      // query = {
      //   $or: [],
      // }
      // query.$or = await buildOrQuery(q, textSearchParams)
      // query = { $text: { $search: q } }
      query = { name: { $regex: q, $options: 'i' } }
    } else {
      query = buildQuery(reqQuery)
    }

    // =============
    // Execute Query
    // =============
    const data = await Collection.find(query, null, options)
    const totalCount = await Collection.countDocuments(query)

    return { data, totalCount }
  } catch (err: any) {
    console.error('CRUD getMany ERROR', err)
    return {
      error: true,
      data: [],
      totalCount: 0,
      message: err.message,
    }
  }
}
