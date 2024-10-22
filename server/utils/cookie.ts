import type { H3Event } from 'h3'

const AUTH_COOKIE = '_tid'

export const addAuthCookie = (event: H3Event, telegramId: number) => {
  setCookie(event, AUTH_COOKIE, String(telegramId), {
    httpOnly: true,
    secure: true,
  })
}

export const getAuthFromCookie = (event: H3Event) => {
  const value = getCookie(event, AUTH_COOKIE)

  if (!value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return Number(value)
}
