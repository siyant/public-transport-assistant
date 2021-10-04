<script lang="ts">
  import { getMrtStationByName, getMrtStations } from "./data/mrtStations.js";
  import type { TransportNode } from "./interfaces.js";

  export let handleChange: (node: TransportNode) => void;

  const mrtStationOptions = getMrtStations();
  let selected: string = null;

  function onSelectChange(e) {
    selected = e.target.value;
    const selectedNode = getMrtStationByName(selected);
    handleChange(selectedNode);
  }
</script>

<select value={selected} on:change={onSelectChange}>
  {#each mrtStationOptions as station}
    <option value={station.name}>{station.name}</option>
  {/each}
</select>
