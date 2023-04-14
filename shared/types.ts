export type Color = string;

export interface Grid {
  tiles: Color[];
  versionstamps: string[];
}

export interface GridUpdate {
  index: number;
  color: Color;
  versionstamp: string;
}
