import React from "react";
import styled from "styled-components";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { Canvas } from "reaflow";

import { getEdgeNodes } from "./helpers";
import { CustomNode } from "./CustomNode";
import { useLoading } from "src/hooks/useLoading";
import { useConfig } from "src/hocs/config";

const StyledLiveEditor = styled.div`
  position: relative;
  border-left: 3px solid ${({ theme }) => theme.SILVER_DARK};
`;

const StyledEditorWrapper = styled.div`
  position: absolute;
`;

const StyledControls = styled.div`
  position: fixed;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  bottom: 8px;
  right: 8px;
  opacity: 0.9;

  button:hover {
    opacity: 0.7;
  }
`;

const wheelOptions = {
  step: 0.4,
};

export const LiveEditor: React.FC = React.memo(() => {
  const {
    states: { json, settings },
  } = useConfig();
  const pageLoaded = useLoading();
  const wrapperRef = React.useRef<ReactZoomPanPinchRef | null>(null);
  const [data, setData] = React.useState({
    nodes: [],
    edges: [],
  });

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, settings.expand);

    setData({ nodes, edges });
  }, [json, settings.expand]);

  React.useEffect(() => {
    wrapperRef.current?.setTransform(
      wrapperRef.current.state.positionX,
      wrapperRef.current.state.positionY,
      settings.zoomScale
    );
  }, [settings.zoomScale]);

  React.useEffect(() => {
    wrapperRef.current?.resetTransform();
  }, [settings.transform]);

  React.useEffect(() => {
    const wrapperRect = wrapperRef.current?.instance.wrapperComponent;

    const node = document.querySelector(
      `span[data-key*='${settings.searchNode}' i]`
    );

    document
      .querySelector("foreignObject.searched")
      ?.classList.remove("searched");

    if (wrapperRect && node && node.parentElement) {
      const newScale = 1;
      const x = Number(node.getAttribute("data-x"));
      const y = Number(node.getAttribute("data-y"));

      const newPositionX =
        (wrapperRect.offsetLeft - x) * newScale +
        node.getBoundingClientRect().width;
      const newPositionY =
        (wrapperRect.offsetTop - y) * newScale +
        node.getBoundingClientRect().height;

      node.parentElement.parentElement
        ?.closest("foreignObject")
        ?.classList.toggle("searched");

      wrapperRef.current?.setTransform(newPositionX, newPositionY, newScale);
    }
  }, [settings.searchNode]);

  if (pageLoaded)
    return (
      <StyledLiveEditor>
        <StyledEditorWrapper>
          <TransformWrapper
            maxScale={1.8}
            minScale={0.4}
            initialScale={0.8}
            ref={wrapperRef}
            limitToBounds={false}
            wheel={wheelOptions}
          >
            <TransformComponent>
              <Canvas
                nodes={data.nodes}
                node={CustomNode}
                edges={data.edges}
                maxWidth={20000}
                maxHeight={20000}
                center={false}
                zoomable={false}
                fit={true}
                direction={settings.layout}
                readonly
                key={settings.layout}
              />
            </TransformComponent>
          </TransformWrapper>
        </StyledEditorWrapper>
      </StyledLiveEditor>
    );

  return null;
});
