import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import classNames from "classnames";
import {
  Modal,
  Group,
  Button,
  TextInput,
  ModalProps,
  ComboboxItem,
  Select,
  SelectProps,
} from "@mantine/core";
import { v4 as uuid } from "uuid";
import * as TablerIcons from "@tabler/icons-react";
import styles from "./AddNewPageModal.module.scss";

import { dbPages } from "../../../repos";
import { Page, ShowParams } from "../../../../types";
import { PAGE_ICONS } from "../../../constants";
import { useAppDispatch } from "../../../hooks";
import { fetchPages, setActivePageID } from "../../../features";

export type AddNewPageModalProps = Pick<ModalProps, "opened" | "onClose">;

// renders the icon with the text
const renderSelectOption: SelectProps["renderOption"] = ({
  option,
  checked,
}): React.ReactNode => {
  const IconComponent =
    (TablerIcons as unknown as Record<string, React.ElementType>)[
      option.value
    ] || TablerIcons.IconPlus; // Fallback to IconPlus

  return (
    <Group flex="1" gap="xs">
      <IconComponent size={18} opacity={0.6} stroke={1.5} />
      {option.label}
      {checked && (
        <TablerIcons.IconCheck style={{ marginInlineStart: "auto" }} />
      )}
    </Group>
  );
};

export default function AddNewPageModal({
  opened,
  onClose,
}: AddNewPageModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [pageName, setPageName] = useState("");
  const [iconOptions, setIconOptions] = useState<ComboboxItem[]>([]);
  const [iconValue, setIconValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showID } = useParams<ShowParams>();

  useEffect(() => {
    // TODO: disable items that are already in-use for this show
    let isMounted = true;
    const data = PAGE_ICONS.map((item) => ({ ...item }));

    if (isMounted) {
      setIconOptions(data);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleIconChange = useCallback((value: string | null) => {
    setIconValue(value);
  }, []);

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      if (!showID) throw new Error("Missing show ID");
      if (!pageName) throw new Error("Missing page name");
      if (!iconValue) throw new Error("Missing icon name");

      const id = uuid();
      const payload: Page = {
        id,
        name: pageName,
        showID,
        iconName: iconValue,
        sortOrder: null,
      };

      await dbPages.addItem(payload);

      // update redux
      dispatch(fetchPages({ showID }));
      dispatch(setActivePageID(id));

      // update route to new page
      navigate(`/main/show/${showID}/page/${id}`);
    } catch (err) {
      console.error("Error when creating page", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, iconValue, navigate, pageName, showID]);

  return (
    <Modal title="Add Page" opened={opened} onClose={onClose}>
      <div className={styles.container}>
        <div className={classNames(styles.row)}>
          <TextInput
            label="Page Name"
            value={pageName}
            onChange={(event) => setPageName(event.currentTarget.value)}
            disabled={loading}
          />
        </div>
        <div className={classNames(styles.row)}>
          <Select
            label="Icon"
            data={iconOptions}
            value={iconValue}
            onChange={handleIconChange}
            searchable
            clearable
            renderOption={renderSelectOption}
          />
        </div>
        <div className={classNames(styles.row, styles.buttonContainer)}>
          <Button
            fullWidth
            disabled={!pageName || !iconValue}
            onClick={handleClick}
            loading={loading}
          >
            Create Page
          </Button>
          <Button
            fullWidth
            color="red"
            variant="outline"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
