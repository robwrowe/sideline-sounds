import React, { useCallback, useMemo, useState } from "react";
import { Button, Group, InputWrapper, Stack } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";

import {
  AudioFilesCombobox,
  AppFloatingIndicator,
  SubclipCombobox,
  ColorCombobox,
} from "../components";
import {
  ButtonActionType,
  ContentButton,
  ContentButtonFile,
} from "../../types";

const BUTTON_TYPE_OPTIONS = [
  {
    label: "File",
    value: ButtonActionType.FILE,
  },
  {
    label: "Loop",
    value: ButtonActionType.LOOP,
  },
  {
    label: "Playlist",
    value: ButtonActionType.PLAYLIST,
  },
];

export type ContentButtonModalConfirmArgs = {
  fileID: string;
  subclipID: string | null;
  color: string | null;
};

export type ContentButtonModalProps = {
  labels?: {
    confirm?: string;
    cancel?: string;
  };
  onCancel?: () => void;
  onConfirm?: (args: ContentButtonModalConfirmArgs) => void;
  defaultValues?: Pick<Partial<ContentButtonFile>, "contentID" | "subclipID"> &
    Pick<Partial<ContentButton>, "color">;
};

// TODO: add ability to preview track

export default function ContentButtonModal({
  context,
  id,
  innerProps = {},
}: ContextModalProps<ContentButtonModalProps>) {
  const { labels = {}, onConfirm, onCancel, defaultValues = {} } = innerProps;
  const { confirm = "Confirm", cancel = "Cancel" } = labels;
  const {
    color: defaultColor = null,
    contentID = null,
    subclipID = null,
  } = defaultValues;

  const [valueFile, setValueFile] = useState<string | null>(contentID);
  const [valueSubclip, setValueSubclip] = useState<string | null>(subclipID);
  const [color, setColor] = useState<string | null>(defaultColor);

  const [activeButtonType, setActiveButtonType] = useState(0);
  const activeButtonValue = useMemo(
    () => BUTTON_TYPE_OPTIONS[activeButtonType].value,
    [activeButtonType]
  );

  const handleSubmit = useCallback(() => {
    if (valueFile) {
      if (onConfirm) {
        onConfirm({ fileID: valueFile, subclipID: valueSubclip, color });
        context.closeModal(id);
      }
    }
  }, [color, context, id, onConfirm, valueFile, valueSubclip]);

  return (
    <Stack w="100%">
      <InputWrapper label="Button Type" w="100%">
        <AppFloatingIndicator
          data={BUTTON_TYPE_OPTIONS.map((item) => item.label)}
          active={activeButtonType}
          setActive={setActiveButtonType}
        />
      </InputWrapper>
      {activeButtonValue === ButtonActionType.FILE && (
        <>
          <AudioFilesCombobox
            label="File"
            value={valueFile}
            setValue={setValueFile}
          />
          <SubclipCombobox
            label="Subclip"
            value={valueSubclip}
            setValue={setValueSubclip}
            selectedAudioFileID={valueFile}
          />
          <ColorCombobox
            value={color ?? ""}
            setValue={(value) => setColor(value ?? null)}
          />
        </>
      )}
      <Group style={{ alignSelf: "flex-end" }}>
        <Button
          variant="default"
          onClick={onCancel || (() => context.closeModal(id))}
        >
          {cancel}
        </Button>
        {onConfirm && <Button onClick={handleSubmit}>{confirm}</Button>}
      </Group>
    </Stack>
  );
}
