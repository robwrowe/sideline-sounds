import React from "react";
import classNames from "classnames";
import styles from "./BankButton.module.scss";

type BankButtonProps = {
  label: string;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
  isActive?: true;
  className?: CSSModule["string"];
  disabled?: boolean;
};

export default function BankButton({
  label: link,
  onClick,
  isActive,
  className,
  disabled,
}: BankButtonProps) {
  return (
    <a
      className={classNames(styles.link, className, {
        [styles.disabled]: disabled,
      })}
      data-active={isActive}
      href="#"
      onClick={onClick}
    >
      {link}
    </a>
  );
}
