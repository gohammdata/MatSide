<script setup lang="ts">
import { computed, ref } from "vue";
import { events, platforms, rankings, tournaments } from "./data";
import type { Category, WrestlingEvent } from "./types";
type View = "Home" | "Schedule" | "Tournaments" | "Rankings" | "Watch";
const view = ref<View>("Home"),
  category = ref<"All" | Category>("All"),
  search = ref(""),
  selected = ref<WrestlingEvent | null>(null),
  scheduleFilter = ref<"all" | "saved">("all");
const saved = ref<string[]>(
    JSON.parse(localStorage.getItem("matside:saved") || "[]"),
  ),
  subscriptions = ref<string[]>(
    JSON.parse(
      localStorage.getItem("matside:platforms") || '["ESPN+","FLO","B1G+"]',
    ),
  );
const nav: View[] = ["Home", "Schedule", "Tournaments", "Rankings", "Watch"],
  cats: Array<"All" | Category> = [
    "All",
    "College",
    "International",
    "High School",
  ];
const filtered = computed(() =>
  events.filter(
    (e) =>
      (category.value === "All" || e.category === category.value) &&
      `${e.home.name} ${e.away.name} ${e.label}`
        .toLowerCase()
        .includes(search.value.toLowerCase()) &&
      (view.value !== "Schedule" ||
        scheduleFilter.value === "all" ||
        saved.value.includes(e.id)),
  ),
);
const tonight = computed(() =>
    filtered.value.filter((e) => e.status !== "tomorrow"),
  ),
  featured = computed(() => filtered.value.filter((e) => e.featured)),
  available = computed(() =>
    events.filter((e) => subscriptions.value.includes(e.platform)),
  ),
  ranked = computed(() => tonight.value.reduce((s, e) => s + e.ranked, 0));
const title = (e: WrestlingEvent) =>
  `${e.home.rank ? "#" + e.home.rank + " " : ""}${e.home.name} vs ${e.away.rank ? "#" + e.away.rank + " " : ""}${e.away.name}`;
