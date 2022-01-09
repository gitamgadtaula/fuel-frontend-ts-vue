export default function authHeader(): any {
  const token = localStorage.getItem('fuelToken')

  if (token) {
    return { Authorization: 'Bearer ' + token }
  } else {
    return {}
  }
}
