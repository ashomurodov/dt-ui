export interface CountryDial {
  code: 'UZ' | 'RU' | 'KZ' | 'KG' | 'TJ'
  name: string
  dial: string
  flag: string
  /**
   * Mask using:
   *   0 → digit
   *   any other character → literal kept as-is
   * The dial code itself is not part of the mask.
   */
  mask: string
}

export const countries: CountryDial[] = [
  { code: 'UZ', name: "O'zbekiston",  dial: '+998', flag: '🇺🇿', mask: '(00) 000 00 00' },
  { code: 'RU', name: 'Россия',       dial: '+7',   flag: '🇷🇺', mask: '(000) 000 00 00' },
  { code: 'KZ', name: 'Қазақстан',     dial: '+7',   flag: '🇰🇿', mask: '(000) 000 00 00' },
  { code: 'KG', name: 'Кыргызстан',   dial: '+996', flag: '🇰🇬', mask: '(000) 000 000' },
  { code: 'TJ', name: 'Тоҷикистон',   dial: '+992', flag: '🇹🇯', mask: '(000) 00 00 00' },
]

/** Apply a numeric mask to a string of digits. Non-digits in the input are stripped. */
export function applyMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, '')
  let out = ''
  let di = 0
  for (let mi = 0; mi < mask.length && di < digits.length; mi++) {
    if (mask[mi] === '0') {
      out += digits[di++]
    } else {
      out += mask[mi]
    }
  }
  return out
}

/** Maximum number of digits a mask accepts (count of '0' placeholders). */
export function maskDigitCount(mask: string): number {
  let count = 0
  for (let i = 0; i < mask.length; i++) if (mask[i] === '0') count++
  return count
}
