<script>
  import router from "page";
  import Home from "./Home.svelte";
  import Search from "./Search.svelte";

  let page;
  router("/", () => (page = Home));
  router("/search", () => (page = Search));

  router.start();
</script>

<svelte:component this={page} />
