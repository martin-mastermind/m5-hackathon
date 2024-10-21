import { createHmac } from 'crypto'

export type TelegramInitData = {
  query_id: string
  user: {
    id: number
    first_name: string
    is_premium: boolean
    last_name?: string
  }
  auth_date: number
  hash: string
}

export const getTelegramData = (initData: string) => {
  if (!_isValidTelegramData(initData)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad telegram data',
    })
  }

  const data: TelegramInitData = initData.split('&').reduce(
    (acc, item) => {
      const [key, value] = item.split('=')
      acc[key] = key === 'user' ? JSON.parse(decodeURIComponent(value)) : value

      return acc
    },
    {} as Record<string, unknown>,
  ) as TelegramInitData

  return data.user
}

const _isValidTelegramData = (dirtyInitData: string) => {
  if (!process.env.TELEGRAM_TOKEN) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TELEGRAM_TOKEN is not defined',
    })
  }

  const initData = new URLSearchParams(dirtyInitData)

  const hash = initData.get('hash')
  initData.delete('hash')

  initData.sort()

  const dataToCheck = [...initData.entries()].map(([key, value]) => key + '=' + value).join('\n')

  const secretKey = createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_TOKEN).digest()
  const parsedHash = createHmac('sha256', secretKey).update(dataToCheck).digest('hex')

  return hash === parsedHash
}
