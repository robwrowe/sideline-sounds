import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IconPencil,
  IconPlayerPlay,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Checkbox,
  Flex,
  keys,
  Loader,
  ScrollArea,
  Table,
  Text,
  TextInput,
  useComputedColorScheme,
  Pagination,
} from "@mantine/core";
import styles from "./index.module.scss";

import { AudioFile, BaseInitialStateThunk, ThunkStatus } from "../../../types";
import {
  formatSecondsToTime,
  getAudioMimeType,
  getFileName,
} from "../../../utils";

import TableTh from "./TableTh";
import { useAudioEngineContext } from "../../hooks";

type AudioData = Pick<
  AudioFile,
  "id" | "title" | "artist" | "album" | "duration" | "filePath"
>;
type SortKeys = keyof Pick<AudioFile, "title" | "artist" | "album">;

function filterData(data: AudioData[], search: string) {
  const query = search.toLowerCase().trim();

  return data.filter((item) =>
    keys(data[0])
      .filter((key) => key === "title" || key === "artist" || key === "album")
      .some((key) => {
        const val = item[key];

        return (
          val && typeof val === "string" && val.toLowerCase().includes(query)
        );
      })
  );
}

function sortData(
  data: AudioData[],
  payload: { sortBy: SortKeys | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      // confirm there's data
      if (!aVal || !bVal) return 0;

      if (payload.reversed) {
        return bVal.localeCompare(aVal);
      }

      return aVal.localeCompare(bVal);
    }),
    payload.search
  );
}

export type AudioFilesTableProps = Partial<BaseInitialStateThunk> & {
  data: AudioData[];
  hideActions?: boolean;
  hideCheckbox?: boolean;
  itemsPerPage?: number;
};

export default function AudioFilesTable({
  data,
  status,
  error,
  hideActions = false,
  hideCheckbox = false,
  itemsPerPage = 20,
}: AudioFilesTableProps) {
  const colorScheme = useComputedColorScheme();
  const { audioEngine } = useAudioEngineContext();

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<SortKeys | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const lastEscapePress = useRef<number | null>(null);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field: SortKeys) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));

    // reset to first page on new search
    setActivePage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );

    // reset to first page on new search
    setActivePage(1);
  };

  const handleSearchKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key.toLowerCase() === "escape") {
        const now = Date.now();

        if (lastEscapePress.current && now - lastEscapePress.current < 300) {
          setSearch("");
          setSortedData(
            sortData(data, {
              sortBy,
              reversed: reverseSortDirection,
              search: "",
            })
          );
        }

        lastEscapePress.current = now;
      }
    },
    [data, reverseSortDirection, sortBy]
  );

  // TODO: allow user to pause/stop audio file
  // allow user to play back audio file
  const handleClickPlay = useCallback(
    async (filePath: string) => {
      // extract the file name from the path
      const fileName = getFileName(filePath) || "No Name Found";

      const fileBuffer = await window.electron.audio.fileBuffer(filePath);

      const blob = new Blob([fileBuffer]);

      const file = new File([blob], fileName, {
        type: getAudioMimeType(filePath),
      });

      const audioBuffer = await audioEngine.loadAudio(file);

      audioEngine.play(audioBuffer);
    },
    [audioEngine]
  );

  // pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const rows = paginatedData.map((row) => (
    <Table.Tr key={row.id}>
      {!hideCheckbox && (
        <Table.Td>
          <Checkbox />
        </Table.Td>
      )}
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>{row.artist}</Table.Td>
      <Table.Td>{row.album}</Table.Td>
      <Table.Td w={hideActions ? 96 : 176}>
        <div className={styles.durationActions}>
          {row.duration !== null ? formatSecondsToTime(row.duration) : "-:--"}
          {!hideActions && (
            <div className={styles.actionContainer}>
              <ActionIcon
                size="sm"
                variant="transparent"
                color={colorScheme === "light" ? "black" : "gray"}
                onClick={() => handleClickPlay(row.filePath)}
                disabled={!row.filePath}
              >
                <IconPlayerPlay size={16} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="transparent"
                color={colorScheme === "light" ? "black" : "gray"}
              >
                <IconPencil size={16} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="transparent"
                color={colorScheme === "light" ? "black" : "gray"}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </div>
          )}
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Flex direction="column" style={{ height: "100%" }}>
      {/* Header */}
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
      />

      {/* Scrollable Content Area */}
      <ScrollArea w="100%" style={{ flexGrow: 1 }}>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
        >
          <Table.Tbody>
            <Table.Tr>
              {!hideCheckbox && (
                <Table.Th w={40}>
                  <Checkbox />
                </Table.Th>
              )}
              <TableTh
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                Title
              </TableTh>
              <TableTh
                sorted={sortBy === "artist"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("artist")}
              >
                Artist
              </TableTh>
              <TableTh
                sorted={sortBy === "album"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("album")}
              >
                Album
              </TableTh>
              <Table.Th w={hideActions ? 96 : 176}>Duration</Table.Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  {status === ThunkStatus.SUCCEEDED ? (
                    <Text fw={500} ta="center">
                      Nothing found
                    </Text>
                  ) : status === ThunkStatus.FAILED ? (
                    <Text fw={500} ta="center">
                      {error ? error : "An error occurred when fetching table"}
                    </Text>
                  ) : (
                    <Flex justify="center" align="center">
                      <Loader size="xl" type="bars" />
                    </Flex>
                  )}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {totalPages > 1 && (
        <Flex justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
          />
        </Flex>
      )}
    </Flex>
  );
}
