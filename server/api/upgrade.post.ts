type Body = {
  part: 'engine' | 'chassis' | 'brakes' | 'visual'
}

/* Todo:
  - Check if user has enough gas to upgrade
  - Increase level and decrease gas
  - If level is at ranges, add gas to referer
  - Return updated user info
*/
export default defineEventHandler(async (event) => {
  const telegramId = getAuthFromCookie(event)
  const db = useDrizzle()

  const { part } = await readBody<Body>(event)
  // const dbPart = `${part}Lvl` as const

  // await db
  //   .update(tables.userCar)
  //   .set({ [dbPart]: sql`${tables.userCar[dbPart]} + 1` })
  //   .where(eq(tables.userCar.userId, telegramId))
})
