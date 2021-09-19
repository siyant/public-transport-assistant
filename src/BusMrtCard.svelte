<script>
  import { onMount } from "svelte";
  import MrtCodePill from "./MrtCodePill.svelte";
  import { getFirstLastTrainByStationName } from "./data/mrtStations.js";
  import * as api from "./data/api.js";

  export let type; // "bus", "mrt"
  export let name;
  export let busStopId = null; // only required if type is "bus"
  export let refresh = null;

  let timings;
  let expand;
  let firstLastTrain = getFirstLastTrainByStationName(name);

  onMount(fetchData);

  $: if (refresh > 0) {
    fetchData();
  }

  async function fetchData() {
    timings = null;
    if (type === "mrt") timings = await api.fetchMrtArrivalTimes(name);
    else if (type === "bus")
      timings = await api.fetchBusArrivalTimes(busStopId);
  }

  function renderBusTiming(durationMs) {
    if (durationMs == null) return "";
    const timingMin = Math.floor(durationMs / 60000);
    if (timingMin < 0) return `<span class="fade">Arr</span>`;
    if (timingMin === 0) return "Arr";
    return timingMin;
  }
</script>

<div class="card">
  <h3>
    {#if type === "mrt"}<MrtCodePill station={name} />{/if}<span
      class="vertical-center">{name}</span
    >
  </h3>

  <table>
    <thead>
      <tr>
        {#if type === "mrt"}
          <th>Destination</th>
          <th colspan="2">Timings (min)</th>
        {:else if type === "bus"}
          <th>Bus</th>
          <th colspan="3">Timings (min)</th>
        {/if}
      </tr>
    </thead>

    <tbody>
      {#if type === "mrt"}
        {#each timings ?? [] as t}
          <tr>
            <td>{t.next_train_destination}</td>
            <td class={t.next_train_arr === "N/A" ? "fade" : ""}>
              {t.next_train_arr ?? ""}
            </td>
            <td class={t.subseq_train_arr === "N/A" ? "fade" : ""}>
              {t.subseq_train_arr ?? ""}
            </td>
          </tr>
        {/each}
      {:else if type === "bus"}
        {#each timings ?? [] as bus}
          <tr>
            <td>{bus.no}</td>
            <td>
              {@html renderBusTiming(bus.next.duration_ms)}
            </td>
            <td>
              {@html renderBusTiming(bus.next2.duration_ms)}
            </td>
            <td>
              {@html renderBusTiming(bus.next3.duration_ms)}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>

  {#if type === "mrt"}
    <span
      class={`mini-tab ${expand == "firstTrain" ? "active" : ""}`}
      on:click={() => {
        expand = expand === "firstTrain" ? null : "firstTrain";
      }}
      >First train
    </span>
    <span
      class={`mini-tab ${expand == "lastTrain" ? "active" : ""}`}
      on:click={() => {
        expand = expand === "lastTrain" ? null : "lastTrain";
      }}
      >Last train
    </span>
  {/if}

  {#if expand == "firstTrain" || expand == "lastTrain"}
    <div style="height: 1em" />
    {#each firstLastTrain ?? [] as direction}
      <h4>{"→ " + direction.direction}</h4>
      <table class="tighter">
        <thead>
          <tr>
            {#if Object.keys(direction[expand]).length > 1}<th>Destination</th
              >{/if}
            <th>Mon-Fri</th>
            <th>Sat</th>
            <th>Sun/PH</th>
          </tr>
        </thead>
        <tbody>
          {#each Object.keys(direction[expand]) as destination}
            <tr>
              {#if Object.keys(direction[expand]).length > 1}<td
                  >{destination}</td
                >{/if}
              <td>{direction[expand][destination]["Mon - Fri"] ?? ""}</td>
              <td>{direction[expand][destination]["Sat"] ?? ""}</td>
              <td>{direction[expand][destination]["Sun / PH"] ?? ""}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/each}
  {/if}
</div>

<style>
  table {
    border-collapse: collapse;
    margin-bottom: 1.2em;
  }
  th {
    text-align: center;
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
  table.tighter th,
  table.tighter td {
    padding: 4px;
  }
  table.tighter th {
    font-size: 0.9em;
  }
  .mini-tab {
    color: #5b7153;
    font-size: 0.8em;
    padding: 6px 8px;
    border-radius: 3px;
    cursor: pointer;
  }
  .mini-tab.active {
    text-decoration: underline;
    font-weight: 600;
  }
  .mini-tab:hover {
    background: rgba(233, 234, 225, 0.5);
  }
</style>
