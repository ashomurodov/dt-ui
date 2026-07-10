import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import DtButton from '../src/registry/components/button/DtButton.vue'
import DtInput from '../src/registry/components/input/DtInput.vue'

/**
 * Fallthrough attributes must land on the element they describe.
 *
 * A component whose ROOT differs from the node it binds `$attrs` to needs
 * `inheritAttrs: false`, or Vue applies every attribute to the root as well.
 * `DtInput` (root: wrapper `<div>`, target: inner `<input>`) shipped without it
 * up to v0.1.91 and rendered:
 *
 *     <div class="dt-input-wrapper" min="0" aria-label="Coins"> …
 *
 * `min` on a `<div>` is invalid, and the duplicated `aria-label` gives the
 * wrapper an accessible name it should not have.
 */
describe('DtInput', () => {
  it('renders the wrapper as its root', () => {
    expect(mount(DtInput).element.tagName).toBe('DIV')
  })

  it('sends field attributes to the <input>, not the wrapper', () => {
    const w = mount(DtInput, {
      props: { type: 'number' },
      attrs: { min: '0', step: '5', 'aria-label': 'Coins' },
    })
    const root = w.element as HTMLElement
    const field = w.get('input').element

    expect(field.getAttribute('min')).toBe('0')
    expect(field.getAttribute('step')).toBe('5')
    expect(field.getAttribute('aria-label')).toBe('Coins')

    expect(root.getAttribute('min')).toBeNull()
    expect(root.getAttribute('step')).toBeNull()
    expect(root.getAttribute('aria-label')).toBeNull()
  })

  // `class`/`style` are the exception: a caller sizes and positions the wrapper.
  it('keeps class and style on the wrapper', () => {
    const w = mount(DtInput, { attrs: { class: 'my-field', style: 'width: 120px' } })
    const root = w.element as HTMLElement

    expect(root.classList.contains('my-field')).toBe(true)
    expect(root.getAttribute('style')).toContain('120px')
    expect(w.get('input').classes()).not.toContain('my-field')
  })

  it('still emits update:modelValue, and coerces number inputs', async () => {
    const w = mount(DtInput, { props: { type: 'number', modelValue: '' } })
    await w.get('input').setValue('42')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([42])
  })
})

describe('DtButton', () => {
  it('forwards attributes to its single <button> root', () => {
    const w = mount(DtButton, { attrs: { type: 'submit', 'data-x': '1' } })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.attributes('type')).toBe('submit')
    expect(w.findAll('button')).toHaveLength(1)
  })

  it('is disabled while loading', () => {
    const w = mount(DtButton, { props: { loading: true } })
    expect(w.attributes('disabled')).toBeDefined()
  })

  /** Square icon buttons — same convention as DtDropdownMenuTrigger's `iconOnly`. */
  it('iconOnly adds the square modifier', () => {
    const w = mount(DtButton, { props: { iconOnly: true, size: 'xs' } })
    expect(w.classes()).toContain('dt-button--icon')
    expect(w.classes()).toContain('dt-button--size-xs')
  })

  it('is not icon-only by default', () => {
    expect(mount(DtButton).classes()).not.toContain('dt-button--icon')
  })
})

/**
 * `DtDialogContent`, `DtSelectContent` and the dropdown contents root at a
 * reka-ui `*Portal`, which renders a Vue `<Teleport>` — a fragment. Vue cannot
 * auto-inherit attrs onto a fragment root: it drops them and warns. This pins the
 * behaviour those components rely on, without dragging reka-ui into the test.
 */
describe('fragment roots cannot inherit attrs (why the *Content components opt out)', () => {
  it('warns when a fragment-rooted component receives fallthrough attrs', async () => {
    const { defineComponent, h, Teleport } = await import('vue')

    const PortalLike = defineComponent({
      setup: (_, { slots }) => () => h(Teleport, { to: 'body' }, slots.default?.()),
    })
    const ContentLike = defineComponent({
      setup: (_, { slots }) => () =>
        h(PortalLike, null, () => [h('div', { class: 'inner' }, slots.default?.())]),
    })

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(ContentLike, { attrs: { class: 'from-caller' } })
    const output = warn.mock.calls.map((c) => String(c[0])).join('\n')
    warn.mockRestore()

    expect(output).toMatch(/Extraneous non-props attributes/)
  })
})
