import React from 'react'
import { getBezierPath } from 'reactflow'

type ConnectionProps = {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
}

export function Connection({ sourceX, sourceY, targetX, targetY }: ConnectionProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  return (
    <g>
      <path
        fill="none"
        stroke="#555"
        strokeWidth={2}
        className="animated"
        d={edgePath}
      />
    </g>
  )
}

