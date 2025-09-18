import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function generateDeviceToken(): string {
  return `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "")
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  return value
}

export function cleanPhone(value: string): string {
  return value.replace(/\D/g, "")
}

export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "")

  if (numbers.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numbers)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(numbers.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(numbers.charAt(10))) return false

  return true
}
