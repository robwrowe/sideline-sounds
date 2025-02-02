import React, { useEffect } from "react";
import { useParams, Route, Routes } from "react-router";
import { AppShell, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { NavBar, Header, Footer } from "../../../components";
import { ShowParams } from "../../../../types";
import ShowBank from "./ShowBank";
import { useAppSelector } from "../../../hooks";

export default function Show() {
  const [opened, { toggle }] = useDisclosure(false);
  const { showID } = useParams<ShowParams>();
  const pageID = useAppSelector(({ pages }) => pages.activePageID);
  const bankID = useAppSelector(({ banks }) => banks.activeBankID);

  useEffect(() => {
    console.log("Show.tsx", "showID", showID);
  }, [showID]);

  useEffect(() => {
    console.log("Show.tsx", "pageID", pageID);
  }, [pageID]);

  useEffect(() => {
    console.log("Show.tsx", "bankID", bankID);
  }, [bankID]);

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
        <Stack>
          <Text>Show ID: {showID}</Text>
          <Text>Page ID: {pageID}</Text>
          <Text>Bank ID: {bankID}</Text>
        </Stack>
        <Routes>
          <Route path="page/:pageID/bank/:bankID" element={<ShowBank />} />
          <Route path="*" element={<p>No bank selected</p>} />
        </Routes>
      </AppShell.Main>
      <AppShell.Footer p="0">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
