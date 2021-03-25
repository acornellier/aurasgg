import redis from 'redis'
import { promisify } from 'util'
import { db } from '../utils/firebase'
import { convertAura, convertErrors, WagoAura } from './convertAura'

const client = redis.createClient()
const hgetallAsync = promisify(client.hgetall).bind(client)
const hsetAsync = promisify(client.hset).bind(client)
const hdel = promisify(client.hdel).bind(client)

const main = async () => {
  const wagoJsons = await hgetallAsync('auras')
  const wagos: WagoAura[] = Object.values(wagoJsons).map((wago) =>
    JSON.parse(wago),
  )

  const ready = wagos.filter(
    (aura) => aura.s3screens !== undefined && aura.code !== undefined,
  )

  const converted = ready
    .map((wago) => convertAura(wago))
    .filter(Boolean) as Aura.Aura[]

  let idx = 0
  for (const aura of converted) {
    console.log(
      `uploading aura ${++idx}/${converted.length} id ${aura.id} slug ${
        aura.wago!.slug
      }`,
    )
    try {
      await db().collection('auras').doc(aura.id).set(aura)
      await hsetAsync([
        'auras_migrated',
        aura.wago!.slug,
        JSON.stringify({ slug: aura.wago!.slug, date: aura.date }),
      ])
      // @ts-ignore
      await hdel(['auras', aura.wago!.slug])
    } catch (error) {
      console.error(error.message)
      console.error('failed to upload, aura: ', aura)
    }
  }

  console.log('convert errors')
  console.log(Array.from(new Set(convertErrors)))

  console.log(
    `uploaded ${converted.length}, not ready ${
      wagos.length - ready.length
    }, failed to convert ${ready.length - converted.length}`,
  )
  process.exit()
}

main().catch((error) => {
  console.error('error in main: ', error)
})
