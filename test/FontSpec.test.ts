import { loadFontSpec } from '../src/FontSpec'

describe('loadFontSpec', () => {
  it('can parse yaml file', () => {
    const spec = loadFontSpec('test/fixtures/regular')
    expect(spec.name).toStrictEqual('myicons')
  })
})
