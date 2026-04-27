import { endpoints } from '$src/api/endpoints'
// this thing get loaded at the start
export const settings = endpoints.getSettings().use(undefined, !!localStorage.getItem('token'))
