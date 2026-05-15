export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'uzcard'
  | 'humo'
  | 'unknown'

/**
 * Detect a card brand from the leading digits of a card number.
 *
 *   - Visa:        starts with 4
 *   - Mastercard:  51–55 or 2221–2720 (modern IIN range)
 *   - Amex:        34 or 37
 *   - UzCard:      8600 / 5614 / 6262 (Uzbekistan, primary national)
 *   - Humo:        9860 (Uzbekistan)
 *
 * Pass the raw card number (with or without spaces); only digits are inspected.
 * Returns `'unknown'` until enough digits have been entered to disambiguate.
 */
export function detectCardBrand(value: string): CardBrand {
  const d = value.replace(/\D/g, '')
  if (d.length < 1) return 'unknown'

  if (d[0] === '4') return 'visa'
  if (d[0] === '3' && (d[1] === '4' || d[1] === '7')) return 'amex'

  // UzCard / Humo need 4-digit prefix.
  if (d.length >= 4) {
    const p4 = d.slice(0, 4)
    if (p4 === '8600' || p4 === '5614' || p4 === '6262') return 'uzcard'
    if (p4 === '9860') return 'humo'
  }

  if (d.length >= 2) {
    const p2 = parseInt(d.slice(0, 2), 10)
    if (p2 >= 51 && p2 <= 55) return 'mastercard'
  }
  if (d.length >= 4) {
    const p4 = parseInt(d.slice(0, 4), 10)
    if (p4 >= 2221 && p4 <= 2720) return 'mastercard'
  }

  return 'unknown'
}

/** Group digits into blocks of 4 (Amex prefers 4-6-5 but we keep 4-4-4-4 for visual consistency). */
export function formatCardNumber(value: string, max = 16): string {
  const digits = value.replace(/\D/g, '').slice(0, max)
  const groups: string[] = []
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4))
  }
  return groups.join(' ')
}
