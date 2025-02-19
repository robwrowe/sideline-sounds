import React from "react";
import { Modal, Button, ModalProps } from "@mantine/core";
import styles from "./DeleteSubclipModal.AudioFileSubclip.module.scss";
import { IconTrash } from "@tabler/icons-react";

import { MODAL_OVERLAY_PROPS } from "../../../../constants";

export type DeleteSubclipModalProps = Pick<ModalProps, "opened" | "onClose"> & {
  name: string;
  onClickDelete: () => void;
};

export default function DeleteSubclipModal({
  opened,
  onClose,
  name,
  onClickDelete,
}: DeleteSubclipModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      overlayProps={MODAL_OVERLAY_PROPS}
    >
      <div className={styles.container}>
        <p
          className={styles.subtitle}
        >{`Are you sure you want to delete the subclip "${name}"?`}</p>
        <div className={styles.buttonContainer}>
          <Button
            fullWidth
            color="red"
            onClick={onClickDelete}
            leftSection={<IconTrash size={16} />}
          >
            Delete it
          </Button>
          <Button fullWidth variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
