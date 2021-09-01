<script>
  import { onMount } from "svelte";

  const trainStations = ["Mayflower", "Mountbatten"];
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

  function renderBusTiming(durationMs) {
    if (durationMs == null) return "";
    const timingMin = Math.floor(durationMs / 60000);
    if (timingMin < 0) return `<span class="fade">Arr</span>`;
    if (timingMin === 0) return "Arr";
    return timingMin;
  }
</script>

<button on:click={handleRefresh} class="fab"> Refresh </button>

<div class="content-centered">
  <h2>Train arrival</h2>
  {#each trainStations as station}
    <div class="card">
      <h3>{station}</h3>
      <table>
        <thead>
          <tr>
            <th>Destination</th>
            <th colspan="2">Timings (min)</th>
          </tr>
        </thead>
        <tbody>
          {#each trainTimings[station] ?? [] as t}
            <tr>
              <td>{t.next_train_destination}</td>
              <td class="center {t.next_train_arr === 'N/A' ? 'fade' : ''}">
                {t.next_train_arr ?? ""}
              </td>
              <td class="center {t.subseq_train_arr === 'N/A' ? 'fade' : ''}">
                {t.subseq_train_arr ?? ""}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/each}
  <div style="height: 20px" />

  <h2>Bus arrival</h2>
  {#each busStops as busStop, i}
    <div class="card">
      <h3>{busStop} {busStopNames[i]}</h3>
      <table>
        <thead>
          <tr>
            <th>Bus</th>
            <th colspan="3">Timings (min)</th>
          </tr>
        </thead>
        <tbody>
          {#each busTimings[busStop] ?? [] as bus}
            <tr>
              <td>{bus.no}</td>
              <td class="center">
                {@html renderBusTiming(bus.next.duration_ms)}
              </td>
              <td class="center">
                {@html renderBusTiming(bus.next2.duration_ms)}
              </td>
              <td class="center">
                {@html renderBusTiming(bus.next3.duration_ms)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/each}
</div>

<style>
  :global(body) {
    background-color: #e9eae1;
    padding: 0;
  }

  :global(h2, h3) {
    margin-top: 0;
    margin-bottom: 0.8em;
  }

  :global(button:hover) {
    cursor: pointer;
  }

  :global(.fade) {
    color: #aaa;
  }

  h2 {
    font-weight: lighter;
  }
  h3 {
    font-weight: normal;
  }

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

  table {
    border-collapse: collapse;
  }
  th {
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid #909970;
  }
  td {
    text-align: center;
    border-bottom: 1px solid #e9eae1;
  }
  td:first-of-type,
  th:first-of-type {
    text-align: left;
  }
  th,
  td {
    padding: 6px 10px;
  }
  tr:last-of-type td {
    border-bottom: none;
  }

  div.card {
    width: 340px;
    max-width: 100vw;
    min-width: 300px;
    box-sizing: border-box;
    display: inline-block;
    background: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }

  div.content-centered {
    margin: 20px auto;
    width: min-content;
  }

  @media (min-width: 760px) {
    div.content-centered {
      width: 700px;
    }
    div.card {
      margin-right: 10px;
    }
  }
</style>
