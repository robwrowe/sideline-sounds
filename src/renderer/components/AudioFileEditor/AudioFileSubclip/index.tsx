import React, { useCallback } from "react";
import { Accordion, Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";

import SubclipItem from "./SubclipItem.AudioFileSubclip";
import { Subclip } from "../../../../types";

export type AudioFileSubclipProps = {
  selectedSubclip: string | null;
  setSelectedSubclip: (clip: string | null) => void;
  //
  subclips: Subclip[];
  setSubclips: (value: Subclip[]) => void;
};

export default function AudioFileSubclip({
  selectedSubclip,
  setSelectedSubclip,
  //
  subclips,
  setSubclips,
}: AudioFileSubclipProps) {
  const handleChange = useCallback(
    (item: Subclip, deleteSubclip = false) => {
      if (deleteSubclip) {
        const payload = subclips.filter((subclip) => subclip.id !== item.id);
        setSubclips(payload);
      } else {
        const payload = subclips.map((subclip) =>
          subclip.id === item.id ? item : subclip
        );

        setSubclips(payload);
      }
    },
    [setSubclips, subclips]
  );

  return (
    <Stack gap="lg">
      <Accordion
        variant="separated"
        value={selectedSubclip}
        onChange={setSelectedSubclip}
      >
        {subclips.map((item) => (
          <SubclipItem key={item.id} item={item} onChange={handleChange} />
        ))}
      </Accordion>
      <Button
        fullWidth
        variant="default"
        leftSection={<IconPlus size={16} />}
        onClick={() => {
          const id = uuid();
          setSubclips([
            ...subclips,
            { id, name: "", inPoint: null, outPoint: null, color: null },
          ]);
          setSelectedSubclip(id);
        }}
      >
        Add New Subclip
      </Button>
    </Stack>
  );
}
