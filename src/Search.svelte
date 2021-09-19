<script>
  import BusMrtCard from "./BusMrtCard.svelte";
  import BusMrtSelector from "./BusMrtSelector.svelte";

  let selected = null;

  function onSelect(stationName) {
    selected = { type: "mrt", name: stationName };
  }
</script>

<div class="content-centered">
  <h2>Search for MRT stations</h2>
  <div><BusMrtSelector handleChange={onSelect} /></div>
  {#if selected != null}
    {#key selected}
      <BusMrtCard {...selected} />
    {/key}
  {/if}
</div>
