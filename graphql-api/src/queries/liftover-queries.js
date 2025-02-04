const { isVariantId } = require('@gnomad/identifiers')

const LIFTOVER_INDEX = 'liftover'

const fetchLiftoverVariantsBySource = async (esClient, variantId, referenceGenome) => {
  const response = await esClient.search({
    index: LIFTOVER_INDEX,
    type: '_doc',
    body: {
      query: {
        bool: {
          filter: [
            { term: { 'source.variant_id': variantId } },
            { term: { 'source.reference_genome': referenceGenome } },
          ],
        },
      },
    },
    size: 100,
  })

  return response.body.hits.hits
    .map((hit) => hit._source)
    .filter((doc) => isVariantId(doc.liftover.variant_id))
}

const fetchLiftoverVariantsByTarget = async (esClient, variantId, referenceGenome) => {
  const response = await esClient.search({
    index: LIFTOVER_INDEX,
    type: '_doc',
    body: {
      query: {
        bool: {
          filter: [
            { term: { 'liftover.variant_id': variantId } },
            { term: { 'liftover.reference_genome': referenceGenome } },
          ],
        },
      },
    },
    size: 100,
  })

  return response.body.hits.hits
    .map((hit) => hit._source)
    .filter((doc) => isVariantId(doc.liftover.variant_id))
}

module.exports = {
  fetchLiftoverVariantsBySource,
  fetchLiftoverVariantsByTarget,
}
