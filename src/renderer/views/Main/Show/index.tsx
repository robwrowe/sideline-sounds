import React, { useEffect } from "react";
import { useParams, Route, Routes, useNavigate } from "react-router";
import { AppShell, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { NavBar, Header, Footer } from "../../../components";
import { ShowParams } from "../../../../types";
import { setActiveShowID } from "../../../features";
import { useAppDispatch, useAppSelector } from "../../../hooks";

import ShowPages from "./ShowPages";

export default function Show() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [opened, { toggle }] = useDisclosure(false);
  const { showID } = useParams<ShowParams>();
  const pageID = useAppSelector(({ pages }) => pages.activePageID);

  useEffect(() => {
    if (showID) {
      dispatch(setActiveShowID(showID));
    } else {
      dispatch(setActiveShowID(null));
    }

    return () => {
      dispatch(setActiveShowID(null));
    };
  }, [dispatch, showID]);

  // update local storage for future reference
  useEffect(() => {
    if (showID && pageID) {
      localStorage.setItem(
        `page-selection:show:${showID}`,
        JSON.stringify(pageID)
      );
    }
  }, [pageID, showID]);

  // if there's no page selected, see if there's one from a previous session
  useEffect(() => {
    if (showID && !pageID) {
      const prevSelectedPageID = localStorage.getItem(
        `page-selection:show:${showID}`
      );

      if (prevSelectedPageID) {
        const pageIDParsed = JSON.parse(prevSelectedPageID);
        const prevSelectedBankID = localStorage.getItem(
          `bank-selection:show:${showID}:page:${pageIDParsed}`
        );

        if (prevSelectedBankID) {
          navigate(
            `/main/show/${showID}/page/${pageIDParsed}/bank/${JSON.parse(prevSelectedBankID)}`
          );
        } else {
          navigate(`/main/show/${showID}/page/${pageIDParsed}`);
        }
      }
    }
  }, [navigate, pageID, showID]);

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
        <Routes>
          <Route path="page/:pageID/*" element={<ShowPages />} />
          {/* TODO: add placeholder if no page selected */}
        </Routes>
      </AppShell.Main>
      <AppShell.Footer p="0">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
