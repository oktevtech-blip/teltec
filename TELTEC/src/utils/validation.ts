export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export const validateRequired = (value: any): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

export const validateNumber = (value: any): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value))
}

export const validatePositiveNumber = (value: any): boolean => {
  return validateNumber(value) && Number(value) > 0
}

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

export const validateFutureDate = (date: string): boolean => {
  if (!validateDate(date)) return false
  return new Date(date) > new Date()
}
