import React from "react";
import classNames from "classnames";
import styles from "./BankButton.module.scss";

type BankButtonProps = {
  link: string;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
  isActive?: true;
  className?: CSSModule["string"];
};

export default function BankButton({
  link,
  onClick,
  isActive,
  className,
}: BankButtonProps) {
  return (
    <a
      className={classNames(styles.link, className)}
      data-active={isActive}
      href="#"
      onClick={onClick}
    >
      {link}
    </a>
  );
}
