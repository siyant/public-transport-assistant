<script>
  import { onMount } from "svelte";
  import BusMrtCard from "./BusMrtCard.svelte";

  const trainStations = ["Mayflower", "Ang Mo Kio"];
  let trainTimings = {};

  const busStops = [54229, 54221];
  const busStopNames = ["Ang Mo Kio Pr Sch", "Opp Ang Mo Kio Pr Sch"];
  let busTimings = {};

  onMount(function () {
    fetchTrainArrivalTimes();
    fetchBusArrivalTimes();
  });

  async function fetchTrainArrivalTimes() {
    for (let station of trainStations) {
      const res = await fetch(
        `https://connectv3.smrt.wwprojects.com/smrt/api/train_arrival_time_by_id/?station=${station}`
      );
      const resJson = await res.json();
      const results = resJson.results;
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
          if (subseq_train_destination !== "") {
            const subseqTrain = Object.assign({}, nextTrain, {
              next_train_destination: subseq_train_destination,
              next_train_arr: subseq_train_arr,
            });
            resultsCleaned.push(subseqTrain);
          }
        }
      }
      trainTimings[station] = resultsCleaned;
    }
  }

  async function fetchBusArrivalTimes() {
    for (let stopId of busStops) {
      const res = await fetch(`https://arrivelah2.busrouter.sg/?id=${stopId}`);
      const resJson = await res.json();
      busTimings[stopId] = resJson.services;
    }
  }

  function handleRefresh() {
    fetchTrainArrivalTimes();
    fetchBusArrivalTimes();
  }
</script>

<button on:click={handleRefresh} class="fab"> Refresh </button>

<div class="content-centered">
  <h2>Train arrival</h2>
  {#each trainStations as station}
    <BusMrtCard
      type="mrt"
      name={station}
      timings={trainTimings[station] ?? []}
    />
  {/each}

  <div style="height: 20px" />

  <h2>Bus arrival</h2>
  {#each busStops as busStop, i}
    <BusMrtCard
      type="bus"
      name={busStopNames[i]}
      timings={busTimings[busStop] ?? []}
    />
  {/each}
</div>

<style>
  button.fab {
    color: #fff;
    background-color: #656d4a;
    outline: none;
    border: none;
    position: fixed;
    right: 10px;
    bottom: 0px;
    height: 40px;
    border-radius: 20px;
    padding: 10px 15px;
  }
</style>
