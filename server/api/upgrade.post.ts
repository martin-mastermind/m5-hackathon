type Body = {
  part: PartsNames;
};

export default defineEventHandler(async (event) => {
  const telegramId = getAuthFromCookie(event);
  const db = useDrizzle();

  const { part } = await readBody<Body>(event);
  const dbPart = `${part}Lvl` as const;

  // Get user data
  const {
    id,
    gas,
    [dbPart]: partLvl,
    totalLvl,
  } = (
    await db
      .select({
        id: tables.users.id,
        gas: tables.users.gas,
        [dbPart]: tables.userCar[dbPart],
        totalLvl: _getTotalLvl(),
      })
      .from(tables.users)
      .innerJoin(tables.userCar, eq(tables.userCar.userId, tables.users.id))
      .where(eq(tables.users.telegramId, telegramId))
  )[0];
  const newPartLvl = partLvl + 1;

  // Check if user has enough gas
  const cost = getPartCost(part, newPartLvl);
  if (gas < cost) {
    throw createError({
      statusCode: 400,
      statusMessage: "Not enough gas",
    });
  }

  // Update user data
  await Promise.allSettled([
    db
      .update(tables.userCar)
      .set({ [dbPart]: newPartLvl })
      .where(eq(tables.userCar.userId, id)),
    db
      .update(tables.users)
      .set({ gas: gas - cost })
      .where(eq(tables.users.id, id)),
  ]);

  // Try to set referer reward
  const refererReward = REFERER_REWARDS[(totalLvl + 1) as RefererRewardsKey];
  if (refererReward) {
    const referer = (
      await db
        .select({ userId: tables.userFriends.userId })
        .from(tables.userFriends)
        .limit(1)
    )[0];

    if (referer) {
      await Promise.allSettled([
        db
          .update(tables.users)
          .set({ gas: _getGasReward(refererReward) })
          .where(and(eq(tables.users.id, referer.userId))),

        db.insert(tables.userFriendRewards).values({
          userId: referer.userId,
          friendId: id,
          amount: refererReward,
        }),
      ]);
    }
  }

  return {
    gas,
    level: newPartLvl,
  };
});

const _getTotalLvl = () => {
  return sql<number>`(${tables.userCar.engineLvl} + ${tables.userCar.chassisLvl} + ${tables.userCar.brakesLvl} + ${tables.userCar.visualLvl})`;
};

const _getGasReward = (reward: number) => {
  return sql<number>`(${tables.users.gas} + ${reward})`;
};
