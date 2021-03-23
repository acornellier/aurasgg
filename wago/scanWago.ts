require('dotenv').config({ path: '.env.local' })

import { Client, query as q } from 'faunadb'

const BATCH_SIZE = 2000

// const auras = Object.values(require('./auras.json'))
const faunaClient = new Client({ secret: process.env.FAUNA_SECRET! })

async function main() {
  await faunaClient.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection('auras')), { size: BATCH_SIZE }),
      q.Lambda('x', q.Delete(q.Var('x'))),
    ),
  )

  // for (let i = 0; i < auras.length; i += BATCH_SIZE) {
  //   console.log(`pushing auras ${i} to ${i + BATCH_SIZE}`)
  //   await faunaClient.query(
  //     q.Map(
  //       auras.slice(i, i + BATCH_SIZE),
  //       q.Lambda(
  //         'aura',
  //         q.Create(q.Collection('auras'), {
  //           ref: ,
  //           data: q.Var('aura')
  //         }),
  //       ),
  //     ),
  //   )
  // }

  console.log('done main')
}

try {
  main().catch((error) => {
    console.error('caught error through Promise.catch()', error)
  })
} catch (error) {
  console.error('caught error through try catch', error)
}
