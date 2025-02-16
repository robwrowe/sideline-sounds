import React, { useCallback } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";

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
