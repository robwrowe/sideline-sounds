import { Burger } from "@mantine/core";
import React from "react";

export type HeaderProps = {
  burgerOpened: boolean;
  onBurgerClick: () => void;
};

export default function Header({ burgerOpened, onBurgerClick }: HeaderProps) {
  return (
    <div>
      <Burger
        opened={burgerOpened}
        onClick={onBurgerClick}
        hiddenFrom="md"
        size="sm"
      />
      Header
    </div>
  );
}
