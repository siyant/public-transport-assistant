import mrtStations from "./mrtStations.json";

export function getMrtStations() {
  return mrtStations;
}

export function getStationCodesByName(stationName) {
  const station = mrtStations.find((s) => s.name === stationName);
  if (station) return station.stationCodes;
  else return null;
}
