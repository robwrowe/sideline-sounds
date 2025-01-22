import React, { useState } from "react";
import {
  IconCalendarMonth,
  IconShirtSport,
  IconClock,
  IconBallBaseball,
  IconNotes,
  IconVinyl,
} from "@tabler/icons-react";
import { Box, Burger, Title, Tooltip, UnstyledButton } from "@mantine/core";
import styles from "./index.module.scss";

const mainLinksMockdata = [
  { icon: IconNotes, label: "Vault" },
  { icon: IconShirtSport, label: "Fielding" },
  { icon: IconBallBaseball, label: "Batting" },
  { icon: IconClock, label: "Inning Breaks" },
  { icon: IconCalendarMonth, label: "Pre/Post Game" },
];

const linksMockdata = [
  "Upbeat",
  "Mound Visit",
  "Hits & Runs",
  "Sound Effects",
  "Walk Up Music",
];

export type NavBarProps = {
  burgerOpened: boolean;
  onBurgerClick: () => void;
};

export default function Navbar({ burgerOpened, onBurgerClick }: NavBarProps) {
  const [active, setActive] = useState("Batting");
  const [activeLink, setActiveLink] = useState("Walk Up Music");

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={styles.mainLink}
        data-active={link.label === active || undefined}
      >
        <link.icon size={22} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  const links = linksMockdata.map((link) => (
    <a
      className={styles.link}
      data-active={activeLink === link || undefined}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        setActiveLink(link);
      }}
      key={link}
    >
      {link}
    </a>
  ));

  return (
    <nav className={styles.navbar}>
      <div className={styles.wrapper}>
        <div className={styles.aside}>
          <div className={styles.logo}>
            <Box visibleFrom="md">
              <IconVinyl type="mark" size={30} />
            </Box>
            <Burger
              opened={burgerOpened}
              onClick={onBurgerClick}
              hiddenFrom="md"
              size="sm"
            />
          </div>
          {mainLinks}
        </div>
        <div className={styles.main}>
          <Title order={4} className={styles.title}>
            {active}
          </Title>

          {links}
        </div>
      </div>
    </nav>
  );
}
