const {defaults: tsjPreset} = require('ts-jest/presets')

module.exports = {
  ...tsjPreset,
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)', '**/?(*.)+(spec|test).ts?(x)'],
}
