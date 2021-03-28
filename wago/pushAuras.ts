import redis from 'redis'
import { promisify } from 'util'
import { db } from '../utils/firebase'
import { convertAura, convertErrors, WagoAura } from './convertAura'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Typesense = require('typesense/lib/Typesense')

export const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_KEY,
  connectionTimeoutSeconds: 2,
})

const redisClient = redis.createClient()
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient)
const hsetAsync = promisify(redisClient.hset).bind(redisClient)

const main = async () => {
  const collections = await typesenseClient.collections().retrieve()
  if (!collections.some((collection: any) => collection.name == 'auras')) {
    console.log('creating typesense auras collection')
    await typesenseClient.collections().create({
      name: 'auras',
      fields: [
        { name: 'type', type: 'string', facet: true },
        { name: 'dateCreated', type: 'string', facet: true },
        { name: 'dateModified', type: 'string', facet: true },
        { name: 'name', type: 'string' },
        { name: 'categoryNames', type: 'string[]', facet: true },
        { name: 'views', type: 'int32', facet: true },
      ],
      default_sorting_field: 'views',
    })
  }

  const wagos: WagoAura[] = Object.values(
    await hgetallAsync('auras'),
  ).map((wago) => JSON.parse(wago))

  const migrated: Aura.Aura[] = Object.values(
    (await hgetallAsync('auras_migrated')) || {},
  ).map((wago) => JSON.parse(wago))

  const toUpload = wagos.filter(
    (wago) => !migrated.some((aura) => aura.id === wago.slug),
  )

  const ready = toUpload.filter(
    (aura) =>
      aura.s3screens !== undefined &&
      aura.code !== undefined &&
      aura.newCategories !== undefined,
  )

  const converted = ready
    .map((wago) => convertAura(wago))
    .filter(Boolean) as Aura.Aura[]

  const batchSize = 500
  for (let i = 0; i < converted.length; i += batchSize) {
    console.log(`pushing auras ${i} to ${i + batchSize} of ${converted.length}`)
    const batch = converted.slice(i, i + batchSize)

    const dbBatch = db().batch()
    const dbCol = db().collection('auras')
    batch.forEach((aura) => dbBatch.set(dbCol.doc(aura.id), aura))
    await dbBatch.commit()

    const searchAuras: Aura.SearchAura[] = batch.map((aura) => ({
      ...aura,
      categoryNames: aura.categories.map((category) => category.text),
    }))

    const res = await typesenseClient
      .collections('auras')
      .documents()
      .import(searchAuras, { action: 'upsert' })

    const errors: string[] = res.map((obj: any) => obj.error).filter(Boolean)
    if (errors.length) {
      errors.forEach(console.error)
      throw new Error(`Failed to push to typesense`)
    }

    for (const aura of batch) {
      await hsetAsync(['auras_migrated', aura.id, JSON.stringify(aura)])
    }
  }

  if (convertErrors.length) {
    console.log('convert errors')
    console.log(Array.from(new Set(convertErrors)))
  }

  console.log(
    `uploaded ${converted.length}, not ready ${
      toUpload.length - ready.length
    }, failed to convert ${ready.length - converted.length}`,
  )
}

main()
  .then(() => {
    console.log('exiting')
    process.exit(0)
  })
  .catch((error) => {
    console.error('error in main: ', error)
    process.exit(1)
  })
