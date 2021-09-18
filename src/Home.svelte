<script>
  import BusMrtCard from "./BusMrtCard.svelte";

  const trainStations = ["Mayflower", "Ang Mo Kio"];

  const busStops = [54229, 54221];
  const busStopNames = ["Ang Mo Kio Pr Sch", "Opp Ang Mo Kio Pr Sch"];

  let refresh = 0;

  function onRefresh() {
    refresh++;
  }
</script>

<button on:click={onRefresh} class="fab">Refresh</button>

<div class="content-centered">
  <h2>Train arrival</h2>
  {#each trainStations as station}
    <BusMrtCard type="mrt" name={station} {refresh} />
  {/each}

  <div style="height: 20px" />

  <h2>Bus arrival</h2>
  {#each busStops as busStopId, i}
    <BusMrtCard type="bus" name={busStopNames[i]} {busStopId} {refresh} />
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
