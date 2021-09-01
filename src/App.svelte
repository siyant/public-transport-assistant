<script>
	import { onMount } from 'svelte';
	
	const trainStations = ["Mayflower", "Ang Mo Kio"]
	let trainTimings = {}
	
	const busStops = [54229, 54221]
	const busStopNames = ["Ang Mo Kio Pr Sch", "Opp Ang Mo Kio Pr Sch"] 
	let busTimings = {}
	
	onMount(function() {
    fetchTrainArrivalTimes()
		fetchBusArrivalTimes()
	})
	
	async function fetchTrainArrivalTimes() {
		for (let station of trainStations) {
			const res = await fetch(`https://connectv3.smrt.wwprojects.com/smrt/api/train_arrival_time_by_id/?station=${station}`)
			const resJson = await res.json()
			trainTimings[station] = resJson.results
		}
		console.log(trainTimings)
	}
	
	async function fetchBusArrivalTimes() {
		for (let stopId of busStops) {
			const res = await fetch (`https://arrivelah2.busrouter.sg/?id=${stopId}`)
			const resJson = await res.json()
			busTimings[stopId] = resJson.services
			console.log(resJson)
		}
		console.log(busTimings)
	}
	
	function handleRefresh() {
		fetchTrainArrivalTimes()
		fetchBusArrivalTimes()
	}
	
</script>
<button on:click={handleRefresh}>
	Refresh
</button>

<h2>Train arrival</h2>
{#each trainStations as station}
	<h3>{station}</h3>
	<table>
		<thead>
			<tr>
				<th>Direction</th>
				<th colspan="2">Timings (min)</th>
			</tr>
		</thead>
		<tbody>
			{#each trainTimings[station] ?? [] as t}
	<tr>
		<td>{t.next_train_destination}</td>
		<td class="center">{t.next_train_arr}</td>
		<td class="center">{t.subseq_train_arr}</td>
	</tr>
	{/each}
		</tbody>
	</table>
{/each}

<h2>Bus arrival</h2>
{#each busStops as busStop, i}
	<h3>{busStop} {busStopNames[i]}</h3>
	<table>
		<thead>
			<tr>
				<th>Bus</th>
				<th colspan="3">Timings (min)</th>
			</tr>
		</thead>
		<tbody>
			{#each busTimings[busStop] ?? [] as bus}
			<tr>
				<td>{bus.no}</td>
				<td class="center">{bus.next.duration_ms != null ? Math.floor(bus.next.duration_ms/60000) : ""}</td>
				<td class="center">{bus.next2.duration_ms != null ? Math.floor(bus.next2.duration_ms/60000) : ""}</td>
				<td class="center">{bus.next3.duration_ms != null ? Math.floor(bus.next3.duration_ms/60000) : ""}</td>
			</tr>
			{/each}
		</tbody>
	</table>
{/each}

<style>
	table {border-collapse: collapse;}
	th {text-align: left;}
	td {text-align: center;}
	td:first-of-type, th:first-of-type {text-align: left; }
	th, td {padding: 5px 10px; border-bottom: 1px solid #e8e9ea;}
</style>