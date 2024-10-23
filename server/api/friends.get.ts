type ResponseItem = {
  id: number;
  firstName: string;
  secondName: string;
  avatar: string;
  level: number;
  power: number;
  profit: number;
};

export default defineEventHandler(async (event) => {
  const telegramId = getAuthFromCookie(event);
  const db = useDrizzle();

  const referer = (
    await db
      .select({ id: tables.users.id })
      .from(tables.users)
      .where(eq(tables.users.telegramId, telegramId))
  )[0];

  if (!referer) {
    throw createError({
      statusCode: 400,
      statusMessage: "User not found",
    });
  }

  const friends = await db
    .select({
      id: tables.users.id,
      avatar: tables.users.avatar,
      firstName: tables.users.firstName,
      secondName: tables.users.secondName,
      car: {
        engine: tables.userCar.engineLvl,
        chassis: tables.userCar.chassisLvl,
        brakes: tables.userCar.brakesLvl,
        visual: tables.userCar.visualLvl,
      },
    })
    .from(tables.users)
    .innerJoin(tables.userCar, eq(tables.userCar.userId, tables.users.id))
    .innerJoin(
      tables.userFriends,
      eq(tables.userFriends.friendId, tables.users.id)
    )
    .where(eq(tables.userFriends.userId, referer.id));

  if (!friends.length) return [];

  const formattedFriends: ResponseItem[] = [];

  for (const friend of friends) {
    const { profit } = (
      await db
        .select({
          profit: sum(tables.userFriendRewards.amount),
        })
        .from(tables.userFriendRewards)
        .where(
          and(
            eq(tables.userFriendRewards.friendId, friend.id),
            eq(tables.userFriendRewards.userId, referer.id)
          )
        )
    )[0];

    const { level, power } = getLevelAndPower(friend.car);
    const { id, firstName, secondName, avatar } = friend;

    formattedFriends.push({
      id,
      firstName,
      secondName,
      avatar,
      level,
      power,
      profit: Number(profit) || 0,
    });
  }

  return formattedFriends;
});
