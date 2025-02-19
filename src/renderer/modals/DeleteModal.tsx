import React, { useCallback } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { ContextModalProps, modals } from "@mantine/modals";
import { MODAL_OVERLAY_PROPS } from "../../constants";

export type DeleteModalProps = {
  text: string;
  labels?: {
    confirm?: string;
    cancel?: string;
  };
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function DeleteModal({
  context,
  id,
  innerProps,
}: ContextModalProps<DeleteModalProps>) {
  const { labels = {}, onConfirm, onCancel, text } = innerProps;
  const { confirm = "Delete", cancel = "Cancel" } = labels;

  const handleSubmit = useCallback(() => {
    if (onConfirm) {
      onConfirm();
      context.closeModal(id);
    }
  }, [context, id, onConfirm]);

  return (
    <Stack w="100%">
      <Text>{text}</Text>
      <Group style={{ alignSelf: "flex-end" }}>
        <Button
          variant="default"
          onClick={onCancel || (() => context.closeModal(id))}
        >
          {cancel}
        </Button>
        <Button onClick={handleSubmit} color="red">
          {confirm}
        </Button>
      </Group>
    </Stack>
  );
}

export type OpenDeleteModalOpts = {
  title?: string;
  id?: string;
};

export const openDeleteModal = (
  props: DeleteModalProps,
  opts: OpenDeleteModalOpts = {}
) => {
  return modals.openContextModal({
    modal: "deleteModal",
    centered: true,
    overlayProps: MODAL_OVERLAY_PROPS,
    innerProps: {
      ...props,
    },
    ...opts,
  });
};
