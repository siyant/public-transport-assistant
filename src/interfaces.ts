export interface MrtStation {
  type: "mrt";
  name: string;
  codes: string[];
}

export interface BusStop {
  type: "bus";
  id: string | number;
  name: string;
}

export type TransportNode = MrtStation | BusStop;
