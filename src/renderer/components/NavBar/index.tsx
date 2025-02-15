import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import { Box, Burger, Title, Tooltip, UnstyledButton } from "@mantine/core";
import {
  IconVinyl,
  IconLogout,
  IconPlus,
  IconProps,
  Icon,
} from "@tabler/icons-react";
import * as TablerIcons from "@tabler/icons-react";
import styles from "./index.module.scss";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchBanks, fetchPages } from "../../features";
import { ShowParams, ThunkStatus } from "../../../types";

import PageButton from "./PageButton";
import BankButton from "./BankButton";
import AddNewPageModal from "./Modals/AddNewPageModal";
import AddNewBankModal from "./Modals/AddNewBankModal";
import ExitShowModal from "./Modals/ExitShowModal";

// TODO: add placeholder if there are no pages or banks in a show
// TODO: add a modal for re-ordering pages & banks
// TODO: update document title to name of show

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

  const [showExitModal, { toggle: toggleExitShowModal }] = useDisclosure(false);
  const [showAddNewPageModal, { toggle: toggleAddNewPageModal }] =
    useDisclosure(false);
  const [showAddNewBankModal, { toggle: toggleAddNewBankModal }] =
    useDisclosure(false);

  const { showID } = useParams<ShowParams>();

  const pagesData = useAppSelector(({ pages }) => pages.pages);
  const pagesStatus = useAppSelector(({ pages }) => pages.status);
  const activePageID = useAppSelector(({ pages }) => pages.activePageID);
  const activePage = useMemo(
    () =>
      activePageID && pagesData
        ? pagesData.find((item) => item.id === activePageID)
        : null,
    [activePageID, pagesData]
  );

  const [pages, setPages] = useState<PageState[]>([]);

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
  const activeBankID = useAppSelector(({ banks }) => banks.activeBankID);

  // get the latest banks in redux
  const handleFetchBanks = useCallback(() => {
    dispatch(fetchBanks({ showID }));
  }, [dispatch, showID]);

  // when the page loads, fetch banks
  useEffect(() => {
    handleFetchBanks();
  }, [handleFetchBanks]);

  // build out the buttons for the banks
  useEffect(() => {
    if (banksStatus === ThunkStatus.SUCCEEDED) {
      const data: BankState[] = [];

      for (const bank of banksData) {
        if (bank.pageID === activePageID) {
          data.push({
            id: bank.id,
            label: bank.name,
          });
        }
      }

      setBanks(data);
      return;
    }

    setBanks([]);
  }, [activePageID, banksData, banksStatus]);

  // on click handlers
  const handleClickPage = useCallback(
    (id: string) => {
      // see if there's a bank previously selected
      const prevSelectedBankID = localStorage.getItem(
        `bank-selection:show:${showID}:page:${id}`
      );

      if (prevSelectedBankID) {
        navigate(
          `/main/show/${showID}/page/${id}/bank/${JSON.parse(prevSelectedBankID)}`
        );
      } else {
        navigate(`/main/show/${showID}/page/${id}`);
      }
    },
    [navigate, showID]
  );

  const handleClickBank = useCallback(
    (id: string) => {
      if (showID && activePageID) {
        navigate(`/main/show/${showID}/page/${activePageID}/bank/${id}`);
      }
    },
    [activePageID, navigate, showID]
  );

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
                  key={id}
                  label={label}
                  icon={icon}
                  onClick={() => handleClickPage(id)}
                  isActive={id === activePage?.id || undefined}
                />
              ))}
              {/* add new page */}
              <PageButton
                icon={IconPlus}
                label="Add New Page"
                onClick={() => toggleAddNewPageModal()}
                className={styles.addPage}
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
              {activePage?.name || "Pick a Page"}
            </Title>
            <div className={styles.linksContainer}>
              {banks.map((item) => (
                <BankButton
                  key={`bank-${item.label}`}
                  label={item.label}
                  onClick={() => handleClickBank(item.id)}
                  isActive={item.id === activeBankID || undefined}
                />
              ))}
              {/* add new bank */}
              {activePageID ? (
                <BankButton
                  label="Add New Bank"
                  onClick={(event) => {
                    event.preventDefault();
                    if (activePageID) toggleAddNewBankModal();
                  }}
                  className={styles.addBank}
                  disabled={!activePageID}
                />
              ) : (
                <p className={styles.noPage}>No page selected</p>
              )}
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
