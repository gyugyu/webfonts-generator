import child_process from 'child_process'

describe('command', () => {
  it('can run with version option', () => {
    const { status } = child_process.spawnSync(
      './node_modules/.bin/ts-node',
      ['src/command.ts', '--version']
    )
    expect(status).toEqual(0)
  })
})
