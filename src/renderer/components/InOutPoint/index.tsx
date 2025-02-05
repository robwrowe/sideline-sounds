import React from "react";
import {
  ActionIcon,
  ActionIconProps,
  DefaultMantineColor,
  InputWrapper,
  StyleProp,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconRewindBackward5,
  IconRewindBackward10,
  IconRewindForward5,
  IconRewindForward10,
  IconArrowBackUp,
  IconArrowBackUpDouble,
  IconArrowForwardUp,
  IconArrowForwardUpDouble,
} from "@tabler/icons-react";
import styles from "./index.module.scss";

export type InOutPointProps = {
  value: string | null;
  onClickSkip: (val: number) => void;
  label?: string;
  onClickComponent?: () => void;
  active?: boolean;
  hideRewindBackward10?: boolean;
  hideRewindBackward5?: boolean;
  hideArrowBackUpDouble?: boolean;
  hideArrowBackUp?: boolean;
  hideChevronLeft?: boolean;
  hideChevronRight?: boolean;
  hideArrowForwardUp?: boolean;
  hideArrowForwardUpDouble?: boolean;
  hideRewindForward5?: boolean;
  hideRewindForward10?: boolean;
};
//
export default function InOutPoint({
  label,
  value,
  active,
  onClickComponent,
  onClickSkip,
  hideRewindBackward10 = false,
  hideRewindBackward5 = false,
  hideArrowBackUpDouble = false,
  hideArrowBackUp = false,
  hideChevronLeft = false,
  hideChevronRight = false,
  hideArrowForwardUp = false,
  hideArrowForwardUpDouble = false,
  hideRewindForward5 = false,
  hideRewindForward10 = false,
}: InOutPointProps) {
  const actionIconProps: ActionIconProps = {
    size: "lg",
    variant: "default",
  };

  const c: StyleProp<DefaultMantineColor> | undefined = active
    ? "red"
    : undefined;

  return (
    <InputWrapper label={label} c={c}>
      <ActionIcon.Group>
        {!hideRewindBackward10 && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(-10)}>
            <IconRewindBackward10 />
          </ActionIcon>
        )}
        {!hideRewindBackward5 && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(-5)}>
            <IconRewindBackward5 />
          </ActionIcon>
        )}
        {!hideArrowBackUpDouble && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(-1)}>
            <IconArrowBackUpDouble />
          </ActionIcon>
        )}
        {!hideArrowBackUp && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(-0.1)}>
            <IconArrowBackUp />
          </ActionIcon>
        )}
        {!hideChevronLeft && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(-0.01)}>
            <IconChevronLeft />
          </ActionIcon>
        )}
        <ActionIcon.GroupSection
          size={actionIconProps.size}
          variant={actionIconProps.variant}
          onClick={onClickComponent}
          c={c}
          miw={96}
          style={{ cursor: onClickComponent && "pointer" }}
          bg="var(--mantine-color-body)"
          className={styles.value}
        >
          {value}
        </ActionIcon.GroupSection>
        {!hideChevronRight && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(0.01)}>
            <IconChevronRight />
          </ActionIcon>
        )}
        {!hideArrowForwardUp && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(0.1)}>
            <IconArrowForwardUp />
          </ActionIcon>
        )}
        {!hideArrowForwardUpDouble && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(1)}>
            <IconArrowForwardUpDouble />
          </ActionIcon>
        )}
        {!hideRewindForward5 && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(5)}>
            <IconRewindForward5 />
          </ActionIcon>
        )}
        {!hideRewindForward10 && (
          <ActionIcon {...actionIconProps} onClick={() => onClickSkip(10)}>
            <IconRewindForward10 />
          </ActionIcon>
        )}
      </ActionIcon.Group>
    </InputWrapper>
  );
}
