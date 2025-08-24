<script>
	export let title = '';
	let isHovered = false;
	let tooltipX = 0;
	let tooltipY = 0;
	// @ts-ignore
	let cell;

	function mouseOver() {
		isHovered = true;
		// @ts-ignore
		const rect = cell.getBoundingClientRect();
		tooltipX = rect.left + rect.width / 2;
		tooltipY = rect.bottom + 8;
	}

	function focusOver() {
		isHovered = true;
		// @ts-ignore
		const rect = cell.getBoundingClientRect();
		tooltipX = rect.left + rect.width / 2;
		tooltipY = rect.bottom + 8;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<div
	bind:this={cell}
	on:mouseover={mouseOver}
	on:mouseleave={mouseLeave}
	on:focus={focusOver}
	on:blur={mouseLeave}
	tabindex="0"
	role="button"
	aria-label="Show tooltip"
	style="display: inline-block; position: relative;"
>
	<slot />
</div>

{#if isHovered}
	<div
		style="position: fixed; left: {tooltipX}px; top: {tooltipY}px; transform: translateX(-50%);"
		class="tooltip"
	>
		{title}
	</div>
{/if}

<style>
	.tooltip {
		border: 1px solid #444;
		box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.25);
		color: #f3f3f3;
		background: #333;
		border-radius: 6px;
		padding: 8px 12px;
		font-size: 0.7rem;
		position: absolute;
		z-index: 1000;
		transition: box-shadow 0.2s;
	}
</style>
