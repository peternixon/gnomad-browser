import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Button } from '@gnomad/ui'

import getVisibleRegions from './getVisibleRegions'
import RegionViewer from './RegionViewer'
import ZoomRegionFormModal from './ZoomRegionFormModal'
import ZoomRegionOverview from './ZoomRegionOverview'

const ZoomControlsWrapper = styled.div`
  /* Subtract 10px to offset the bottom margin on RegionViewer in ZoomRegionOverview */
  padding: 1em 1em calc(1em - 10px) 1em;
  border: 1px solid #333;
  border-radius: 0.5em;
  margin-bottom: 1em;
  background: #f4f4f4;
`

const ZoomableRegionViewer = ({
  regions,
  renderOverview,
  zoomDisabled,
  zoomRegion,
  onChangeZoomRegion,
  ...otherProps
}) => {
  const visibleRegions = useMemo(() => getVisibleRegions(regions, zoomRegion), [
    regions,
    zoomRegion,
  ])

  const isZoomed =
    zoomRegion.start > regions[0].start || zoomRegion.stop < regions[regions.length - 1].stop

  const [isSelectRegionModalOpen, setIsSelectRegionModalOpen] = useState(false)

  return (
    <>
      {!zoomDisabled &&
        (isZoomed ? (
          <ZoomControlsWrapper>
            <div style={{ marginBottom: '0.25em' }}>
              Zoomed in on regions between positions {zoomRegion.start.toLocaleString()} and{' '}
              {zoomRegion.stop.toLocaleString()}.{' '}
              <Button
                onClick={() => {
                  setIsSelectRegionModalOpen(true)
                }}
              >
                Zoom in on different regions
              </Button>{' '}
              <Button
                onClick={() => {
                  onChangeZoomRegion({
                    start: regions[0].start,
                    stop: regions[regions.length - 1].stop,
                  })
                }}
              >
                View full region
              </Button>
            </div>

            <ZoomRegionOverview
              regions={regions}
              renderOverview={renderOverview}
              zoomRegion={zoomRegion}
              onChangeZoomRegion={onChangeZoomRegion}
            />
          </ZoomControlsWrapper>
        ) : (
          <>
            Viewing full region.{' '}
            <Button
              onClick={() => {
                setIsSelectRegionModalOpen(true)
              }}
            >
              Zoom in
            </Button>
          </>
        ))}

      <RegionViewer {...otherProps} regions={visibleRegions} />

      {isSelectRegionModalOpen && (
        <ZoomRegionFormModal
          defaultZoomRegion={zoomRegion}
          regionViewerRegions={regions}
          renderOverview={renderOverview}
          onRequestClose={() => {
            setIsSelectRegionModalOpen(false)
          }}
          onSubmitForm={onChangeZoomRegion}
        />
      )}
    </>
  )
}

ZoomableRegionViewer.propTypes = {
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.number.isRequired,
      stop: PropTypes.number.isRequired,
    })
  ).isRequired,
  renderOverview: PropTypes.func.isRequired,
  zoomDisabled: PropTypes.bool,
  zoomRegion: PropTypes.shape({
    start: PropTypes.number.isRequired,
    stop: PropTypes.number.isRequired,
  }).isRequired,
  onChangeZoomRegion: PropTypes.func,
}

ZoomableRegionViewer.defaultProps = {
  zoomDisabled: false,
  onChangeZoomRegion: () => {},
}

export default ZoomableRegionViewer
