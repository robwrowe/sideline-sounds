import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import classNames from "classnames";
import { Button, Divider, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon, IconFileImport, IconPlus } from "@tabler/icons-react";
import styles from "./index.module.scss";

import AddShowModal from "./AddShowModal";
import {
  useAppDispatch,
  useAppSelector,
  useDarkModeClassNames,
} from "../../../hooks";
import { ThunkStatus } from "../../../../types";
import { fetchShows } from "../../../features";

type StartButtons = {
  title: string;
  Icon: Icon;
  onClick: () => void;
};

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const darkModeStyles = useDarkModeClassNames(styles);

  const [addShowOpened, { toggle: addShowToggle }] = useDisclosure(false);
  const showsStatus = useAppSelector(({ shows }) => shows.status);
  const showsIsLoading = useMemo(
    () =>
      showsStatus === ThunkStatus.IDLE || showsStatus === ThunkStatus.PENDING,
    [showsStatus]
  );
  const showsError = useAppSelector(({ shows }) => shows.error);
  const showsData = useAppSelector(({ shows }) => shows.shows);

  const BUTTONS: StartButtons[] = [
    {
      title: "Create New Show",
      Icon: IconPlus,
      onClick: addShowToggle,
    },
    {
      title: "Import Existing Show",
      Icon: IconFileImport,
      onClick: () => console.log("import show"),
    },
  ];

  const fetchAndSetShows = useCallback(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  useEffect(() => {
    if (showsStatus === ThunkStatus.IDLE) {
      fetchAndSetShows();
      console.log("temp logging");
    }
  }, [fetchAndSetShows, showsStatus]);

  const handleClickShow = useCallback(
    (id: string) => {
      navigate(`show/${id}`, { relative: "path" });
    },
    [navigate]
  );

  return (
    <>
      <div className={styles.parent}>
        <header className={styles.header}>
          <Title order={1}>Sideline Sounds</Title>
        </header>
        <div className={styles.container}>
          <div className={styles.showActions}>
            <div
              className={classNames(
                styles.actionContainer,
                styles.box,
                darkModeStyles
              )}
            >
              <Title order={2}>Start</Title>
              <div className={styles.buttons}>
                {BUTTONS.map((item) => (
                  <Button
                    key={`start-buttons-${item.title}`}
                    variant="transparent"
                    leftSection={<item.Icon size={14} />}
                    onClick={item.onClick}
                    justify="flex-start"
                    fullWidth
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
            <div
              className={classNames(
                styles.loadShowContainer,
                styles.box,
                darkModeStyles
              )}
            >
              <Title order={2}>Load Show</Title>
              {/* search bar */}
              <div className={styles.showTable}>
                {/* table */}
                {/*  */}
                {showsData
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => (
                    <Button
                      key={`start-buttons-${item.id}`}
                      variant="transparent"
                      onClick={() => handleClickShow(item.id)}
                      justify="flex-start"
                      fullWidth
                    >
                      {item.name}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
          <div
            className={classNames(
              styles.walkthroughActions,
              styles.box,
              darkModeStyles
            )}
          >
            <Title order={2}>Tutorials</Title>
          </div>
        </div>
        <footer className={styles.footer}>
          <Title order={6}>
            Copyright © {new Date().getFullYear()} Rob W. Rowe | Licensed under
            AGPL-3.0.
          </Title>
        </footer>
      </div>
      <AddShowModal opened={addShowOpened} onClose={addShowToggle} />
      <button onClick={() => navigate("show", { relative: "path" })}>
        Open Show
      </button>
    </>
  );
}
