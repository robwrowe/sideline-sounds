import InOutPointLabel from "./InOutPointLabel";
import React, { CSSProperties } from "react";
import {
  ActionIcon,
  ActionIconGroupSectionProps,
  ActionIconProps,
  Button,
  DefaultMantineColor,
  InputWrapper,
  StyleProp,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
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
  IconProps,
  IconChevronLeftPipe,
  IconChevronRightPipe,
} from "@tabler/icons-react";
import styles from "./index.module.scss";

import classNames from "classnames";

export { InOutPointLabel };

export type InOutPointProps = {
  value: string | null;
  onClickSkip: (val: number) => void;

  label?: string;
  active?: boolean;

  onClickComponent?: () => void;
  onClickClear?: () => void;
  onClickLeftPipe?: () => void;
  onClickRightPipe?: () => void;

  className?: CSSModule["string"];
  style?: CSSProperties;

  actionIconProps?: ActionIconProps;
  iconProps?: IconProps;
  actionIconGroupSectionProps: ActionIconGroupSectionProps;

  leftPipeActionIconProps?: ActionIconProps;
  rightPipeActionIconProps?: ActionIconProps;

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
  onClickClear,
  onClickLeftPipe,
  onClickRightPipe,
  className,
  style,
  actionIconProps,
  iconProps,
  leftPipeActionIconProps,
  rightPipeActionIconProps,
  actionIconGroupSectionProps,
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
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const iconColor: string | undefined =
    colorScheme === "light"
      ? active
        ? theme.colors.highlight[5]
        : "gray"
      : active
        ? theme.colors.highlight[5]
        : theme.colors.dark[2];

  const c: StyleProp<DefaultMantineColor> | undefined =
    colorScheme === "light"
      ? active
        ? theme.colors.highlight[5]
        : "gray"
      : active
        ? theme.colors.highlight[5]
        : theme.colors.dark[2];

  const actionIconDefaultProps: ActionIconProps = {
    size: "lg",
    variant: "default",
  };

  return (
    <div className={classNames(styles.parent, className)} style={style}>
      <InputWrapper label={label} c={c}>
        <div className={styles.container}>
          {/* TODO: add ability to disable left/right pipe */}
          {onClickLeftPipe && (
            <Tooltip label="Set in point">
              <ActionIcon
                {...actionIconDefaultProps}
                {...actionIconProps}
                onClick={onClickLeftPipe}
                {...leftPipeActionIconProps}
              >
                <IconChevronLeftPipe color={iconColor} {...iconProps} />
              </ActionIcon>
            </Tooltip>
          )}
          <ActionIcon.Group>
            {!hideRewindBackward10 && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(-10)}
                {...actionIconProps}
              >
                <IconRewindBackward10 color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            {!hideRewindBackward5 && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(-5)}
                {...actionIconProps}
              >
                <IconRewindBackward5 color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            {!hideArrowBackUpDouble && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(-1)}
                {...actionIconProps}
              >
                <IconArrowBackUpDouble color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            {!hideArrowBackUp && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(-0.1)}
                {...actionIconProps}
              >
                <IconArrowBackUp color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            {!hideChevronLeft && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(-0.01)}
                {...actionIconProps}
              >
                <IconChevronLeft color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            <ActionIcon.GroupSection
              size={actionIconDefaultProps.size}
              variant={actionIconDefaultProps.variant}
              onClick={onClickComponent}
              c={c}
              style={{ cursor: onClickComponent && "pointer" }}
              bg="var(--mantine-color-body)"
              className={classNames(styles.value)}
              {...actionIconGroupSectionProps}
            >
              {value}
            </ActionIcon.GroupSection>
            {!hideChevronRight && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(0.01)}
                {...actionIconProps}
              >
                <IconChevronRight color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            {!hideArrowForwardUp && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(0.1)}
                {...actionIconProps}
              >
                <IconArrowForwardUp color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            {!hideArrowForwardUpDouble && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(1)}
                {...actionIconProps}
              >
                <IconArrowForwardUpDouble color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            {!hideRewindForward5 && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(5)}
                {...actionIconProps}
              >
                <IconRewindForward5 color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
            {!hideRewindForward10 && (
              <ActionIcon
                {...actionIconDefaultProps}
                onClick={() => onClickSkip(10)}
                {...actionIconProps}
              >
                <IconRewindForward10 color={iconColor} {...iconProps} />
              </ActionIcon>
            )}
          </ActionIcon.Group>
          {onClickRightPipe && (
            <Tooltip label="Set out point">
              <ActionIcon
                {...actionIconDefaultProps}
                {...actionIconProps}
                onClick={onClickRightPipe}
                {...rightPipeActionIconProps}
              >
                <IconChevronRightPipe color={iconColor} {...iconProps} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      </InputWrapper>
      {onClickClear && (
        <Button
          variant={actionIconDefaultProps["variant"]}
          size="compact-md"
          fullWidth
          disabled={value === null}
          onClick={onClickClear}
        >
          Clear Selection
        </Button>
      )}
    </div>
  );
}
