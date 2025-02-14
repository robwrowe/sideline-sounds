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

import { Subclip, ThunkStatus } from "../../../../types";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchAudioFiles } from "../../../features";

import SubclipOption from "./SubclipOption";

function getFilteredOptions(
  data: Subclip[],
  searchQuery: string,
  limit: number
): Subclip[] {
  const result: Subclip[] = [];

  for (const item of data) {
    // if we've reached the limit, stop searching
    if (result.length === limit) {
      break;
    }

    const { name } = item;

    if (name.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
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
  selectedAudioFileID: string | null;
};

export default function AudioFilesCombobox({
  value,
  setValue,
  label,
  labelProps,
  placeholder = "No Subclip Selected",
  limit = 7,
  selectedAudioFileID,
}: AudioFilesComboboxProps) {
  const dispatch = useAppDispatch();
  const files = useAppSelector(({ audioFiles }) => audioFiles.audioFiles);
  const data = useMemo(
    () =>
      files
        .filter((item) => item.id === selectedAudioFileID)
        .map((item) => item.subclips.flat())
        .flat(),
    [files, selectedAudioFileID]
  );
  const status = useAppSelector(({ audioFiles }) => audioFiles.status);
  const loading = useMemo(
    () => status === ThunkStatus.IDLE || status === ThunkStatus.PENDING,
    [status]
  );

  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const selectedFile = files.find((item) => item.id === selectedAudioFileID);
  const selectedSubclip = data.find((item) => item.id === value);

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
      <SubclipOption {...item} duration={selectedFile?.duration} />
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
                onClick={() => setValue(null)}
                aria-label="Clear value"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          rightSectionPointerEvents={value === null ? "none" : "all"}
          multiline
        >
          {selectedSubclip ? (
            <SubclipOption
              {...selectedSubclip}
              duration={selectedFile?.duration}
            />
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
