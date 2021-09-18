<script>
  import { onMount } from "svelte";
  import * as api from "./data/api.js";

  export let type; // "bus", "mrt"
  export let name;
  export let busStopId = null; // only required if type is "bus"
  export let refresh = null;

  let timings;

  onMount(fetchData);

  $: if (refresh != null) {
    console.log("refreshing");
    fetchData();
  }

  async function fetchData() {
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
  <h3>{name}</h3>

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
            <td class="center {t.next_train_arr === 'N/A' ? 'fade' : ''}">
              {t.next_train_arr ?? ""}
            </td>
            <td class="center {t.subseq_train_arr === 'N/A' ? 'fade' : ''}">
              {t.subseq_train_arr ?? ""}
            </td>
          </tr>
        {/each}
      {:else if type === "bus"}
        {#each timings ?? [] as bus}
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
      {/if}
    </tbody>
  </table>
</div>

<style>
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
</style>
