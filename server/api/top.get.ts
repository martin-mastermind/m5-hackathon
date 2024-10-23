const TOP_LIMIT = 30

export default defineEventHandler(async (event) => {
  getAuthFromCookie(event)
  const db = useDrizzle()

  const users = await db
    .select({
      id: tables.users.id,
      avatar: tables.users.avatar,
      firstName: tables.users.firstName,
      secondName: tables.users.secondName,
      games: db.$count(
        tables.games,
        or(eq(tables.games.winnerId, tables.users.id), eq(tables.games.loserId, tables.users.id)),
      ),
      wins: db.$count(tables.games, eq(tables.games.winnerId, tables.users.id)),
    })
    .from(tables.users)
    .orderBy(sql`wins desc`)
    .limit(TOP_LIMIT)

  return users
})
