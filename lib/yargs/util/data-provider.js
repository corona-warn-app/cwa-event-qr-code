'use strict'

module.exports = ({ sources }) => {
  const builder = yargs => sources.forEach(source => source.builder(yargs))

  const getData = async argv => {
    const sourcesHaveData = await Promise.all(sources
      .map(async sources => sources.hasData(argv)))
    const effectiveSourceIdx = sourcesHaveData.findIndex(it => !!it)

    if (effectiveSourceIdx < 0) throw new Error('No data provided')
    const effectiveSource = sources[effectiveSourceIdx]
    return effectiveSource.getData(argv)
  }

  return {
    getData,
    builder
  }
}
