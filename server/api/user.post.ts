import { Bot } from 'gramio'

type Body = {
  initData: string
  refererId?: number
}

export default defineEventHandler(async (event) => {
  const { initData, refererId } = await readBody<Body>(event)
  const {
    id: telegramId,
    first_name: firstName,
    last_name: secondName,
    is_premium: isPremium,
  } = getTelegramData(initData)

  const db = useDrizzle()

  let user = (
    await db
      .select({
        ..._userFields,
        car: _carFields,
      })
      .from(tables.users)
      .innerJoin(tables.userCar, eq(tables.userCar.userId, tables.users.id))
      .where(eq(tables.users.telegramId, telegramId))
  )[0]

  if (!user) {
    const avatar = await _getAvatar(telegramId)

    const newUser = await db
      .insert(tables.users)
      .values({
        telegramId,
        firstName,
        secondName: secondName || '',
        avatar,
        isPremium: isPremium ? 1 : 0,
      })
      .returning({
        id: tables.users.id,
        ..._userFields,
      })
      .get()

    const newUserCar = await db
      .insert(tables.userCar)
      .values({
        userId: newUser.id,
      })
      .returning(_carFields)
      .get()

    if (refererId) {
      await db.insert(tables.userFriends).values({
        userId: newUser.id,
        friendId: refererId,
      })
    }

    user = {
      avatar: newUser.avatar,
      firstName: newUser.firstName,
      secondName: newUser.secondName,
      isPremium: newUser.isPremium,
      gas: newUser.gas,
      car: {
        ...newUserCar,
      },
    }
  }

  addAuthCookie(event, telegramId)

  return {
    user,
  }
})

const _userFields = {
  avatar: tables.users.avatar,
  firstName: tables.users.firstName,
  secondName: tables.users.secondName,
  isPremium: tables.users.isPremium,
  gas: tables.users.gas,
}

const _carFields = {
  engineLvl: tables.userCar.engineLvl,
  chassisLvl: tables.userCar.chassisLvl,
  brakesLvl: tables.userCar.brakesLvl,
  visualLvl: tables.userCar.visualLvl,
}

const _getAvatar = async (telegramId: number) => {
  if (!process.env.TELEGRAM_TOKEN) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TELEGRAM_TOKEN is not defined',
    })
  }

  const bot = new Bot(process.env.TELEGRAM_TOKEN)

  const photos = await bot.api.getUserProfilePhotos({
    user_id: telegramId,
    limit: 1,
  })

  const avatar = await bot.api.getFile({ file_id: photos.photos[0][0].file_id })

  return `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${avatar.file_path}`
}
