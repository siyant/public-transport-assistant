<script lang="ts">
  import BusMrtCard from "./BusMrtCard.svelte";
  import BusMrtSelector from "./BusMrtSelector.svelte";
  import type { TransportNode } from "./interfaces";

  let selected: TransportNode = null;

  function onSelect(node: TransportNode) {
    selected = node;
  }
</script>

<div class="content-centered">
  <h2>Search for MRT stations</h2>
  <div><BusMrtSelector handleChange={onSelect} /></div>
  {#if selected != null}
    {#key selected}
      <BusMrtCard node={selected} />
    {/key}
  {/if}
</div>
