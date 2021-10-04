<script lang="ts">
  export let codes: string[];

  function getLine(code: string) {
    let line = code.substring(0, 2);
    if (line === "CE") line = "CC"; // special case: circle line extension
    if (line === "CG") line = "EW"; // special case: EWL changi extension
    return line + "L";
  }
</script>

<span class="mrt-code-wrapper">
  {#each codes as code}
    <span class={"mrt-code " + getLine(code)}>{code}</span>
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
  span.mrt-code.NSL {
    background: #f30000;
  }
  span.mrt-code.EWL {
    background: #009c32;
  }
  span.mrt-code.NEL {
    background: #aa00b7;
  }
  span.mrt-code.CCL {
    background: #ff9c00;
    color: black;
  }
  span.mrt-code.DTL {
    background: #0049bf;
  }
  span.mrt-code.TEL {
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
