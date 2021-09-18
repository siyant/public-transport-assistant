<script>
  import { getStationCodesByName } from "./data/mrtStations";

  export let station;

  let codes = getStationCodesByName(station);
  console.log(codes);
</script>

<span class="mrt-code-wrapper">
  {#each codes as code}
    <span class={"mrt-code " + code.substring(0, 2)}>{code}</span>
  {/each}
</span>

<style>
  span.mrt-code-wrapper {
    margin-right: 6px;
  }
  span.mrt-code {
    background: #6c8671; /* LRTs */
    color: white;
    padding: 2px 6px;
    font-size: 0.8rem;
  }
  span.mrt-code.NS {
    background: #f30000;
  }
  span.mrt-code.EW {
    background: #009c32;
  }
  span.mrt-code.NE {
    background: #aa00b7;
  }
  span.mrt-code.CC {
    background: #ff9c00;
    color: black;
  }
  span.mrt-code.DT {
    background: #0049bf;
  }
  span.mrt-code.TE {
    background: #a65700;
  }
  span.mrt-code:first-of-type {
    border-top-left-radius: 6px 10px;
    border-bottom-left-radius: 6px 10px;
  }
  span.mrt-code:last-of-type {
    border-top-right-radius: 6px 10px;
    border-bottom-right-radius: 6px 10px;
  }
</style>
