import React from "react";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./Home.module.scss";
import { SongCard, NavBar, Header } from "../components";

export default function Home() {
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <AppShell
      layout="alt"
      header={{ height: 80 }}
      footer={{ height: 48 }}
      navbar={{ width: 300, breakpoint: "md", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Header burgerOpened={opened} onBurgerClick={toggle} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Group>
          <NavBar burgerOpened={opened} onBurgerClick={toggle} />
        </Group>
      </AppShell.Navbar>
      <AppShell.Main>
        <div className={styles.grid}>
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
        </div>
      </AppShell.Main>
      <AppShell.Footer p="md">Footer</AppShell.Footer>
    </AppShell>
  );
}
