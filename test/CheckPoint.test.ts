import { loadCheckPoint } from '../src/CheckPoint'

describe('loadCheckPoint', () => {
  it('can parse regular lock file', () => {
    const checkPoint = loadCheckPoint('test/fixtures/regular')
    expect(checkPoint?.fileRefs).toStrictEqual({
      'foo.svg': {
        name: 'foo',
        codePoint: 12345
      }
    })
  })

  it('can normalize redundant lock file', () => {
    const checkPoint = loadCheckPoint('test/fixtures/redundant')
    expect(checkPoint?.fileRefs).toStrictEqual({
      'foo.svg': {
        name: 'foo',
        codePoint: 12345
      }
    })
  })
})
