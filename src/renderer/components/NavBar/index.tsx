import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import { Box, Burger, Title, Tooltip, UnstyledButton } from "@mantine/core";
import {
  IconCalendarMonth,
  IconShirtSport,
  IconClock,
  IconBallBaseball,
  IconNotes,
  IconVinyl,
  IconLogout,
  IconPlus,
  IconProps,
  Icon,
} from "@tabler/icons-react";
import * as TablerIcons from "@tabler/icons-react";
import styles from "./index.module.scss";

import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchBanks,
  fetchPages,
  setActivePageID,
  setActiveBankID,
} from "../../features";
import { ShowParams, ThunkStatus } from "../../../types";

import PageButton from "./PageButton";
import BankButton from "./BankButton";
import AddNewPageModal from "./Modals/AddNewPageModal";
import AddNewBankModal from "./Modals/AddNewBankModal";
import ExitShowModal from "./Modals/ExitShowModal";

// TODO: show banks based on data
// TODO: see if there's a better way to handle the navigate + setting active IDs
// TODO: store last selected show, page, and bank
// TODO: add placeholder if there are no pages or banks in a show
// TODO: add a modal for re-ordering pages & banks

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

type BankState = {
  label: string;
  id: string;
};

type PageState = BankState & {
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
};

export default function Navbar({ burgerOpened, onBurgerClick }: NavBarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showID } = useParams<ShowParams>();

  const pagesData = useAppSelector(({ pages }) => pages.pages);
  const pagesStatus = useAppSelector(({ pages }) => pages.status);

  const [pages, setPages] = useState<PageState[]>([]);
  const [activePageLabel, setActivePageLabel] = useState("");

  // get the latest pages in redux
  const handleFetchPages = useCallback(() => {
    dispatch(fetchPages({ showID }));
  }, [dispatch, showID]);

  // when the page loads, fetch pages
  useEffect(() => {
    handleFetchPages();
  }, [handleFetchPages]);

  // build out the buttons for the pages
  useEffect(() => {
    if (pagesStatus === ThunkStatus.SUCCEEDED) {
      const data: PageState[] = [];

      for (const page of pagesData) {
        const icons = TablerIcons as unknown as Record<
          string,
          React.FC<IconProps>
        >;

        const iconComponent = icons[
          page.iconName
        ] as React.ForwardRefExoticComponent<
          IconProps & React.RefAttributes<Icon>
        >;

        if (iconComponent) {
          data.push({
            label: page.name,
            id: page.id,
            icon: iconComponent,
          });
        }
      }

      setPages(data);
      return;
    }

    setPages([]);
  }, [pagesData, pagesStatus]);

  const [banks, setBanks] = useState<BankState[]>([]);
  const banksData = useAppSelector(({ banks }) => banks.banks);
  const banksStatus = useAppSelector(({ banks }) => banks.status);

  // get the latest banks in redux
  const handleFetchBanks = useCallback(() => {
    dispatch(fetchBanks({ showID }));
  }, [dispatch, showID]);

  // when the page loads, fetch banks
  useEffect(() => {
    handleFetchBanks();
  }, [handleFetchBanks]);

  //
  //
  //

  const [activeLink, setActiveLink] = useState("Walk Up Music");
  const [showExitModal, { toggle: toggleExitShowModal }] = useDisclosure(false);
  const [showAddNewPageModal, { toggle: toggleAddNewPageModal }] =
    useDisclosure(false);
  const [showAddNewBankModal, { toggle: toggleAddNewBankModal }] =
    useDisclosure(true);

  const handleClickPage = useCallback(
    (id: string, label: string) => {
      setActivePageLabel(label);
      setActivePageID(id);
      navigate(`/main/show/${showID}/page/${id}/bank/${id}`);
      dispatch(setActivePageID(id));
    },
    [dispatch, navigate, showID]
  );

  const handleClickBank = useCallback(
    (id: string, link: string) => {
      dispatch(setActiveBankID(id));
      setActiveLink(link);
    },
    [dispatch]
  );

  const links = linksMockdata.map((link) => (
    <BankButton
      key={link}
      link={link}
      onClick={(event) => {
        event.preventDefault();
        handleClickBank(link, link);
      }}
      isActive={activeLink === link || undefined}
    />
  ));

  return (
    <>
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
            <div className={styles.mainLinks}>
              {/* show user defined pages */}
              {pages.map(({ icon, label, id }) => (
                <PageButton
                  key={label}
                  label={label}
                  icon={icon}
                  onClick={() => handleClickPage(id, label)}
                  isActive={label === activePageLabel || undefined}
                />
              ))}
              {/* add new page */}
              <PageButton
                icon={IconPlus}
                label="Add New Page"
                onClick={() => toggleAddNewPageModal()}
              />
            </div>
            <div className={styles.logout}>
              <Tooltip
                label="Exit Show"
                position="right"
                withArrow
                transitionProps={{ duration: 0 }}
              >
                <UnstyledButton
                  onClick={toggleExitShowModal}
                  className={styles.mainLink}
                >
                  <IconLogout size={22} stroke={1.5} />
                </UnstyledButton>
              </Tooltip>
            </div>
          </div>
          <div className={styles.main}>
            <Title order={4} className={styles.title}>
              {activePageLabel}
            </Title>
            <div className={styles.linksContainer}>
              {links}
              {/* add new bank */}
              <BankButton
                link="Add New Bank"
                onClick={(event) => {
                  event.preventDefault();
                  toggleAddNewBankModal();
                }}
                className={styles.addPage}
              />
            </div>
          </div>
        </div>
      </nav>
      <AddNewPageModal
        opened={showAddNewPageModal}
        onClose={toggleAddNewPageModal}
      />
      <AddNewBankModal
        opened={showAddNewBankModal}
        onClose={toggleAddNewBankModal}
      />
      <ExitShowModal opened={showExitModal} onClose={toggleExitShowModal} />
    </>
  );
}
