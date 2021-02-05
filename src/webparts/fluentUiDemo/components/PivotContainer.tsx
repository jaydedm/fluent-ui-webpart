import * as React from "react";
import { Label, ILabelStyles } from "@fluentui/react";
import { Pivot, PivotItem } from "@fluentui/react";
import { IStyleSet } from "@fluentui/react";
import { AEMList } from "./AEMList";
import FluentUiDemo from "./FluentUiDemo";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};

export const PivotContainer = () => {
  return (
    <Pivot aria-label="Basic Pivot Example">
      <PivotItem
        headerText="Guidance"
        headerButtonProps={{
          "data-order": 1,
          "data-title": "My Files Title",
        }}
      >
        <FluentUiDemo description={"This is Fluent UI by Microsoft"} />
      </PivotItem>
      <PivotItem headerText="AEM">
        <Label styles={labelStyles}>
          <AEMList></AEMList>
        </Label>
      </PivotItem>
      <PivotItem headerText="AEM Summaries">
        <Label styles={labelStyles}>Pivot #3</Label>
      </PivotItem>
    </Pivot>
  );
};

export default PivotContainer;
