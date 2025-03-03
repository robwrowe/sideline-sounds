import React, { useState } from "react";
import {
  CloseButton,
  Combobox,
  ComboboxItem,
  Input,
  InputBase,
  ScrollArea,
  useCombobox,
} from "@mantine/core";

type AppComboboxItem = ComboboxItem | { group: string; items: ComboboxItem[] };

export type SearchableSelectProps = {
  data: AppComboboxItem[];
  value: string | null;
  setValue: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  emptyText?: string;
  searchPlaceholder?: string;
};

export default function SearchableSelect({
  data,
  value,
  setValue,
  placeholder,
  label,
  emptyText = "Nothing found",
  searchPlaceholder = "",
}: SearchableSelectProps) {
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

  const [search, setSearch] = useState("");

  const flattenedItems = data.flatMap((item) =>
    "group" in item ? item.items : item
  );

  const selectedItem = flattenedItems.find((item) => item.value === value);

  const filteredData = data
    .map((item) => {
      if ("group" in item) {
        const filteredGroupItems = item.items.filter(
          (i) =>
            i.label.toLowerCase().includes(search.toLowerCase().trim()) ||
            i.value.toLowerCase().includes(search.toLowerCase().trim())
        );

        return filteredGroupItems.length > 0
          ? { ...item, items: filteredGroupItems }
          : null;
      }

      return item.label
        .toLowerCase()
        .includes(search.toLocaleLowerCase().trim()) ||
        item.value.toLowerCase().includes(search.toLocaleLowerCase().trim())
        ? item
        : null;
    })
    .filter(Boolean);

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
          {selectedItem ? (
            selectedItem?.label || selectedItem?.value
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
          placeholder={searchPlaceholder}
        />
        <Combobox.Options>
          {filteredData.length > 0 ? (
            <ScrollArea.Autosize mah={300}>
              {filteredData.map((item) => {
                if (!item) return null;

                return "group" in item ? (
                  <Combobox.Group label={item.group} key={item.group}>
                    {item.items.map((subItem) => (
                      <Combobox.Option
                        value={subItem.value}
                        key={subItem.value}
                        disabled={subItem.disabled}
                      >
                        {subItem.label}
                      </Combobox.Option>
                    ))}
                  </Combobox.Group>
                ) : (
                  <Combobox.Option
                    value={item.value}
                    key={item.value}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </Combobox.Option>
                );
              })}
            </ScrollArea.Autosize>
          ) : (
            <Combobox.Empty>{emptyText}</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
