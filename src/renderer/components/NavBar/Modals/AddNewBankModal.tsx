import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import classNames from "classnames";
import {
  Button,
  Modal,
  TextInput,
  ModalProps,
  NumberInput,
} from "@mantine/core";
import { v4 as uuid } from "uuid";
import styles from "./AddNewBankModal.module.scss";

import { dbBanks } from "../../../repos";
import { ShowParams } from "../../../../types";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchBanks } from "../../../features";

export type AddNewBankModalProps = Pick<ModalProps, "opened" | "onClose">;

export default function AddNewBankModal({
  opened,
  onClose,
}: AddNewBankModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [pageName, setPageName] = useState("");
  const [numOfRows, setNumOfRows] = useState<number | string>(4);
  const [numOfCols, setNumOfCols] = useState<number | string>(4);
  const [loading, setLoading] = useState(false);
  const { showID } = useParams<ShowParams>();
  const pageID = useAppSelector(({ pages }) => pages.activePageID);

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const id = uuid();

      if (!pageID) throw new Error("Missing page ID");

      if (!numOfCols || Number(numOfCols) < 1) {
        throw new Error("Invalid number of columns");
      }

      if (!numOfRows || Number(numOfRows) < 1) {
        throw new Error("Invalid number of rows");
      }

      await dbBanks.addItem({
        id,
        name: pageName,
        pageID: pageID,
        numOfRows: Number(numOfRows),
        numOfCols: Number(numOfCols),
        sortOrder: null,
      });

      // update redux
      dispatch(fetchBanks({ showID }));

      navigate(`/main/show/${showID}/page/${pageID}/bank/${id}`);

      // close the modal
      onClose();
    } catch (err) {
      console.error("Error when creating bank", err);
    } finally {
      setLoading(false);
    }
  }, [
    dispatch,
    navigate,
    numOfCols,
    numOfRows,
    onClose,
    pageID,
    pageName,
    showID,
  ]);

  return (
    <Modal title="Add New Bank" opened={opened} onClose={onClose}>
      <div className={styles.container}>
        <div className={classNames(styles.row)}>
          <TextInput
            label="Bank Name"
            value={pageName}
            onChange={(event) => setPageName(event.currentTarget.value)}
            disabled={loading}
          />
        </div>
        <div className={classNames(styles.row)}>
          <NumberInput
            label="Number of Columns"
            value={numOfCols}
            onChange={(val) => setNumOfCols(val)}
            disabled={loading}
            min={1}
            max={20}
          />
        </div>
        <div className={classNames(styles.row)}>
          <NumberInput
            label="Number of Rows"
            value={numOfRows}
            onChange={(val) => setNumOfRows(val)}
            disabled={loading}
            min={1}
            max={20}
          />
        </div>
        <div className={classNames(styles.row, styles.buttonContainer)}>
          <Button
            fullWidth
            disabled={!pageName}
            onClick={handleClick}
            loading={loading}
          >
            Create Bank
          </Button>
          <Button
            fullWidth
            color="red"
            variant="outline"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
