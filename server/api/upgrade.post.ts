type Body = {
  part: 'engine' | 'chassis' | 'brakes' | 'visual'
}

const TEST_COST = 1000

/* Todo:
  - If level is at ranges, add gas to referer
*/
export default defineEventHandler(async (event) => {
  const telegramId = getAuthFromCookie(event)
  const db = useDrizzle()

  const { part } = await readBody<Body>(event)
  const dbPart = `${part}Lvl` as const

  const {
    id,
    gas,
    [dbPart]: partLvl,
  } = (
    await db
      .select({
        id: tables.users.id,
        gas: tables.users.gas,
        [dbPart]: tables.userCar[dbPart],
      })
      .from(tables.users)
      .innerJoin(tables.userCar, eq(tables.userCar.userId, tables.users.id))
      .where(eq(tables.users.telegramId, telegramId))
  )[0]

  // TODO: calculate cost
  if (gas < TEST_COST) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Not enough gas',
    })
  }

  const newPartLvl = partLvl + 1

  await db
    .update(tables.userCar)
    .set({ [dbPart]: newPartLvl })
    .where(eq(tables.userCar.userId, id))

  await db
    .update(tables.users)
    .set({ gas: gas - TEST_COST })
    .where(eq(tables.users.id, id))

  return {
    gas,
    level: newPartLvl,
  }
})
