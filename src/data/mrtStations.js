import mrtStations from "./mrtStations.json";
import mrtFirstLastTrain from "./mrtFirstLastTrain.json";

export function getMrtStations() {
  return mrtStations;
}

export function getStationCodesByName(stationName) {
  const station = mrtStations.find((s) => s.name === stationName);
  if (station) return station.codes;
  else return null;
}

export function getFirstLastTrainByStationName(stationName) {
  return mrtFirstLastTrain[stationName];
}
