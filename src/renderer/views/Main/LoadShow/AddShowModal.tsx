import React, { useState, useCallback } from "react";
import classNames from "classnames";
import { Button, Modal, TextInput, ModalProps } from "@mantine/core";
import styles from "./AddShowModal.module.scss";
import { v4 as uuid } from "uuid";

import { dbShows } from "../../../repos";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../../hooks";
import { fetchShows, setActiveShowID } from "../../../features";

export type AddShowModalProps = Pick<ModalProps, "opened" | "onClose">;

export default function AddShowModal({ opened, onClose }: AddShowModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showName, setShowName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const id = uuid();

      await dbShows.addItem({
        id,
        name: showName,
      });

      // update redux
      dispatch(fetchShows());
      dispatch(setActiveShowID(id));

      navigate(`/main/show/${id}`);
    } catch (err) {
      console.error("Error when creating show", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate, showName]);

  return (
    <Modal title="Add Show" opened={opened} onClose={onClose}>
      <div className={styles.container}>
        <div className={classNames(styles.row)}>
          <TextInput
            label="Show Name"
            value={showName}
            onChange={(event) => setShowName(event.currentTarget.value)}
            disabled={loading}
          />
        </div>
        <div className={classNames(styles.row, styles.buttonContainer)}>
          <Button
            fullWidth
            disabled={!showName}
            onClick={handleClick}
            loading={loading}
          >
            Create Show
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
