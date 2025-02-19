import React, { useState } from "react";
import {
  CloseButton,
  Combobox,
  ComboboxItem,
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
};

export default function SearchableSelect({
  data,
  value,
  setValue,
  placeholder,
  label,
  emptyText = "Nothing found",
}: SearchableSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
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
        setSearch(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          placeholder={placeholder}
          label={label}
          value={selectedItem?.label || ""}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || "");
          }}
          rightSectionPointerEvents={value ? "all" : "none"}
          rightSection={
            value ? (
              <CloseButton
                onClick={() => {
                  setValue(null);
                  setSearch("");
                }}
              />
            ) : (
              <Combobox.Chevron />
            )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
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
