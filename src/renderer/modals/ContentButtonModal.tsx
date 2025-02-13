import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  CloseButton,
  ColorInput,
  Group,
  InputWrapper,
  Stack,
} from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";

import {
  AudioFilesCombobox,
  AppFloatingIndicator,
  SubclipCombobox,
} from "../components";
import { ButtonActionType } from "../../types";
import { SWATCHES } from "../../constants";

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
};

// TODO: add ability to preview track

export default function ContentButtonModal({
  context,
  id,
  innerProps = {},
}: ContextModalProps<ContentButtonModalProps>) {
  const { labels = {}, onConfirm, onCancel } = innerProps;
  const { confirm = "Confirm", cancel = "Cancel" } = labels;

  const [valueFile, setValueFile] = useState<string | null>(null);
  const [valueSubclip, setValueSubclip] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

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
          <ColorInput
            label="Color"
            value={color ?? ""}
            onChange={(value) => setColor(value ?? null)}
            rightSection={
              color && (
                <CloseButton
                  size="sm"
                  onMouseDown={(evt: React.MouseEvent) => evt.preventDefault()}
                  onClick={() => setColor(null)}
                />
              )
            }
            swatches={SWATCHES}
            withPicker={false}
            withEyeDropper={false}
            closeOnColorSwatchClick={true}
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
        <Button onClick={handleSubmit}>{confirm}</Button>
      </Group>
    </Stack>
  );
}
