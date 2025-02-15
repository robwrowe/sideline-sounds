import React, { useState } from "react";
import {
  CloseButton,
  Combobox,
  Input,
  InputBase,
  InputBaseProps,
  ScrollArea,
  useCombobox,
} from "@mantine/core";

import ColorOption from "./ColorOption";

import { MANTINE_COLORS } from "../../../../constants";
import { ColorItem } from "../../../../types";
import { toTitleCase } from "../../../../utils";

function getFilteredOptions(
  data: ColorItem[],
  searchQuery: string,
  limit = 0
): Record<string, ColorItem[]> {
  const result: ColorItem[] = [];

  for (const item of data) {
    // if we've reached the limit, stop searching
    if (limit > 0 && result.length === limit) {
      break;
    }

    const { label, value } = item;

    if (label.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
      result.push(item);
      continue;
    }

    if (value.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
      result.push(item);
      continue;
    }
  }

  console.log("result", result);

  const payload: Record<string, ColorItem[]> = {};

  for (const item of result) {
    console.log("checking item", item);
    if (!payload?.[item.group]) {
      payload[item.group] = [];
    }

    payload[item.group].push(item);
  }

  return payload;
}

export type ColorComboboxProps = Pick<
  InputBaseProps,
  "label" | "labelProps"
> & {
  placeholder?: string;
  value: string | null;
  setValue: (val: string | null) => void;
  limit?: number;
};

export default function ColorCombobox({
  value,
  setValue,
  placeholder = "Select Color",
  label = "Color",
  labelProps,
  limit = 0,
}: ColorComboboxProps) {
  const [search, setSearch] = useState("");
  const selectedColor = MANTINE_COLORS.find((item) => item.value === value);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();

      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const filteredOptions = getFilteredOptions(MANTINE_COLORS, search, limit);
  const options = Object.keys(filteredOptions).map((key) => (
    <Combobox.Group label={toTitleCase(key)} key={key}>
      {filteredOptions[key].map((item) => (
        <Combobox.Option value={item.value} key={item.value}>
          <ColorOption {...item} />
        </Combobox.Option>
      ))}
    </Combobox.Group>
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
          pointer
          onClick={() => combobox.toggleDropdown()}
          rightSection={
            value ? (
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
        >
          {selectedColor ? (
            <ColorOption {...selectedColor} />
          ) : (
            <Input.Placeholder>{placeholder}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(evt.currentTarget.value)
          }
          placeholder="Search Colors"
        />
        <Combobox.Options>
          <ScrollArea.Autosize mah={200}>{options}</ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
