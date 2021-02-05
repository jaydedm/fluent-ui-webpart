import { ReactElement } from "react";

export interface AEMEntry {
  id: string;
  country: string;
  TA: string;
  asset: string;
  indication: string;
  subclassification: string;
  status: string;
  version: string;
  modifiedBy: string;
  lastModified: number;
}

export enum AEMEntryStatus {
  REVIEW = "Review",
  DRAFT = "Draft",
  FINAL = "Final",
}
