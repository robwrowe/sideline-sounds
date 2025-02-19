import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  CloseButton,
  Combobox,
  Input,
  InputBase,
  InputBaseProps,
  Loader,
  Stack,
  useCombobox,
} from "@mantine/core";
import { AudioFile, ThunkStatus } from "../../../../types";

import AudioFileOption from "./AudioFileOption";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchAudioFiles } from "../../../features";

function getFilteredOptions(
  data: AudioFile[],
  searchQuery: string,
  limit: number
): AudioFile[] {
  const result: AudioFile[] = [];

  for (const item of data) {
    // if we've reached the limit, stop searching
    if (result.length === limit) {
      break;
    }

    const { title, artist, album } = item;

    if (title.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
      result.push(item);
      continue;
    }

    if (
      artist &&
      artist.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      result.push(item);
      continue;
    }

    if (
      album &&
      album.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      result.push(item);
      continue;
    }
  }

  return result;
}

export type AudioFilesComboboxProps = Pick<
  InputBaseProps,
  "label" | "labelProps"
> & {
  placeholder?: string;
  limit?: number;
  value: string | null;
  setValue: (val: string | null) => void;
};

export default function AudioFilesCombobox({
  value,
  setValue,
  label,
  labelProps,
  placeholder = "Pick File",
  limit = 7,
}: AudioFilesComboboxProps) {
  const dispatch = useAppDispatch();
  const data = useAppSelector(({ audioFiles }) => audioFiles.audioFiles);
  const status = useAppSelector(({ audioFiles }) => audioFiles.status);
  const loading = useMemo(
    () => status === ThunkStatus.IDLE || status === ThunkStatus.PENDING,
    [status]
  );

  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const selectedOption = data.find((item) => item.id === value);

  const handleDropdownOpen = useCallback(async () => {
    if (status !== ThunkStatus.SUCCEEDED && status !== ThunkStatus.PENDING) {
      await dispatch(fetchAudioFiles());
    }
  }, [dispatch, status]);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
      setOpened(false);
    },

    onDropdownOpen: async () => {
      setOpened(true);
      await handleDropdownOpen();
      combobox.focusSearchInput();
    },
  });

  const options = getFilteredOptions(data, search, limit).map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      <AudioFileOption {...item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          labelProps={labelProps}
          component="button"
          type="button"
          pointer
          onClick={() => combobox.toggleDropdown()}
          rightSection={
            opened && loading ? (
              <Loader size={18} />
            ) : value !== null ? (
              <CloseButton
                size="sm"
                onMouseDown={(evt: React.MouseEvent) => evt.preventDefault()}
                onClick={() => {
                  setValue(null);
                  setSearch("");
                }}
                aria-label="Clear value"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          rightSectionPointerEvents={value === null ? "none" : "all"}
          multiline
        >
          {selectedOption ? (
            <AudioFileOption {...selectedOption} />
          ) : (
            <Input.Placeholder>
              <Box mih={44}>
                <Stack align="center" justify="center" h="100%">
                  {placeholder}
                </Stack>
              </Box>
            </Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(evt.currentTarget.value)
          }
          placeholder="Search audio files"
        />
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
