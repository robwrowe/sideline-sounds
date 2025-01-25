import React from "react";
import { AppShell, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./Home.module.scss";

import { DataSongCard, SongCard, NavBar, Header, Footer } from "../components";

export default function Home() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      layout="alt"
      header={{ height: 88 }}
      footer={{ height: 32 }}
      navbar={{ width: 300, breakpoint: "md", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="xs">
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
          <DataSongCard
            title="03 Open w Vamp"
            filePath="/Users/robwrowe/Documents/test-audio/Event Theme Disc 01/03 Open w Vamp.wav"
          />
          <DataSongCard
            title="18 60 ElectroRock Bump"
            filePath="/Users/robwrowe/Documents/test-audio/Event Theme Disc 02/18 60 ElectroRock Bump.wav"
          />
          <DataSongCard
            title="27 45 Inspirational Orchestral Bump"
            filePath="/Users/robwrowe/Documents/test-audio/Event Theme Disc 02/27 45 Inspirational Orchestral Bump.wav"
          />
          <DataSongCard
            title="17 05-07 Groovy Hip Hop Sting"
            filePath="/Users/robwrowe/Documents/test-audio/Event Theme Disc 02/17 05-07 Groovy Hip Hop Sting.wav"
          />
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
      <AppShell.Footer p="0">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
