export function normalizeAddress(address) {
  if (address === null || address === undefined) return address
  
  let normalized = address.toString()
  
  if (normalized === '') return ''
  
  if (!normalized.startsWith('0x')) {
    normalized = '0x' + normalized
  }
  
  return normalized.toLowerCase()
}

export function formatAddress(address, startLength = 6, endLength = 4) {
  if (!address) return address
  
  const normalized = normalizeAddress(address)
  
  if (normalized.length <= startLength + endLength + 2) {
    return normalized
  }
  
  return `${normalized.slice(0, startLength + 2)}...${normalized.slice(-endLength)}`
} 