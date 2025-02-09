import React from "react";
import { Accordion, Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";

import { AudioFileAction, AudioFileState } from "../../../hooks";

import SubclipItem from "./SubclipItem.AudioFileSubclip";

export type AudioFileSubclipProps = {
  state: AudioFileState;
  dispatch: React.ActionDispatch<[action: AudioFileAction]>;
  selectedSubclip: string | null;
  setSelectedSubclip: (clip: string | null) => void;
};

export default function AudioFileSubclip({
  state,
  dispatch,
  selectedSubclip,
  setSelectedSubclip,
}: AudioFileSubclipProps) {
  return (
    <Stack gap="lg">
      <Accordion
        variant="separated"
        value={selectedSubclip}
        onChange={setSelectedSubclip}
      >
        {state.subclips.map((item) => (
          <SubclipItem key={item.id} item={item} dispatch={dispatch} />
        ))}
      </Accordion>
      <Button
        fullWidth
        variant="default"
        leftSection={<IconPlus size={16} />}
        onClick={() => {
          const id = uuid();
          dispatch({ type: "ADD_SUBCLIP", payload: { id } });
          setSelectedSubclip(id);
        }}
      >
        Add New Subclip
      </Button>
    </Stack>
  );
}
