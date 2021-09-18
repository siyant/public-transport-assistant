<script>
  import getMrtStations from "./data/mrtStations";

  export let handleChange;

  const mrtStationOptions = getMrtStations();
  let selected = null;
</script>

<select
  value={selected}
  on:change={(e) => {
    selected = e.target.value;
    handleChange(selected);
  }}
>
  {#each mrtStationOptions as station}
    <option value={station.name}>{station.name}</option>
  {/each}
</select>
