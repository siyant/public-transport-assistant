import mrtStations from "./mrtStations.json";
import mrtFirstLastTrain from "./mrtFirstLastTrain.json";
import type { MrtStation } from "../interfaces.js";

export function getMrtStations() {
  return mrtStations;
}

export function getMrtStationByName(stationName: string): MrtStation | null {
  const station = mrtStations.find((s) => s.name === stationName);
  return station ? { ...station, type: "mrt" } : null;
}

export function getStationCodesByName(stationName: string): string[] | null {
  const station = mrtStations.find((s) => s.name === stationName);
  if (station != null) return station.codes;
  else return null;
}

export function getFirstLastTrainByStationName(stationName) {
  return mrtFirstLastTrain[stationName];
}
