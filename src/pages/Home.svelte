<script lang="ts">
  import type { BusStop, MrtStation } from "interfaces";

  import BusMrtCard from "components/BusMrtCard.svelte";

  const mrtStations: MrtStation[] = [
    { type: "mrt", name: "Mayflower", codes: ["TE6"] },
    { type: "mrt", name: "Ang Mo Kio", codes: ["NS16"] },
  ];

  const busStops: BusStop[] = [
    { type: "bus", id: 54229, name: "Ang Mo Kio Pr Sch" },
    { type: "bus", id: 54221, name: "Opp Ang Mo Kio Pr Sch" },
  ];

  let refresh = 0;
  let lastRefresh = new Date().getTime();

  // Checks every 3s if it has been 15s since the last update (either forced update by pressing the refresh button or
  // through the auto-refresh)
  setInterval(refreshTimer, 3 * 1000);

  async function refreshTimer() {
    if (new Date().getTime() - lastRefresh > 15 * 1000) {
      refresh++;
      lastRefresh = new Date().getTime();
    }
  }

  function onRefresh() {
    refresh++;
    lastRefresh = new Date().getTime();
  }
</script>

<button on:click={onRefresh} class="fab">Refresh</button>

<div class="content-centered">
  <h2>Train arrival</h2>
  {#each mrtStations as station}
    <BusMrtCard node={station} {refresh} />
  {/each}

  <div style="height: 20px" />

  <h2>Bus arrival</h2>
  {#each busStops as busStop}
    <BusMrtCard node={busStop} {refresh} />
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
