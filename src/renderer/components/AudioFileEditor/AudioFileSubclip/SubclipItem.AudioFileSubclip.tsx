import React, { useCallback, useMemo } from "react";
import {
  Accordion,
  Button,
  Grid,
  TextInput,
  ColorInput,
  Stack,
  ActionIcon,
  useMantineColorScheme,
  Modal,
} from "@mantine/core";
import { IconTrash, IconX } from "@tabler/icons-react";

import { Subclip } from "../../../../types";
import { AudioFileAction } from "../../../hooks";
import { SWATCHES } from "../../../../constants";
import { formatSecondsToTime } from "../../../../utils";

import { InOutPointLabel } from "../../InOutPoint";
import { useDisclosure } from "@mantine/hooks";
import DeleteSubclipModal from "./DeleteSubclipModal.AudioFileSubclip";

type SubclipItemProps = {
  item: Subclip;
  dispatch: React.ActionDispatch<[action: AudioFileAction]>;
};

export default function SubclipItem({ item, dispatch }: SubclipItemProps) {
  const { id, name, inPoint, outPoint, color } = item;
  const { colorScheme } = useMantineColorScheme();
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
              <Grid.Col span={9}>
                <TextInput
                  label="Name"
                  value={name ?? ""}
                  onChange={(evt) => handleChangeName(evt.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <ColorInput
                  label="Color"
                  value={color ?? ""}
                  onChange={handleChangeColor}
                  swatches={SWATCHES}
                  withPicker={false}
                  withEyeDropper={false}
                  closeOnColorSwatchClick={true}
                  rightSection={
                    color && (
                      <ActionIcon
                        size="input-sm"
                        variant="transparent"
                        color={colorScheme === "light" ? "black" : "gray"}
                        onClick={() => handleChangeColor(null)}
                        tabIndex={-1}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <InOutPointLabel
                  label="In Point"
                  value={inPointValue}
                  onClickClear={handleClearInPoint}
                />
              </Grid.Col>
              <Grid.Col span={6} />
              <Grid.Col span={3}>
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
