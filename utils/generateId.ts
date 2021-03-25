const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const generateId = () => {
  let str = ''
  for (let i = 0; i < 7; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
}
