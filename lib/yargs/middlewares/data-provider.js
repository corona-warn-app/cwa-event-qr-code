'use strict'

module.exports = ({ sources }) => {
  const middleware = async argv => {
    const allMiddlewaresApplied = sources
      .map(middleware => middleware(argv))
    await Promise.all(allMiddlewaresApplied)

    const effectiveSource = sources
      .find(sources => sources.hasData(argv))
    if (effectiveSource) {
      argv.__data = effectiveSource.getData(argv)
    }
  }

  middleware.builder = yargs => {
    sources
      .forEach(source => source.builder(yargs))
  }

  middleware.getData = argv => {
    return argv.__data
  }

  return middleware
}
