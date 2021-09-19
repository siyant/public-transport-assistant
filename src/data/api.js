export async function fetchMrtArrivalTimes(stationName) {
  let results = [];

  // sometimes, the API will randomly return 1 result with mrt: "Lavender" and platform_ID: "".
  // if this happens, try again up to 2 more times
  for (let attempts = 0; attempts < 3; attempts++) {
    const res = await fetch(
      `https://connectv3.smrt.wwprojects.com/smrt/api/train_arrival_time_by_id/?station=${stationName}`
    );
    const resJson = await res.json();

    if (resJson.results.length > 0 && resJson.results[0].platform_ID === "") {
      continue;
    } else {
      results = resJson.results;
      break;
    }
  }
  const resultsCleaned = [];

  for (let platform of results) {
    // remove (Interchange) from destination station name
    const interchange = " (Interchange)";
    if (platform.next_train_destination.endsWith(interchange))
      platform.next_train_destination =
        platform.next_train_destination.split(interchange)[0];
    if (platform.subseq_train_destination.endsWith(interchange))
      platform.subseq_train_destination =
        platform.subseq_train_destination.split(interchange)[0];

    // handle various cases
    if (platform.next_train_destination === "N/A") {
      // no more trains at the platform -> skip
      continue;
    } else if (
      // next train and subsequent train have the same destination
      // -> add to resultsCleaned as 1 entry
      platform.next_train_destination === platform.subseq_train_destination
    ) {
      resultsCleaned.push(platform);
    } else {
      // next train and subsequent train have different destinations
      // -> add to resultsCleaned as 2 entries
      const { subseq_train_destination, subseq_train_arr, ...nextTrain } =
        platform;
      resultsCleaned.push(nextTrain);
      if (
        subseq_train_destination !== "" &&
        subseq_train_destination !== "Do not board"
      ) {
        const subseqTrain = Object.assign({}, nextTrain, {
          next_train_destination: subseq_train_destination,
          next_train_arr: subseq_train_arr,
        });
        resultsCleaned.push(subseqTrain);
      }
    }
  }

  return resultsCleaned;
}

export async function fetchBusArrivalTimes(busStopId) {
  const res = await fetch(`https://arrivelah2.busrouter.sg/?id=${busStopId}`);
  const resJson = await res.json();
  return resJson.services;
}
