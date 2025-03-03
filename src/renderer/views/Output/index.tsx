import React, { useCallback, useEffect } from "react";
import classNames from "classnames";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconVinyl } from "@tabler/icons-react";
import styles from "./index.module.scss";

import { useAppDispatch } from "../../hooks";
import { fetchOutputDevices } from "../../features";

import DestinationsView from "./Destinations";
import { AudioEngineProvider } from "../../context";

const PATHS: { text: string; route: string }[] = [
  // {
  //   text: "Destinations",
  //   route: "/output/dest",
  // },
];

export default function OutputView() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(
    () => console.log("location", location.pathname, location),
    [location]
  );

  const handleClick = useCallback(
    (route: string) => navigate(route),
    [navigate]
  );

  const navButtons = PATHS.map((item) => (
    <UnstyledButton
      key={item.route}
      className={classNames(styles.control, {
        [styles.active]: location.pathname === item.route,
      })}
      onClick={() => handleClick(item.route)}
    >
      {item.text}
    </UnstyledButton>
  ));

  // when an audio device is added or removed, update the available devices
  // TODO: when a device that's being used is removed, notify the user
  useEffect(() => {
    const callback = () => dispatch(fetchOutputDevices());

    navigator.mediaDevices.addEventListener("devicechange", callback);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", callback);
    };
  }, [dispatch]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          {PATHS.length && (
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          )}
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group justify="flex-start" align="center" gap="xs">
              <IconVinyl size={30} />
              <Title order={2}>Output Manager</Title>
            </Group>

            <Group ml="xl" gap={0} visibleFrom="sm">
              {navButtons}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {navButtons}
      </AppShell.Navbar>

      <AppShell.Main>
        <ScrollArea.Autosize className={styles.scroll}>
          <AudioEngineProvider>
            <Routes>
              <Route path="/*" element={<DestinationsView />} />
            </Routes>
          </AudioEngineProvider>
        </ScrollArea.Autosize>
      </AppShell.Main>
    </AppShell>
  );
}
