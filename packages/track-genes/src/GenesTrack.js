import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { formatGenes, createTracks } from './index'

const GenesTrack = ({
  genes,
  xScale,
  leftPanelWidth,
  width,
}) => {
  console.log(genes)
  const GENE_TRACK_HEIGHT = 50
  const GENE_TRACK_PADDING = 3

  const GeneTrackWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  `

  const GeneTrackLeft = styled.div`
    height: 100%;
    width: ${leftPanelWidth}px;
  `

  const GeneTrackData = styled.div`
    height: 100%;
  `

  const GeneTrackTitle = styled.div`
    height: ${GENE_TRACK_HEIGHT + 3}px;
  `
  const GeneTrackTitleText = styled.div`
    margin: 0 0 0 0;
    padding: 0 0 0 0;
  `

  const tracksToMap = createTracks(formatGenes(genes), xScale).toJS()

  return (
    <GeneTrackWrapper>
      <GeneTrackLeft>
        <GeneTrackTitle>
          <GeneTrackTitleText>Genes</GeneTrackTitleText>
        </GeneTrackTitle>
      </GeneTrackLeft>
      <GeneTrackData>
        <svg height={GENE_TRACK_HEIGHT * tracksToMap.length} width={width}>
          {/* <rect
            x={0}
            y={0}
            width={width}
            height={GENE_TRACK_HEIGHT * tracksToMap.length}
            fill={'yellow'}
            stroke={'black'}
            strokeWidth={1}
          /> */}
          {tracksToMap.map((track, trackNumber) => {
            return track.map((gene) => {
              const textYPosition = (GENE_TRACK_HEIGHT * 0.66) + (GENE_TRACK_HEIGHT * trackNumber)
              const exonsYPosition = (GENE_TRACK_HEIGHT * 0.16) + (GENE_TRACK_HEIGHT * trackNumber)
              const geneStart = xScale(gene.start)
              const geneStop = xScale(gene.stop)
              return (
                <g>
                  <text
                    x={(geneStop + geneStart) / 2}
                    y={textYPosition}
                  >
                    {gene.name}
                  </text>
                  <line
                    x1={geneStart}
                    x2={geneStop}
                    y1={exonsYPosition}
                    y2={exonsYPosition}
                    stroke={'black'}
                    strokeWidth={1}
                  />
                  {gene.exonIntervals.map((exon) => {
                    const exonStart = xScale(exon.start)
                    const exonStop = xScale(exon.stop)
                    return (
                      <rect
                        x={exonStart}
                        y={0 + (GENE_TRACK_HEIGHT * trackNumber)}
                        width={exonStop - exonStart}
                        height={GENE_TRACK_HEIGHT * 0.33}
                        fill={'black'}
                        stroke={'black'}
                        key={`${exon.start}-${gene.name}`}
                      />
                    )
                  })}
                </g>
              )
            })
          })}
        </svg>
      </GeneTrackData>
    </GeneTrackWrapper>
  )
}

GenesTrack.propTypes = {
  genes: PropTypes.array.isRequired,
}

export default GenesTrack
