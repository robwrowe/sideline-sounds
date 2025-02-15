import React, { useCallback, useMemo } from "react";
import { Accordion, Button, Grid, TextInput, Stack } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

import { Subclip } from "../../../../types";
import { AudioFileAction } from "../../../hooks";
import { formatSecondsToTime } from "../../../../utils";

import { InOutPointLabel } from "../../InOutPoint";
import { useDisclosure } from "@mantine/hooks";
import DeleteSubclipModal from "./DeleteSubclipModal.AudioFileSubclip";
import { ColorCombobox } from "../../Combobox";

type SubclipItemProps = {
  item: Subclip;
  dispatch: React.ActionDispatch<[action: AudioFileAction]>;
};

export default function SubclipItem({ item, dispatch }: SubclipItemProps) {
  const { id, name, inPoint, outPoint, color } = item;
  const [opened, { toggle }] = useDisclosure();

  const inPointValue = useMemo(
    () => (inPoint !== null ? formatSecondsToTime(inPoint, 2) : ""),
    [inPoint]
  );

  const outPointValue = useMemo(
    () => (outPoint !== null ? formatSecondsToTime(outPoint, 2) : ""),
    [outPoint]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      dispatch({
        type: "UPDATE_SUBCLIP",
        id,
        payload: { ...item, name: value },
      });
    },
    [dispatch, id, item]
  );

  const handleChangeColor = useCallback(
    (value: string | null) => {
      dispatch({
        type: "UPDATE_SUBCLIP",
        id,
        payload: { ...item, color: value ?? null },
      });
    },
    [dispatch, id, item]
  );

  const handleClearInPoint = useCallback(() => {
    dispatch({
      type: "UPDATE_SUBCLIP",
      id,
      payload: { ...item, inPoint: null },
    });
  }, [dispatch, id, item]);

  const handleClearOutPoint = useCallback(() => {
    dispatch({
      type: "UPDATE_SUBCLIP",
      id,
      payload: { ...item, outPoint: null },
    });
  }, [dispatch, id, item]);

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
        onClickDelete={() => dispatch({ type: "DELETE_SUBCLIP", payload: id })}
        name={name}
      />
    </>
  );
}
