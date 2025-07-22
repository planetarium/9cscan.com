import { normalizeAddress, formatAddress } from './address'

describe('normalizeAddress', () => {
  test('should add 0x prefix if missing', () => {
    expect(normalizeAddress('1234567890abcdef1234567890abcdef12345678')).toBe('0x1234567890abcdef1234567890abcdef12345678')
  })

  test('should convert to lowercase', () => {
    expect(normalizeAddress('0x1234567890ABCDEF1234567890ABCDEF12345678')).toBe('0x1234567890abcdef1234567890abcdef12345678')
  })

  test('should handle already normalized address', () => {
    expect(normalizeAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234567890abcdef1234567890abcdef12345678')
  })

  test('should handle null and undefined', () => {
    expect(normalizeAddress(null)).toBe(null)
    expect(normalizeAddress(undefined)).toBe(undefined)
  })

  test('should handle empty string', () => {
    expect(normalizeAddress('')).toBe('0x')
  })
})

describe('formatAddress', () => {
  test('should format long address with ellipsis', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    expect(formatAddress(address)).toBe('0x123456...5678')
  })

  test('should return full address if short enough', () => {
    const address = '0x1234567890'
    expect(formatAddress(address)).toBe('0x1234567890')
  })

  test('should normalize address before formatting', () => {
    const address = '1234567890ABCDEF1234567890ABCDEF12345678'
    expect(formatAddress(address)).toBe('0x123456...5678')
  })

  test('should handle custom start and end lengths', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    expect(formatAddress(address, 4, 6)).toBe('0x1234...345678')
  })

  test('should handle null and undefined', () => {
    expect(formatAddress(null)).toBe(null)
    expect(formatAddress(undefined)).toBe(undefined)
  })
}) 