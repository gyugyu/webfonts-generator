import path from 'path'
import index from '../src/index'

describe('index', () => {
  it('can run without error', async () => {
    await index(path.join(__dirname, 'fixtures/index/assets'))
  });
})
