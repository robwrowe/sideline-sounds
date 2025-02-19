import React from "react";
import { Modal, Button, ModalProps } from "@mantine/core";
import styles from "./ExitShowModal.module.scss";
import { useNavigate } from "react-router";

import { MODAL_OVERLAY_PROPS } from "../../../../constants";

export type ExitShowModalProps = Pick<ModalProps, "opened" | "onClose">;

export default function ExitShowModal({ opened, onClose }: ExitShowModalProps) {
  const navigate = useNavigate();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      overlayProps={MODAL_OVERLAY_PROPS}
    >
      <div className={styles.container}>
        <p className={styles.subtitle}>
          Are you sure you want to exit the show?
        </p>
        <div className={styles.buttonContainer}>
          <Button
            fullWidth
            color="red"
            onClick={() => {
              try {
                navigate("/main");
              } catch (err) {
                console.error("Error exiting show", err);
              } finally {
                onClose();
              }
            }}
          >
            Yes, Exit
          </Button>
          <Button fullWidth variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
