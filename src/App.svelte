<script lang="ts">
  import router from "page";
  import Home from "pages/Home.svelte";
  import Search from "pages/Search.svelte";

  let page;
  router("/", () => (page = Home));
  router("/search", () => (page = Search));

  router.start();
</script>

<svelte:component this={page} />
