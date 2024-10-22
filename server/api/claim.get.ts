export default defineEventHandler(async (event) => {
  const telegramId = getAuthFromCookie(event);
  const db = useDrizzle();

  const { id, gas, claim, car } = (
    await db
      .select({
        id: tables.users.id,
        gas: tables.users.gas,
        claim: {
          number: count(tables.userClaims.id),
          at: tables.userClaims.claimedAt,
        },
        car: tables.userCar,
      })
      .from(tables.users)
      .innerJoin(
        tables.userClaims,
        eq(tables.userClaims.userId, tables.users.id)
      )
      .innerJoin(tables.userCar, eq(tables.userCar.userId, tables.users.id))
      .where(eq(tables.users.telegramId, telegramId))
      .orderBy(desc(tables.userClaims.claimedAt))
      .limit(1)
  )[0];

  if (!_isMoreThanHour(claim.at)) {
    throw createError({
      statusCode: 400,
      statusMessage: "You can only claim once per hour",
    });
  }

  const reward = getClaimAmount({ claimNumber: claim.number, ...car });
  const newGas = gas + reward;

  await Promise.allSettled([
    db.update(tables.users).set({ gas: newGas }).where(eq(tables.users.id, id)),
    db.insert(tables.userClaims).values({ userId: id, amount: reward }),
  ]);

  return {
    gas: newGas,
  };
});

const _isMoreThanHour = (date: Date) => {
  return date.getTime() > new Date().getTime() - 1000 * 60 * 60;
};
