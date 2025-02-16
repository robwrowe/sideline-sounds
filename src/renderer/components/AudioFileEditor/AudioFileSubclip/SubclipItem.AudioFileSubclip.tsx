import React, { useCallback, useMemo } from "react";
import { Accordion, Button, Grid, TextInput, Stack } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

import { Subclip } from "../../../../types";
import { formatSecondsToTime } from "../../../../utils";

import { InOutPointLabel } from "../../InOutPoint";
import { useDisclosure } from "@mantine/hooks";
import DeleteSubclipModal from "./DeleteSubclipModal.AudioFileSubclip";
import { ColorCombobox } from "../../Combobox";

type SubclipItemProps = {
  item: Subclip;
  onChange: (value: Subclip, deleteSubclip?: boolean) => void;
};

export default function SubclipItem({ item, onChange }: SubclipItemProps) {
  const { id, name, inPoint, outPoint, color } = item;
  const [opened, { toggle }] = useDisclosure();

  const inPointValue = useMemo(
    () =>
      inPoint !== null ? formatSecondsToTime(inPoint, { decimals: 2 }) : "",
    [inPoint]
  );

  const outPointValue = useMemo(
    () =>
      outPoint !== null ? formatSecondsToTime(outPoint, { decimals: 2 }) : "",
    [outPoint]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      onChange({ ...item, name: value });
    },
    [onChange, item]
  );

  const handleChangeColor = useCallback(
    (value: string | null) => {
      onChange({ ...item, color: value ?? null });
    },
    [onChange, item]
  );

  const handleClearInPoint = useCallback(() => {
    onChange({ ...item, inPoint: null });
  }, [onChange, item]);

  const handleClearOutPoint = useCallback(() => {
    onChange({ ...item, outPoint: null });
  }, [onChange, item]);

  return (
    <>
      <Accordion.Item value={id}>
        <Accordion.Control>{name}</Accordion.Control>

        <Accordion.Panel>
          <Stack>
            <Grid>
              <Grid.Col span={8}>
                <TextInput
                  label="Name"
                  value={name ?? ""}
                  onChange={(evt) => handleChangeName(evt.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <ColorCombobox
                  value={color ?? ""}
                  setValue={handleChangeColor}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <InOutPointLabel
                  label="In Point"
                  value={inPointValue}
                  onClickClear={handleClearInPoint}
                />
              </Grid.Col>
              <Grid.Col span={4} />
              <Grid.Col span={4}>
                <InOutPointLabel
                  label="Out Point"
                  value={outPointValue}
                  onClickClear={handleClearOutPoint}
                />
              </Grid.Col>
            </Grid>
            <Button
              variant="default"
              leftSection={<IconTrash size={16} />}
              style={{ marginLeft: "auto" }}
              onClick={toggle}
            >
              Delete
            </Button>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
      <DeleteSubclipModal
        opened={opened}
        onClose={toggle}
        onClickDelete={() => onChange(item, true)}
        name={name}
      />
    </>
  );
}
