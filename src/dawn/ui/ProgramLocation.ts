
export interface ProgramLocation {
  column: number;
  row: number;
  span?: number; // Number of chars after location to include
}
