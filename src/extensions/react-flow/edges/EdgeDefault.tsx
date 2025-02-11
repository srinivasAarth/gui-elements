import React, { memo } from 'react';
import {
    EdgeProps as ReactFlowEdgeProps,
} from "react-flow-renderer/dist/types";
import {
    getMarkerEnd,
    getEdgeCenter,
    EdgeText,
} from "react-flow-renderer";
import { drawEdgeStraight} from "./utils";

export interface EdgeDefaultDataProps {
    pathGlowWidth?: number;
    inversePath?: boolean;
    markerStart?: string;
    renderLabel?: (edgeCenter: [number, number, number, number]) => React.ReactNode;
}

export interface EdgeDefaultProps extends ReactFlowEdgeProps {
    data?: EdgeDefaultDataProps,
    drawSvgPath?: (edge: ReactFlowEdgeProps) => string;
}

export const EdgeDefault = memo(
    (edge: EdgeDefaultProps) => {
        const {
            data = {},
            drawSvgPath = drawEdgeStraight,
            ...edgeOriginalProperties
        } = edge;
        const {
            pathGlowWidth = 10,
            markerStart
        } = data;

        const pathDisplay = drawSvgPath({...edgeOriginalProperties, data});
        const markerEnd = getMarkerEnd(
            edgeOriginalProperties.arrowHeadType,
            edgeOriginalProperties.markerEndId
        );
        const edgeCenter = getEdgeCenter({
            sourceX: edgeOriginalProperties.sourceX,
            sourceY: edgeOriginalProperties.sourceY,
            targetX: edgeOriginalProperties.targetX,
            targetY: edgeOriginalProperties.targetY,
        });

        const edgeLabel = data.renderLabel?.(edgeCenter) ?? (edgeOriginalProperties.label ? (
            <EdgeText
                x={edgeCenter[0]}
                y={edgeCenter[1]}
                label={edgeOriginalProperties.label}
                labelStyle={edgeOriginalProperties.labelStyle}
                labelShowBg={edgeOriginalProperties.labelShowBg}
                labelBgStyle={edgeOriginalProperties.labelBgStyle}
                labelBgPadding={edgeOriginalProperties.labelBgPadding || [5, 5]}
                labelBgBorderRadius={edgeOriginalProperties.labelBgBorderRadius || 3}
            />
        ) : null);

        const edgeStyle = edgeOriginalProperties.style ?? {};
        return (
            <g style={{...edgeStyle, color: edgeStyle.color || edgeStyle.stroke}}>
                { pathGlowWidth && (
                    <path
                        d={pathDisplay}
                        className="react-flow__edge-path-glow"
                        strokeWidth={pathGlowWidth}
                    />
                )}
                <path
                    d={pathDisplay}
                    className="react-flow__edge-path"
                    markerStart={markerStart}
                    markerEnd={markerEnd}
                />
                { edgeLabel }
            </g>
        );
    }
);
