import {
  buildColumns,
  CheckboxVisibility,
  DetailsList,
  IColumn,
  Link,
} from "@fluentui/react";
import { Image, ImageFit } from "office-ui-fabric-react/lib/Image";
import * as React from "react";
import { mockAEMData } from "../mockData/AccessEvidenceMetricTableData";
import { AEMEntry } from "../models/AEMEntry";
import Flag from "react-flagkit";
import { countryCodes } from "../data/CountryCode";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import { useId } from "@uifabric/react-hooks";

const calloutProps = { gapSpace: 0 };
// The TooltipHost root uses display: inline by default.
// If that's causing sizing issues or tooltip positioning issues, try overriding to inline-block.
const hostStyles: Partial<ITooltipHostStyles> = {
  root: { display: "inline-block" },
};

export interface IDetailsListCustomColumnsExampleState {
  sortedItems: AEMEntry[];
  columns: IColumn[];
}

export class AEMList extends React.Component<
  {},
  IDetailsListCustomColumnsExampleState
> {
  constructor(props: {}) {
    super(props);

    const items = mockAEMData;
    this.state = {
      sortedItems: items,
      columns: _buildColumns(items),
    };
  }

  public render() {
    const { sortedItems, columns } = this.state;

    return (
      <DetailsList
        items={sortedItems}
        setKey="set"
        columns={columns}
        onRenderItemColumn={_renderItemColumn}
        onColumnHeaderClick={this._onColumnClick}
        onItemInvoked={this._onItemInvoked}
        onColumnHeaderContextMenu={this._onColumnHeaderContextMenu}
        ariaLabelForSelectionColumn="Toggle selection"
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        checkButtonAriaLabel="Row checkbox"
        checkboxVisibility={CheckboxVisibility.hidden}
      />
    );
  }

  private _onColumnClick = (
    event: React.MouseEvent<HTMLElement>,
    column: IColumn
  ): void => {
    const { columns } = this.state;
    let { sortedItems } = this.state;
    let isSortedDescending = column.isSortedDescending;

    // If we've sorted this column, flip it.
    if (column.isSorted) {
      isSortedDescending = !isSortedDescending;
    }

    // Sort the items.
    sortedItems = _copyAndSort(
      sortedItems,
      column.fieldName!,
      isSortedDescending
    );

    // Reset the items and columns to match the state.
    this.setState({
      sortedItems: sortedItems,
      columns: columns.map((col) => {
        col.isSorted = col.key === column.key;

        if (col.isSorted) {
          col.isSortedDescending = isSortedDescending;
        }

        return col;
      }),
    });
  };

  private _onColumnHeaderContextMenu(
    column: IColumn | undefined,
    ev: React.MouseEvent<HTMLElement> | undefined
  ): void {
    console.log(`column ${column!.key} contextmenu opened.`);
  }

  private _onItemInvoked(item: any, index: number | undefined): void {
    alert(`Item ${item.name} at index ${index} has been invoked.`);
  }
}

function _buildColumns(items: AEMEntry[]): IColumn[] {
  const columns = buildColumns(items, true);

  const thumbnailColumn = columns.filter(
    (column) => column.name === "thumbnail"
  )[0];

  // Special case one column's definition.
  if (thumbnailColumn) {
    thumbnailColumn.name = "";
    thumbnailColumn.maxWidth = 50;
    thumbnailColumn.ariaLabel = "Thumbnail";
  }

  const otherColumns = [
    {
      key: "country",
      name: "Country",
      fieldName: "country",
      minWidth: 45,
      maxWidth: 45,
    },
    {
      key: "ta",
      name: "TA",
      fieldName: "TA",
      minWidth: 100,
      maxWidth: 100,
    },
    {
      key: "indication",
      name: "Indication",
      fieldName: "indication",
      minWidth: 155,
      maxWidth: 155,
    },
    {
      key: "subclassification",
      name: "Sub Classification",
      fieldName: "subclassification",
      minWidth: 100,
      maxWidth: 100,
    },
    {
      key: "status",
      name: "Status",
      fieldName: "status",
      minWidth: 20,
      maxWidth: 50,
    },
    {
      key: "modifiedBy",
      name: "Modified By",
      fieldName: "modifiedBy",
      minWidth: 80,
      maxWidth: 80,
    },
    {
      key: "lastModified",
      name: "Last Modified",
      fieldName: "lastModified",
      minWidth: 50,
      maxWidth: 50,
    },
  ];

  return otherColumns;
}

const renderStatus = (fieldContent) => {
  const tooltipId = useId("tooltip-status");
  switch (fieldContent) {
    case "Review":
      return (
        <TooltipHost
          content={"Version 1"}
          id={tooltipId}
          calloutProps={calloutProps}
          styles={hostStyles}
        >
          <div style={{ color: "#309ecd" }}>{fieldContent}</div>
        </TooltipHost>
      );
    case "Draft":
      return (
        <TooltipHost
          content={"Version 2"}
          id={tooltipId}
          calloutProps={calloutProps}
          styles={hostStyles}
        >
          <div style={{ color: "#FFC300" }}>{fieldContent}</div>{" "}
        </TooltipHost>
      );
    case "Final":
      return (
        <TooltipHost
          content={"Version 3"}
          id={tooltipId}
          calloutProps={calloutProps}
          styles={hostStyles}
        >
          <div style={{ color: "#28B463" }}>{fieldContent}</div>{" "}
        </TooltipHost>
      );
  }
};

const renderFlag = (fieldContent) => {
  const tooltipId = useId("tooltip-country");
  const countryCode = countryCodes.filter(
    (country) => country.name === fieldContent && country.code
  )[0].code;
  return (
    <>
      <TooltipHost
        content={fieldContent}
        id={tooltipId}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <Flag country={countryCode} />
      </TooltipHost>
    </>
  );
};

function _renderItemColumn(item: AEMEntry, index: number, column: IColumn) {
  const fieldContent = item[column.fieldName as keyof AEMEntry] as string;

  switch (column.key) {
    case "country":
      return renderFlag(fieldContent);

    case "name":
      return <Link href="#">{fieldContent}</Link>;

    case "status":
      return renderStatus(fieldContent);

    default:
      return <span>{fieldContent}</span>;
  }
}

function _copyAndSort<T>(
  items: T[],
  columnKey: string,
  isSortedDescending?: boolean
): T[] {
  const key = columnKey as keyof T;
  return items
    .slice(0)
    .sort((a: T, b: T) =>
      (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
    );
}
