import { Icon, IconProps } from "@tabler/icons-react";

export type ContextMenuButton = {
  type?: never | "button";

  /**
   * The color to use instead of the default
   */
  color?: string;

  /**
   * Text to render in the button
   */
  label: string;

  /**
   * onClick handler for button
   */
  onClick: () => void;

  /**
   * The <Icon /> to render in the left section of the button
   */
  Icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;

  /**
   * If no icon is provided, fill it with an <Box /> element.
   * Useful to keep everything aligned.
   *
   * Default is `true`.
   */
  hasIconPlaceholder?: boolean;
};

export type ContextMenuDivider = {
  type: "divider";
  color?: string;
};

export type ContextMenuLabel = {
  type: "label";
  color?: string;
  label: string;
};

export type ContextMenuItem =
  | ContextMenuButton
  | ContextMenuDivider
  | ContextMenuLabel;
