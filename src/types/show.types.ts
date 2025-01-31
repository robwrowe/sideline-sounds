/**
 * A show is a collection of pages
 */
export type Show = {
  /**
   * ID of the show. Must be unique.
   */
  id: string;

  /**
   * Human-readable display name for the show
   */
  name: string;
};

/**
 * A page is a collection of banks in a given show.
 */
export type Page = {
  /**
   * ID of the page. Must be unique.
   */
  id: string;

  /**
   * ID of the show this page belongs to.
   */
  showID: string;

  /**
   * Human-readable display name for the page
   */
  name: string;

  /**
   * Name of the tabler icon to be displayed
   */
  iconName: string;

  /**
   * The sorting order for the page in relation to every other page.
   * If omitted, it will default to sorting by name alphabetically.
   */
  sortOrder: number | null;
};

/**
 * A bank is a collection of buttons in a given page
 */
export type Bank = {
  /**
   * ID of the bank. Must be unique.
   */
  id: string;

  /**
   * ID of the page this bank belongs to
   */
  pageID: string;

  /**
   * Human-readable display name for the bank
   */
  name: string;

  /**
   * The number of rows of buttons on this bank
   */
  numOfRows: number;

  /**
   * The number of columns of buttons on this bank
   */
  numOfCols: number;

  /**
   * The sorting order for the bank in relation to every other bank.
   * If omitted, it will default to sorting by name alphabetically.
   */
  sortOrder: number | null;
};
