import React from "react";
import classNames from "classnames";
import { IconProps, Icon } from "@tabler/icons-react";
import { Tooltip, UnstyledButton } from "@mantine/core";
import styles from "./PageButton.module.scss";

type PageButtonProps = {
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
  label: string;
  onClick: () => void;
  isActive?: true;
  className?: CSSModule["string"];
};

export default function PageButton({
  icon,
  label,
  onClick,
  isActive,
  className,
}: PageButtonProps) {
  const link = { icon };

  return (
    <Tooltip
      label={label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        onClick={onClick}
        className={classNames(styles.mainLink, className)}
        data-active={isActive}
      >
        <link.icon size={22} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}
