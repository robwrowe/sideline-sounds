import React, { useState } from "react";
import { FloatingIndicator, UnstyledButton } from "@mantine/core";
import styles from "./index.module.scss";

export type AppFloatingIndicatorProps = {
  data: string[];
  active: number;
  setActive: (val: number) => void;
};

export default function AppFloatingIndicator({
  data,
  active,
  setActive,
}: AppFloatingIndicatorProps) {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const controls = data.map((item, index) => (
    <UnstyledButton
      key={item}
      className={styles.control}
      ref={setControlRef(index)}
      onClick={() => setActive(index)}
      mod={{ active: active === index }}
    >
      <span className={styles.controlLabel}>{item}</span>
    </UnstyledButton>
  ));

  return (
    <div className={styles.root} ref={setRootRef}>
      {controls}
      <FloatingIndicator
        target={controlsRefs[active]}
        parent={rootRef}
        className={styles.indicator}
      />
    </div>
  );
}
