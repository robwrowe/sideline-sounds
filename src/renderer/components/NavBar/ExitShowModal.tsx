import React from "react";
import { Modal, Button, ModalProps } from "@mantine/core";
import styles from "./ExitShowModal.module.scss";
import { useNavigate } from "react-router";

export type ExitShowModalProps = Pick<ModalProps, "opened" | "onClose">;

export default function ExitShowModal({ opened, onClose }: ExitShowModalProps) {
  const navigate = useNavigate();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.7,
        blur: 4,
      }}
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
                navigate("..", { relative: "route" });
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
