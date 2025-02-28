import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import {
  Checkbox,
  Flex,
  keys,
  Loader,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Pagination,
} from "@mantine/core";

import {
  AudioFile,
  BaseInitialStateThunk,
  Output,
  ThunkStatus,
} from "../../../types";

import TableTh from "./TableTh";
import TableTr from "./TableTr";
import { dbAudioFiles } from "../../repos";
import openAudioFileDeleteModal from "./AudioFileDeleteModal";
import { modals } from "@mantine/modals";
import { openAudioFileModal } from "../../modals";
import { RootState } from "../../store";

type SortKeys = keyof Pick<AudioFile, "title" | "artist" | "album">;

function filterData(data: AudioFile[], search: string) {
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
  data: AudioFile[],
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
  data: AudioFile[];
  hideActions?: boolean;
  hideCheckbox?: boolean;
  itemsPerPage?: number;
  fetchData?: () => Promise<void>;
  state?: RootState["audioEngine"];
  output?: Output;
};

export default function AudioFilesTable({
  data,
  status,
  error,
  hideActions = false,
  hideCheckbox = false,
  itemsPerPage = 20,
  fetchData,
  state,
  output = Output.PGM_A,
}: AudioFilesTableProps) {
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
    async (filePath: string, audioFile?: AudioFile) => {
      window.audio.sendAudioEngine("play", filePath, {
        audioFile,
        crossfadeDuration: 0,
      });
    },
    []
  );

  const handleClickStop = useCallback(() => {
    window.audio.sendAudioEngine("stop");
  }, []);

  const handleClickEditSubmit = useCallback(
    async (item: AudioFile) => {
      try {
        await dbAudioFiles.updateItem(item);

        // update redux
        if (fetchData) {
          fetchData();
        }

        // update other renderer processes
        window.broadcast.sendEvent("fetch", "audioFiles");

        // close modal
        modals.close(`edit-audio-file-${item.id}`);
      } catch (err) {
        alert(`An error occurred when attempting to edit audio file.`);
        console.error(
          "Error occurred when attempting to edit audio file",
          "id",
          item.id,
          "Error",
          err
        );
      }
    },
    [fetchData]
  );

  const handleClickDeleteConfirm = useCallback(
    async (id: string) => {
      try {
        await dbAudioFiles.deleteItem(id);

        // update redux
        if (fetchData) {
          fetchData();
        }

        // update other renderer processes
        window.broadcast.sendEvent("fetch", "audioFiles");

        // close modal
        modals.close(`delete-audio-file-${id}`);
      } catch (err) {
        alert(`An error occurred when attempting to delete audio file.`);
        console.error(
          "Error occurred when attempting to delete audio file",
          "id",
          id,
          "Error",
          err
        );
      }
    },
    [fetchData]
  );

  // pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const rows = paginatedData.map((row) => {
    const audioFileId = state?.[Output.PGM_A]?.current?.metadata?.audioFile?.id;
    const timeRemaining = state?.[Output.PGM_A]?.current?.remaining;

    return (
      <TableTr
        key={row.id}
        row={row}
        hideActions={hideActions}
        hideCheckbox={hideCheckbox}
        onClickPlay={() => handleClickPlay(row.filePath, row)}
        onClickStop={handleClickStop}
        onClickEdit={() =>
          openAudioFileModal(row.filePath, {
            title: "Edit Audio File",
            id: `edit-audio-file-${row.id}`,
            props: {
              defaultValues: row,
              onConfirm: (item) => handleClickEditSubmit(item),
              labels: { confirm: "Save Changes" },
              confirmButtonProps: { leftSection: undefined },
            },
          })
        }
        onClickDelete={() =>
          openAudioFileDeleteModal({
            id: row.id,
            fileName: row.title,
            props: { onConfirm: () => handleClickDeleteConfirm(row.id) },
          })
        }
        isPlaying={
          audioFileId === row.id &&
          timeRemaining !== undefined &&
          timeRemaining !== null &&
          timeRemaining > 0
        }
      />
    );
  });

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
          tabularNums
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
