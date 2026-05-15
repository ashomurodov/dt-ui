export interface CountryDial {
  code: 'UZ' | 'RU' | 'KZ' | 'KG' | 'TJ'
  name: string
  dial: string
  /** Inline SVG markup for the flag. Rendered via v-html so it inherits from CSS. */
  flag: string
  /**
   * Mask using:
   *   0 → digit
   *   any other character → literal kept as-is
   * The dial code itself is not part of the mask.
   */
  mask: string
}

// Simple 24×16 flags rendered inline so they look the same on every OS
// (Windows doesn't render regional-indicator emoji as flags).
const flagUZ = `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="5" fill="#0099b5"/><rect y="5" width="24" height="6" fill="#fff"/><rect y="11" width="24" height="5" fill="#1eb53a"/><rect y="5" width="24" height="0.5" fill="#ce1126"/><rect y="10.5" width="24" height="0.5" fill="#ce1126"/></svg>`
const flagRU = `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="5.33" fill="#fff"/><rect y="5.33" width="24" height="5.33" fill="#0039a6"/><rect y="10.66" width="24" height="5.34" fill="#d52b1e"/></svg>`
const flagKZ = `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="16" fill="#00afca"/><circle cx="12" cy="8" r="3" fill="#ffec1f"/></svg>`
const flagKG = `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="16" fill="#e8112d"/><circle cx="12" cy="8" r="3" fill="#ffef00"/></svg>`
const flagTJ = `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="3.7" fill="#cc0000"/><rect y="3.7" width="24" height="8.6" fill="#fff"/><rect y="12.3" width="24" height="3.7" fill="#006600"/></svg>`

export const countries: CountryDial[] = [
  { code: 'UZ', name: "O'zbekiston", dial: '+998', flag: flagUZ, mask: '(00) 000 00 00' },
  { code: 'RU', name: 'Россия',      dial: '+7',   flag: flagRU, mask: '(000) 000 00 00' },
  { code: 'KZ', name: 'Қазақстан',    dial: '+7',   flag: flagKZ, mask: '(000) 000 00 00' },
  { code: 'KG', name: 'Кыргызстан',  dial: '+996', flag: flagKG, mask: '(000) 000 000' },
  { code: 'TJ', name: 'Тоҷикистон',  dial: '+992', flag: flagTJ, mask: '(000) 00 00 00' },
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
