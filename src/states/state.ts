import { endpoints } from '$src/api/endpoints'

export const settings = endpoints.getSettings().use(undefined, !!localStorage.getItem('token'))
