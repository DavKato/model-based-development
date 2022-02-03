<script lang="ts">
  import { useSelector } from "@xstate/svelte";
  import { babySitter, events as _evts } from "./babySitter";

  const state = useSelector(babySitter, (state) => state);
  const events: any[] = Object.keys(_evts).filter((e) => e !== "３秒経過");
</script>

<main
  class="w-screen h-screen grid place-items-center grid-rows-[2fr,1fr,1fr,3fr]"
>
  <h1 class="self-end text-center font-bold text-3xl tracking-wider">
    小森ごっこ
  </h1>

  <div id="state-display" class="self-end flex gap-6 items-baseline">
    <p>ただいま</p>
    <p
      class="font-bold font-mono text-2xl border-4 border-red-600 rounded-md px-3 py-2"
    >
      {$state.value}
    </p>
    <p>中</p>
  </div>

  <div class="flex items-baseline gap-4">
    <p>眠気：</p>
    <p class="text-lg px-1 border-b border-indigo-400">
      {$state.context["眠い"] ? "MAX" : "ナシ"}
    </p>
  </div>

  <ul id="events-container" class="self-start mt-4 flex gap-6">
    {#each events as event, i}
      <li>
        <button
          class="rounded-md border-2 border-blue-900 text-blue-900 font-bold px-2 py-1 ring-orange-600"
          class:ring-2={$state.can(event)}
          on:click={() => babySitter.send(event)}
        >
          {event}
        </button>
      </li>
    {/each}
  </ul>
</main>
