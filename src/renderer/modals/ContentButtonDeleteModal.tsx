import React, { useCallback } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";

export type ContentButtonDeleteModalProps = {
  buttonName?: string;
  labels?: {
    confirm?: string;
    cancel?: string;
  };
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function ContentButtonDeleteModal({
  context,
  id,
  innerProps = {},
}: ContextModalProps<ContentButtonDeleteModalProps>) {
  const { labels = {}, onConfirm, onCancel, buttonName } = innerProps;
  const { confirm = "Delete", cancel = "Cancel" } = labels;

  const handleSubmit = useCallback(() => {
    if (onConfirm) {
      onConfirm();
      context.closeModal(id);
    }
  }, [context, id, onConfirm]);

  return (
    <Stack w="100%">
      <Text>
        Are you sure you want to delete{" "}
        {buttonName ? buttonName : "this button"}?
      </Text>
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
