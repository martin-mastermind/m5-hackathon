import { Bot } from 'gramio'

type Query = {
  telegramId: number
  firstName: string
  lastName?: string
  isPremium: number
}

/* Todo: 
  - Add telegram validation
  - Add creation of car if user new
  - Add friends row if referer ID exists
  */
export default defineEventHandler(async (event) => {
  const { telegramId, firstName, lastName: secondName, isPremium } = getQuery<Query>(event)

  if (!telegramId || isNaN(telegramId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad telegramId',
    })
  }

  if (!firstName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad firstName',
    })
  }

  let user = (await useDrizzle().select().from(tables.users).where(eq(tables.users.telegramId, telegramId)))[0]

  if (!user) {
    const avatar = await _getAvatar(telegramId)

    user = await useDrizzle()
      .insert(tables.users)
      .values({
        telegramId,
        firstName,
        secondName,
        avatar,
        isPremium,
      })
      .returning()
      .get()
  }

  setCookie(event, AUTH_COOKIE, String(telegramId), {
    httpOnly: true,
    secure: true,
  })

  return {
    user,
  }
})

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
