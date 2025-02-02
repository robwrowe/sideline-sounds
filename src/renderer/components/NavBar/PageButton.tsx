import React from "react";
import { IconProps, Icon } from "@tabler/icons-react";
import { Tooltip, UnstyledButton } from "@mantine/core";
import styles from "./PageButton.module.scss";

type PageButtonProps = {
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
  label: string;
  onClick: () => void;
  isActive?: true;
};

export default function PageButton({
  icon,
  label,
  onClick,
  isActive,
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
        className={styles.mainLink}
        data-active={isActive}
      >
        <link.icon size={22} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}