function save(id: string) {
  saved.value = saved.value.includes(id)
    ? saved.value.filter((x) => x !== id)
    : [...saved.value, id];
  localStorage.setItem("matside:saved", JSON.stringify(saved.value));
}
function platform(id: string) {
  subscriptions.value = subscriptions.value.includes(id)
    ? subscriptions.value.filter((x) => x !== id)
    : [...subscriptions.value, id];
  localStorage.setItem(
    "matside:platforms",
    JSON.stringify(subscriptions.value),
  );
}
function go(v: View) {
  view.value = v;
  scrollTo({ top: 0, behavior: "smooth" });
}
</script>
<template>
  <div class="app-shell">
    <header class="topbar">
      <button class="brand" @click="go('Home')">
        <span class="diamond"><i /></span><b>MAT<em>SIDE</em></b>
      </button>
      <nav>
        <button
          v-for="n in nav"
          :key="n"
          :class="{ active: view === n }"
          @click="go(n)"
        >
          <span>{{
            {
              Home: "⌂",
              Schedule: "□",
              Tournaments: "♜",
              Rankings: "▥",
              Watch: "▷",
            }[n]
          }}</span
          >{{ n }}
        </button>
      </nav>
      <label class="search"
        >⌕<input v-model="search" placeholder="Search teams, events…" /><kbd
          >⌘ K</kbd
        ></label
      ><button class="bell">♧<i v-if="saved.length" /></button
      ><button class="avatar">JM</button>
    </header>
    <main class="page">
      <template v-if="view === 'Home'">
        <section class="hero">
          <div>
            <p class="eyebrow">Saturday, November 7</p>
            <h1>Your personalized <em>wrestling dashboard.</em></h1>
            <p>Upcoming events, ranked matchups, and streaming information in one place.</p>
          </div>
          <div class="tabs">
            <button
              v-for="c in cats"
              :key="c"
              :class="{ active: category === c }"
              @click="category = c"
            >
              {{ c }}
            </button>
          </div>
        </section>
        <section class="panel">
          <header class="panel-head">
            <div>
              <p class="eyebrow">Daily summary</p>
              <h2>Tonight's event overview</h2>
            </div>
            <b class="date"><small>Saturday</small>NOV 7</b>
          </header>
          <div class="stats">
            <div>
              <b>{{ String(tonight.length).padStart(2, "0") }}</b
              ><span>Events<br />tonight</span>
            </div>
            <div>
              <b>{{ String(ranked).padStart(2, "0") }}</b
              ><span>Ranked<br />matchups</span>
            </div>
            <div>
              <b>{{ String(saved.length).padStart(2, "0") }}</b
              ><span>Saved<br />events</span>
            </div>
            <div>
              <b>{{ String(subscriptions.length).padStart(2, "0") }}</b
              ><span>Streaming<br />platforms</span>
            </div>
          </div>
          <div class="lineup-layout">
            <div>
              <div class="section-title">
                <div>
                  <p class="eyebrow">Upcoming events</p>
                  <h2>Tonight's schedule</h2>
                </div>
                <button @click="go('Schedule')">View full schedule →</button>
              </div>
              <div class="lineup">
                <button
                  v-for="e in tonight.slice(0, 3)"
                  :key="e.id"
                  @click="selected = e"
                >
                  <span class="time"
                    ><small>{{ e.status }}</small
                    ><b>{{ e.time }}</b></span
                  ><span class="badges"
                    ><i :style="{ background: e.home.color }">{{
                      e.home.short
                    }}</i
                    ><i :style="{ background: e.away.color }">{{
                      e.away.short
                    }}</i></span
                  ><span class="match"
                    ><small>{{ e.label }}</small
                    ><b>{{ title(e) }}</b
                    ><em>{{ e.venue }}</em></span
                  ><strong>{{ e.platform }}</strong
                  ><span>›</span>
                </button>
              </div>
            </div>
            <aside>
              <span class="signal">◉</span>
              <p class="eyebrow">Streaming window</p>
              <h3>6:00–11:30 PM</h3>
              <p>
                {{ tonight.length }} events across
                {{ subscriptions.length }} platforms
              </p>
              <div>
                <span>▮ {{ saved.length }} saved events</span
                ><button @click="go('Watch')">Manage →</button>
              </div>
              <small>Available on</small><b>{{ subscriptions.join(" · ") }}</b>
            </aside>
          </div>
        </section>
        <section class="content">
          <div class="section-title">
            <div>
              <p class="eyebrow">Event schedule</p>
              <h2>Upcoming & live</h2>
            </div>
            <button class="outline" @click="go('Schedule')">
              Full schedule
            </button>
          </div>
          <div v-if="tonight.length" class="event-grid">
            <article
              v-for="e in tonight"
              :key="e.id"
              class="event"
              @click="selected = e"
            >
              <div class="event-time">
                <small :class="e.status">{{ e.status }}</small
                ><b>{{ e.time }}</b>
              </div>
              <div class="event-main">
                <span class="badges"
                  ><i :style="{ background: e.home.color }">{{
                    e.home.short
                  }}</i
                  ><i :style="{ background: e.away.color }">{{
                    e.away.short
                  }}</i></span
                >
                <div>
                  <small>{{ e.label }}</small>
                  <h3>{{ title(e) }}</h3>
                  <p>{{ e.venue }}</p>
                </div>
              </div>
              <div class="event-action">
                <b>{{ e.platform }}</b
                ><button
                  :class="{ saved: saved.includes(e.id) }"
                  @click.stop="save(e.id)"
                >
                  ▮</button
                ><span>›</span>
              </div>
            </article>
          </div>
          <p v-else class="empty">No matchups found.</p>
        </section>
        <section class="content">
          <div class="section-title">
            <div>
              <p class="eyebrow">Recommended events</p>
              <h2>Viewing recommendations</h2>
            </div>
            <span>Based on your interests</span>
          </div>
          <div class="recommendations">
            <article v-for="e in featured" :key="e.id" @click="selected = e">
              <button
                :class="{ saved: saved.includes(e.id) }"
                @click.stop="save(e.id)"
              >
                ▮
              </button>
              <div class="badges">
                <i :style="{ background: e.home.color }">{{ e.home.short }}</i
                ><span>×</span
                ><i :style="{ background: e.away.color }">{{ e.away.short }}</i>
              </div>
              <p class="eyebrow">{{ e.label }}</p>
              <h3>{{ title(e) }}</h3>
              <p>{{ e.status }} · {{ e.time }} ET</p>
              <footer>
                <b>{{ e.platform }}</b
                >{{ e.recommendation }}
              </footer>
            </article>
          </div>
        </section>
        <section class="platform-strip">
          <div>
            <p class="eyebrow">Streaming services</p>
            <h2>Events available on your services</h2>
          </div>
          <div>
            <b
              v-for="p in platforms"
              :key="p.id"
              :class="{ muted: !subscriptions.includes(p.id) }"
              >{{ p.name }}</b
            >
          </div>
          <button class="outline" @click="go('Watch')">
            ⚙ Manage platforms
          </button>
        </section>
      </template>
      <template v-else-if="view === 'Schedule'"
        ><header class="page-header">
          <p class="eyebrow">Event schedule</p>
          <h1>Full <em>schedule.</em></h1>
          <p>Browse scheduled duals, showcases, and championship events.</p>
        </header>
        <div class="toolbar">
          <div class="tabs">
            <button
              :class="{ active: scheduleFilter === 'all' }"
              @click="scheduleFilter = 'all'"
            >
              All events</button
            ><button
              :class="{ active: scheduleFilter === 'saved' }"
              @click="scheduleFilter = 'saved'"
            >
              Saved · {{ saved.length }}
            </button>
          </div>
          <span>{{ filtered.length }} events</span>
        </div>
        <section
          v-for="group in ['tonight', 'tomorrow']"
          :key="group"
          class="day"
        >
          <h2>
            {{ group }}
            <small>{{ group === "tonight" ? "NOV 7" : "NOV 8" }}</small>
          </h2>
          <article
            v-for="e in filtered.filter((x) =>
              group === 'tomorrow'
                ? x.status === 'tomorrow'
                : x.status !== 'tomorrow',
            )"
            :key="e.id"
            class="event wide"
            @click="selected = e"
          >
            <div class="event-time">
              <small :class="e.status">{{ e.status }}</small
              ><b>{{ e.time }}</b>
            </div>
            <div class="event-main">
              <span class="badges"
                ><i :style="{ background: e.home.color }">{{ e.home.short }}</i
                ><i :style="{ background: e.away.color }">{{
                  e.away.short
                }}</i></span
              >
              <div>
                <small>{{ e.label }}</small>
                <h3>{{ title(e) }}</h3>
                <p>{{ e.venue }}</p>
              </div>
            </div>
            <div class="event-action">
              <b>{{ e.platform }}</b
              ><button
                :class="{ saved: saved.includes(e.id) }"
                @click.stop="save(e.id)"
              >
                ▮</button
              ><span>›</span>
            </div>
          </article>
        </section></template
      >
      <template v-else-if="view === 'Tournaments'"
        ><header class="page-header">
          <p class="eyebrow">Tournament calendar</p>
          <h1>Upcoming <em>tournaments.</em></h1>
          <p>Browse tournament dates, locations, fields, and streaming services.</p>
        </header>
        <div class="tournament-grid">
          <article v-for="t in tournaments" :key="t.name">
            <header>
              <span>Upcoming</span><b>{{ t.date }}</b>
            </header>
            <h2>{{ t.name }}</h2>
            <p>⌖ {{ t.location }}</p>
            <p>♟ {{ t.field }}</p>
            <footer>
              <span>◉ {{ t.platform }}</span
              ><button>Follow event</button>
            </footer>
          </article>
        </div></template
      >
      <template v-else-if="view === 'Rankings'"
        ><header class="page-header">
          <p class="eyebrow">MatSide team index</p>
          <h1>Team <em>rankings.</em></h1>
          <p>Current dual-team rankings and week-over-week movement.</p>
        </header>
        <div class="rankings">
          <header>
            <span>Rank</span><span>Team</span><span>Conference</span
            ><span>Record</span><span>Move</span>
          </header>
          <div v-for="r in rankings" :key="r.team">
            <b>{{ String(r.rank).padStart(2, "0") }}</b
            ><strong>{{ r.team }}</strong
            ><span>{{ r.conference }}</span
            ><span>{{ r.record }}</span
            ><em :class="r.movement > 0 ? 'up' : r.movement < 0 ? 'down' : ''"
              >{{ r.movement > 0 ? "↑" : r.movement < 0 ? "↓" : "—" }}
              {{ Math.abs(r.movement) || "" }}</em
            >
          </div>
        </div></template
      >
      <template v-else
        ><header class="page-header">
          <p class="eyebrow">Streaming preferences</p>
          <h1>Streaming <em>services.</em></h1>
          <p>
            Select your platforms and MatSide will prioritize what you can
            stream.
          </p>
        </header>
        <div class="platform-picker">
          <button
            v-for="p in platforms"
            :key="p.id"
            :class="{ selected: subscriptions.includes(p.id) }"
            @click="platform(p.id)"
          >
            <i :style="{ color: p.color }">▻</i><b>{{ p.name }}</b
            ><small>{{ p.description }}</small
            ><span>{{ subscriptions.includes(p.id) ? "✓" : "" }}</span>
          </button>
        </div>
        <section class="content">
          <div class="section-title">
            <div>
              <p class="eyebrow">Included tonight</p>
              <h2>{{ available.length }} events on your platforms</h2>
            </div>
          </div>
          <div class="event-grid">
            <article
              v-for="e in available"
              :key="e.id"
              class="event"
              @click="selected = e"
            >
              <div class="event-time">
                <small>{{ e.status }}</small
                ><b>{{ e.time }}</b>
              </div>
              <div class="event-main">
                <span class="badges"
                  ><i :style="{ background: e.home.color }">{{
                    e.home.short
                  }}</i
                  ><i :style="{ background: e.away.color }">{{
                    e.away.short
                  }}</i></span
                >
                <div>
                  <small>{{ e.label }}</small>
                  <h3>{{ title(e) }}</h3>
                  <p>{{ e.venue }}</p>
                </div>
              </div>
              <div class="event-action">
                <b>{{ e.platform }}</b
                ><span>›</span>
              </div>
            </article>
          </div>
        </section></template
      >
    </main>
    <footer class="site-footer">
      <div class="brand">
        <span class="diamond"><i /></span><b>MAT<em>SIDE</em></b>
      </div>
      <p>Wrestling event tracking and streaming guide.</p>
      <span>© 2026 MatSide</span>
    </footer>
    <div v-if="selected" class="modal-bg" @click.self="selected = null">
      <section class="modal">
        <button class="close" @click="selected = null">×</button>
        <p class="eyebrow">{{ selected.label }}</p>
        <div class="modal-teams">
          <div>
            <i :style="{ background: selected.home.color }">{{
              selected.home.short
            }}</i
            ><b
              ><small v-if="selected.home.rank">#{{ selected.home.rank }}</small
              >{{ selected.home.name }}</b
            >
          </div>
          <span>VS</span>
          <div>
            <i :style="{ background: selected.away.color }">{{
              selected.away.short
            }}</i
            ><b
              ><small v-if="selected.away.rank">#{{ selected.away.rank }}</small
              >{{ selected.away.name }}</b
            >
          </div>
        </div>
        <div class="modal-meta">
          <span>◉ {{ selected.time }} · {{ selected.platform }}</span
          ><span>⌖ {{ selected.venue }}</span>
        </div>
        <p v-if="selected.recommendation" class="note">
          {{ selected.recommendation }}
        </p>
        <footer>
          <button
            class="outline"
            :class="{ saved: saved.includes(selected.id) }"
            @click="save(selected.id)"
          >
            {{ saved.includes(selected.id) ? "Saved" : "Save event" }}</button
          ><button class="primary">Watch on {{ selected.platform }} ↗</button>
        </footer>
      </section>
    </div>
  </div>
</template>
