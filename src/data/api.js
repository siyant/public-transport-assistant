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
  let resultsCleaned = [];

  for (let platform of results) {
    // remove (Interchange) from destination station name
    const interchange = " (Interchange)";
    if (platform.next_train_destination.endsWith(interchange))
      platform.next_train_destination =
        platform.next_train_destination.split(interchange)[0];
    if (platform.subseq_train_destination.endsWith(interchange))
      platform.subseq_train_destination =
        platform.subseq_train_destination.split(interchange)[0];

    if (platform.next_train_arr === "N/A") platform.next_train_arr = "-";
    if (platform.subseq_train_arr === "N/A") platform.subseq_train_arr = "-";

    // handle various cases
    if (platform.next_train_destination === platform.subseq_train_destination) {
      // next train and subsequent train have the same destination

      if (
        platform.next_train_destination === "Do not board" ||
        platform.next_train_destination === "-"
      ) {
        // -> destination is not legit, skip
        continue;
      } else if (
        platform.next_train_arr === "-" &&
        platform.subseq_train_arr === "-"
      ) {
        // -> no more trains for this destination, add to resultsCleaned with next_train_* only
        const { subseq_train_destination, subseq_train_arr, ...nextTrain } =
          platform;
        resultsCleaned.push(nextTrain);
      } else {
        // -> add to resultsCleaned as 1 entry
        resultsCleaned.push(platform);
      }
    } else {
      // next train and subsequent train have different destinations
      const { subseq_train_destination, subseq_train_arr, ...nextTrain } =
        platform;

      // add next train to resultsCleaned if legit
      if (
        platform.next_train_destination !== "" &&
        platform.next_train_destination !== "Do not board" &&
        platform.next_train_arr !== ""
      ) {
        resultsCleaned.push(nextTrain);
      }

      // add subseq train to resultsCleaned if legit
      if (
        subseq_train_destination !== "" &&
        subseq_train_destination !== "Do not board" &&
        subseq_train_arr !== ""
      ) {
        const subseqTrain = Object.assign({}, nextTrain, {
          next_train_destination: subseq_train_destination,
          next_train_arr: subseq_train_arr,
        });
        resultsCleaned.push(subseqTrain);
      }
    }
  }

  resultsCleaned = resultsCleaned.filter(
    (r) => r.next_train_destination !== stationName
  );

  return resultsCleaned;
}

export async function fetchBusArrivalTimes(busStopId) {
  const res = await fetch(`https://arrivelah2.busrouter.sg/?id=${busStopId}`);
  const resJson = await res.json();
  return resJson.services;
}
