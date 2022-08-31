import { Doc } from "./doc.model";

export interface DocGroup {
    id: string;
    displayedVersion: number;
    docArray: Doc[];
  }