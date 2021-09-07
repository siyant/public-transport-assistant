<script>
  import router from "page";
  import Home from "./Home.svelte";

  let page;
  router("/", () => (page = Home));

  router.start();
</script>

<svelte:component this={page} />
