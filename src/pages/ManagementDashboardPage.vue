<script setup lang="ts">
import { computed } from "vue";
import demoData from "../data/demo-data.json";

const props = defineProps<{ userName: string }>();
const emit = defineEmits<{ (event: "navigate", path: string): void }>();
const dashboard = demoData.dashboard;
const job = dashboard.featuredJob;
const firstName = computed(() => props.userName.trim().split(/\s+/)[0] || "Team");
const money = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
</script>

<template>
  <div class="content operations-dashboard">
    <header class="operations-hero">
      <div>
        <p class="hero-kicker">MANAGEMENT CONTROL ROOM <span>LOCAL DEMO</span></p>
        <h1>Good morning, {{ firstName }}.</h1>
        <p>One view of every order, production handoff, deadline, and peso.</p>
      </div>
      <button type="button" @click="emit('navigate', '/CustomerInquiry/new-entry')">
        New inquiry <b>+</b>
      </button>
      <small>AFHIM <i>·</i> CLOTHING & PRINTING SERVICES INC.</small>
    </header>

    <section class="dashboard-section" aria-labelledby="pulse-title">
      <div class="section-heading">
        <div><p class="eyebrow">BUSINESS PULSE</p><h2 id="pulse-title">The work, in motion</h2></div>
        <button class="section-link" type="button" @click="emit('navigate', '/Reports')">Management reports <span>→</span></button>
      </div>
      <div class="pulse-grid">
        <button type="button" @click="emit('navigate', '/JobOrders')">
          <span>MONTH-TO-DATE SALES</span><strong>{{ money(dashboard.sales.monthToDate) }}</strong>
          <small class="good">+{{ dashboard.sales.monthChange }}% <i>vs last month</i></small>
        </button>
        <button type="button" @click="emit('navigate', '/Quotations')">
          <span>PENDING QUOTATIONS</span><strong>{{ dashboard.sales.pendingQuotations }} <em>offers</em></strong>
          <small>{{ dashboard.sales.newInquiries }} new inquiries</small>
        </button>
        <button type="button" @click="emit('navigate', '/Production')">
          <span>ACTIVE JOB ORDERS</span><strong>{{ dashboard.production.activeOrders }}</strong>
          <small class="risk">{{ dashboard.production.overdueOrders }} overdue · {{ dashboard.production.dueSoonOrders }} due soon</small>
        </button>
        <button type="button" @click="emit('navigate', '/Finance')">
          <span>COLLECTED THIS MONTH</span><strong>{{ money(dashboard.finance.collectedThisMonth) }}</strong>
          <small>{{ money(dashboard.finance.outstandingReceivables) }} receivable</small>
        </button>
      </div>
    </section>

    <section class="dashboard-section production-section" aria-labelledby="production-title">
      <div class="section-heading">
        <div><p class="eyebrow">PRODUCTION CONTROL</p><h2 id="production-title">Every handoff has a place</h2></div>
        <button class="section-link" type="button" @click="emit('navigate', '/Production')">Open production planner <span>→</span></button>
      </div>
      <div class="stage-strip" role="list" aria-label="Active jobs by production stage">
        <div v-for="(stage, index) in dashboard.production.stages" :key="stage.name" role="listitem" class="stage-cell">
          <div><small>{{ String(index + 1).padStart(2, "0") }}</small><b>{{ stage.count }}</b></div>
          <strong>{{ stage.name }}</strong><small>{{ stage.count === 1 ? "job" : "jobs" }}</small>
          <i><span :style="{ width: `${Math.max(14, (stage.count / dashboard.production.activeOrders) * 100)}%` }"></span></i>
        </div>
      </div>
      <p class="release-gate"><b>RELEASE GATE</b> Approved artwork and material reservation are required before production starts.</p>
    </section>

    <div class="dashboard-columns">
      <section class="job-panel" aria-labelledby="job-heading">
        <div class="panel-heading">
          <div><p class="eyebrow">CEO / MANAGEMENT VIEW</p><h2 id="job-heading">One job. The whole story.</h2></div>
          <span class="priority">{{ job.priority }}</span>
        </div>
        <div class="job-heading-row">
          <div><small class="job-id">{{ job.id }}</small><h3>{{ job.project }}</h3><p>{{ job.client }} <i>·</i> {{ job.orderedQuantity }} pieces</p></div>
          <div class="job-due"><small>DUE {{ job.dueDate }}</small><strong>{{ job.stage }}</strong></div>
        </div>
        <div class="progress-label"><span>Production progress</span><b>{{ job.progress }}%</b></div>
        <div class="progress-track"><span :style="{ width: `${job.progress}%` }"></span></div>
        <div class="job-trail" aria-label="Job order timeline">
          <div v-for="(stage, index) in job.trail" :key="stage" :class="{ done: index < 6, current: index === 6 }"><i></i><span>{{ stage }}</span></div>
        </div>
        <div class="job-metrics">
          <div><small>ORDER VALUE</small><strong>{{ money(job.orderValue) }}</strong><span>Collected {{ money(job.collected) }}</span></div>
          <div><small>BALANCE DUE</small><strong>{{ money(job.balance) }}</strong><span>Finance clearance required</span></div>
          <div><small>QC PASSED / REWORK</small><strong>{{ job.qcPassed }} <i>/ {{ job.rework }}</i></strong><span>{{ job.completedQuantity }} pieces completed</span></div>
          <div><small>PROJECTED GROSS PROFIT</small><strong>{{ money(job.projectedProfit) }}</strong><span>Actual cost {{ money(job.actualCost) }}</span></div>
        </div>
        <button class="job-link" type="button" @click="emit('navigate', '/JobOrders')">View job order <span>→</span></button>
      </section>

      <section class="attention-panel" aria-labelledby="attention-title">
        <div class="panel-heading">
          <div><p class="eyebrow">NEEDS ATTENTION</p><h2 id="attention-title">Clear these blockers</h2></div>
          <b class="attention-total">{{ dashboard.attention.length }}</b>
        </div>
        <button v-for="item in dashboard.attention" :key="item.title" class="attention-row" type="button" @click="emit('navigate', item.level === 'watch' ? '/Inventory' : '/JobOrders')">
          <i :class="item.level"></i><span><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></span><time>{{ item.age }}</time>
        </button>
        <div class="attention-note"><p>Artwork approval is a production release gate.</p><button type="button" @click="emit('navigate', '/Design')">Open design queue <span>→</span></button></div>
      </section>
    </div>

    <div class="dashboard-columns lower-columns">
      <section class="queue-panel" aria-labelledby="queue-title">
        <div class="panel-heading">
          <div><p class="eyebrow">DEPARTMENT WORK QUEUE</p><h2 id="queue-title">Jobs moving now</h2></div>
          <button class="section-link" type="button" @click="emit('navigate', '/JobOrders')">All job orders <span>→</span></button>
        </div>
        <div class="table-scroll">
          <table>
            <thead><tr><th>JOB / CUSTOMER</th><th>STAGE</th><th>QTY</th><th>DUE</th></tr></thead>
            <tbody><tr v-for="order in dashboard.productionQueue" :key="order.id">
              <td><strong>{{ order.id }}</strong><small>{{ order.client }} · {{ order.product }}</small></td>
              <td><span class="stage-pill">{{ order.stage }}</span></td><td>{{ order.quantity }}</td>
              <td :class="order.priority.toLowerCase()">{{ order.dueDate }}</td>
            </tr></tbody>
          </table>
        </div>
      </section>

      <section class="resources-panel" aria-labelledby="resources-title">
        <div class="panel-heading"><div><p class="eyebrow">SUPPLY & FINANCE</p><h2 id="resources-title">Protect the margin</h2></div></div>
        <div class="resource-metrics">
          <button type="button" @click="emit('navigate', '/Finance')"><small>OUTSTANDING</small><strong>{{ money(dashboard.finance.outstandingReceivables) }}</strong><span>Receivables</span></button>
          <button type="button" @click="emit('navigate', '/Reports')"><small>MONTH EXPENSES</small><strong>{{ money(dashboard.finance.expensesThisMonth) }}</strong><span>Operating + production</span></button>
        </div>
        <div class="stock-heading"><strong>LOW STOCK <b>{{ dashboard.inventory.lowStockCount }}</b></strong><button type="button" @click="emit('navigate', '/Inventory')">Inventory <span>→</span></button></div>
        <div class="stock-list"><div v-for="item in dashboard.inventory.items" :key="item.name">
          <span>{{ item.name }}</span><strong>{{ item.onHand }} {{ item.unit }}</strong>
          <i><span :style="{ width: `${Math.min(100, (item.onHand / item.minimum) * 100)}%` }"></span></i>
          <small>Minimum {{ item.minimum }} {{ item.unit }}</small>
        </div></div>
      </section>
    </div>
    <footer class="dashboard-footer">AFHIM DIGITAL SUBLIMATION WORKFLOW <span>INQUIRY → JOB ORDER → PRODUCTION → DELIVERY → PROFITABILITY</span></footer>
  </div>
</template>

<style scoped>
.operations-dashboard {
  --ink: #17262b;
  --teal: #17343a;
  --muted: #77817f;
  --line: #e1e4de;
  --paper: #fffefa;
  --orange: #dc702d;
  --green: #37816d;
  --red: #bd4d3a;
  --gold: #bd852e;
  margin: 0 auto;
  padding-top: 28px;
}
.operations-dashboard h1,
.operations-dashboard h2,
.operations-dashboard h3,
.operations-dashboard p { letter-spacing: 0; }
.operations-hero {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 164px;
  overflow: hidden;
  padding: 30px 34px;
  color: #f6f5ef;
  background: var(--teal);
}
.operations-hero::after {
  position: absolute;
  top: 0;
  right: 29%;
  width: 1px;
  height: 100%;
  background: rgba(244, 241, 235, .12);
  content: "";
  transform: skewX(-28deg);
}
.hero-kicker,
.operations-hero > small,
.pulse-grid button > span,
.stage-cell > div small,
.job-id,
.job-due small,
.job-metrics small,
.dashboard-footer {
  font-family: "DM Mono", monospace;
  letter-spacing: .08em !important;
}
.hero-kicker { color: #f1a36a; font-size: 8px; }
.hero-kicker span { margin-left: 12px; color: rgba(255,255,255,.55); }
.operations-hero h1 { margin: 14px 0 8px; font-size: 30px; font-weight: 600; }
.operations-hero > div:first-child > p:last-child { color: rgba(246,245,239,.68); font-size: 11px; }
.operations-hero > button {
  position: relative;
  z-index: 1;
  min-height: 42px;
  padding: 0 15px;
  border: 1px solid #e47529;
  color: white;
  background: #d96320;
  font-size: 10px;
  font-weight: 700;
}
.operations-hero > button:hover { background: #ef7a30; }
.operations-hero > button b { margin-left: 14px; font-size: 16px; }
.operations-hero > small { position: absolute; right: 34px; bottom: 11px; color: rgba(255,255,255,.22); font-size: 7px; }
.operations-hero > small i { color: #ed8138; font-style: normal; }
.dashboard-section { margin-top: 31px; }
.section-heading,
.panel-heading { display: flex; justify-content: space-between; align-items: end; gap: 15px; }
.section-heading h2,
.panel-heading h2 { margin-top: 7px; color: var(--ink); font-size: 18px; font-weight: 700; }
.operations-dashboard .eyebrow { color: #c6662d; }
.section-link { border: 0; color: #ad5527; background: transparent; font-size: 9px; font-weight: 700; white-space: nowrap; }
.section-link span { margin-left: 6px; font-size: 14px; }
.pulse-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); margin-top: 14px; border: 1px solid var(--line); background: var(--paper); }
.pulse-grid button { display: flex; min-width: 0; min-height: 119px; flex-direction: column; align-items: flex-start; padding: 17px 19px 14px; border: 0; border-right: 1px solid var(--line); background: transparent; text-align: left; }
.pulse-grid button:last-child { border-right: 0; }
.pulse-grid button:hover,.resource-metrics button:hover { background: #fbf3e9; }
.pulse-grid button > span { color: #8b918c; font-size: 7px; }
.pulse-grid button > strong { margin: 12px 0 7px; color: var(--ink); font-size: 23px; }
.pulse-grid button > strong em { color: #929995; font-size: 10px; font-style: normal; font-weight: 500; }
.pulse-grid button > small { color: var(--muted); font-size: 8px; }
.pulse-grid button > small.good { color: var(--green); font-weight: 700; }
.pulse-grid button > small.good i { color: var(--muted); font-style: normal; font-weight: 400; }
.pulse-grid button > small.risk { color: var(--red); font-weight: 700; }
.stage-strip { display: grid; grid-template-columns: repeat(9,minmax(80px,1fr)); margin-top: 14px; border: 1px solid var(--line); background: var(--paper); }
.stage-cell { min-width: 0; padding: 11px 10px; border-right: 1px solid var(--line); }
.stage-cell:last-child { border-right: 0; }
.stage-cell > div { display: flex; justify-content: space-between; align-items: center; }
.stage-cell > div small { color: #a0a7a2; font-size: 7px; }
.stage-cell > div b { display: grid; place-items: center; width: 22px; height: 22px; color: #a74e26; background: #fae9d8; font-size: 9px; }
.stage-cell > strong { display: block; margin-top: 9px; color: #354448; font-size: 9px; }
.stage-cell > small { display: block; margin-top: 3px; color: #929995; font-size: 7px; }
.stage-cell > i,.progress-track,.stock-list > div > i { display: block; height: 3px; margin-top: 9px; background: #ecece7; }
.stage-cell > i span,.progress-track span,.stock-list > div > i span { display: block; height: 100%; background: var(--orange); }
.release-gate { margin-top: 8px; color: #757f7b; font-size: 8px; }
.release-gate b { margin-right: 8px; color: #b75a29; font-family: "DM Mono",monospace; font-size: 7px; }
.dashboard-columns { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(290px,.75fr); gap: 14px; margin-top: 29px; }
.job-panel,.attention-panel,.queue-panel,.resources-panel { min-width: 0; padding: 18px 20px; border: 1px solid var(--line); background: var(--paper); }
.panel-heading { margin-bottom: 16px; }
.priority { padding: 5px 7px; color: #a65322; background: #faeadb; font-family: "DM Mono",monospace; font-size: 7px; letter-spacing: .08em; text-transform: uppercase; }
.job-heading-row { display: flex; justify-content: space-between; gap: 15px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
.job-id { color: #b05b2b; font-size: 7px; }
.job-heading-row h3 { margin-top: 6px; color: var(--ink); font-size: 14px; }
.job-heading-row p { margin-top: 5px; color: var(--muted); font-size: 9px; }
.job-heading-row p i { color: var(--orange); font-style: normal; }
.job-due { display: flex; flex: 0 0 auto; flex-direction: column; align-items: flex-end; gap: 5px; }
.job-due small { color: #929995; font-size: 7px; }
.job-due strong { color: #b95827; font-size: 10px; }
.progress-label { display: flex; justify-content: space-between; margin-top: 13px; color: #74807c; font-size: 8px; }
.progress-label b { color: var(--ink); }
.progress-track { height: 5px; margin-top: 6px; }
.job-trail { display: grid; grid-template-columns: repeat(10,minmax(37px,1fr)); gap: 3px; margin: 15px 0 17px; overflow-x: auto; }
.job-trail > div { display: flex; min-width: 37px; flex-direction: column; align-items: flex-start; gap: 5px; color: #9aa19d; font-size: 7px; }
.job-trail i { width: 8px; height: 8px; border: 1px solid #c4cbc5; border-radius: 50%; background: var(--paper); }
.job-trail .done { color: #51806f; }
.job-trail .done i { border-color: var(--green); background: var(--green); }
.job-trail .current { color: #b95726; font-weight: 700; }
.job-trail .current i { border: 2px solid var(--orange); }
.job-metrics { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.job-metrics > div { min-width: 0; padding: 10px 11px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.job-metrics small { display: block; color: #919a95; font-size: 6px; }
.job-metrics strong { display: block; margin-top: 6px; color: var(--ink); font-size: 14px; }
.job-metrics strong i { color: #c45b3f; font-size: 10px; font-style: normal; }
.job-metrics span { display: block; margin-top: 4px; color: var(--muted); font-size: 7px; }
.job-link { margin-top: 12px; padding: 0; border: 0; color: #a95025; background: transparent; font-size: 8px; font-weight: 700; }
.job-link span { margin-left: 6px; font-size: 13px; }
.attention-total { display: grid; place-items: center; width: 24px; height: 24px; color: white; background: #b94d38; font-family: "DM Mono",monospace; font-size: 9px; }
.attention-row { display: flex; width: 100%; min-height: 63px; align-items: center; gap: 9px; padding: 9px 0; border: 0; border-bottom: 1px solid var(--line); background: transparent; text-align: left; }
.attention-row:hover strong { color: #b95726; }
.attention-row > i { flex: 0 0 7px; width: 7px; height: 7px; border-radius: 50%; background: var(--gold); }
.attention-row > i.urgent,.attention-row > i.overdue { background: var(--red); }
.attention-row > span { flex: 1; min-width: 0; }
.attention-row strong,.attention-row small { display: block; }
.attention-row strong { color: #354448; font-size: 9px; }
.attention-row small { margin-top: 4px; color: #8a938e; font-size: 7px; }
.attention-row time { color: #909893; font-family: "DM Mono",monospace; font-size: 7px; white-space: nowrap; }
.attention-note { margin-top: 13px; padding: 10px; background: #f7f1e8; }
.attention-note p { color: #727c78; font-size: 8px; }
.attention-note button,.stock-heading button { margin-top: 7px; padding: 0; border: 0; color: #ad5527; background: transparent; font-size: 8px; font-weight: 700; }
.attention-note button span,.stock-heading button span { margin-left: 5px; }
.lower-columns { margin-top: 14px; }
.table-scroll { overflow-x: auto; }
.queue-panel table { width: 100%; border-collapse: collapse; text-align: left; }
.queue-panel th { padding: 8px 7px; border-bottom: 1px solid var(--line); color: #8b948f; font-family: "DM Mono",monospace; font-size: 6px; font-weight: 500; white-space: nowrap; }
.queue-panel td { padding: 10px 7px; border-bottom: 1px solid #eceee9; color: #46534f; font-size: 8px; white-space: nowrap; }
.queue-panel tr:last-child td { border-bottom: 0; }
.queue-panel td:first-child strong,.queue-panel td:first-child small { display: block; }
.queue-panel td:first-child strong { color: #26383c; font-family: "DM Mono",monospace; font-size: 7px; }
.queue-panel td:first-child small { margin-top: 4px; color: #818b86; font-size: 7px; }
.stage-pill { padding: 4px 5px; color: #487864; background: #e8f1e9; font-size: 7px; }
.queue-panel td.rush { color: var(--red); font-weight: 700; }
.queue-panel td.priority { color: #b37327; font-weight: 700; }
.resource-metrics { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); border: 1px solid var(--line); }
.resource-metrics button { display: flex; min-width: 0; flex-direction: column; align-items: flex-start; padding: 10px; border: 0; border-right: 1px solid var(--line); background: transparent; text-align: left; }
.resource-metrics button:last-child { border-right: 0; }
.resource-metrics small,.stock-heading strong { color: #8d9791; font-family: "DM Mono",monospace; font-size: 6px; letter-spacing: .07em; }
.resource-metrics strong { margin-top: 7px; color: var(--ink); font-size: 14px; }
.resource-metrics span { margin-top: 4px; color: var(--muted); font-size: 7px; }
.stock-heading { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-bottom: 7px; border-bottom: 1px solid var(--line); }
.stock-heading strong b { margin-left: 4px; color: #ad5527; }
.stock-heading button { margin-top: 0; }
.stock-list > div { display: grid; grid-template-columns: 1fr auto; gap: 5px 9px; padding: 8px 0; border-bottom: 1px solid #eceee9; color: #46534f; font-size: 7px; }
.stock-list > div:last-child { border-bottom: 0; }
.stock-list > div > strong { color: #ac522a; font-family: "DM Mono",monospace; font-size: 7px; }
.stock-list > div > i { grid-column: 1/-1; margin-top: 0; }
.stock-list > div > small { grid-column: 1/-1; color: #939a95; font-size: 6px; }
.dashboard-footer { display: flex; justify-content: space-between; gap: 15px; margin-top: 22px; padding: 13px 0; border-top: 1px solid #d9ded7; color: #87918c; font-size: 6px; }
.dashboard-footer span { color: #b26031; text-align: right; }
@media (max-width: 900px) {
  .pulse-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .pulse-grid button { min-height: 108px; padding: 15px; border-bottom: 1px solid var(--line); }
  .pulse-grid button:nth-child(even) { border-right: 0; }
  .pulse-grid button:nth-child(n+3) { border-bottom: 0; }
}
@media (max-width: 1100px) {
  .stage-strip { grid-template-columns: repeat(5,minmax(90px,1fr)); }
  .stage-cell:nth-child(5) { border-right: 0; }
  .stage-cell:nth-child(n+6) { border-top: 1px solid var(--line); }
}
@media (max-width: 900px) { .dashboard-columns { grid-template-columns: 1fr; } }
@media (max-width: 700px) {
  .operations-dashboard { padding-top: 18px; }
  .operations-hero { align-items: flex-start; flex-direction: column; gap: 17px; padding: 21px 18px 31px; }
  .operations-hero h1 { font-size: 24px; }
  .operations-hero > small { right: 12px; bottom: 8px; font-size: 5px; }
  .hero-kicker span { display: block; margin: 6px 0 0; }
  .pulse-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .pulse-grid button { min-height: 105px; padding: 13px 11px; border-bottom: 1px solid var(--line); }
  .pulse-grid button:nth-child(2) { border-right: 0; }
  .pulse-grid button:nth-child(n+3) { border-bottom: 0; }
  .pulse-grid button > strong { font-size: 20px; }
  .section-heading { align-items: flex-start; flex-direction: column; gap: 10px; }
  .stage-strip { grid-template-columns: repeat(9,minmax(90px,1fr)); overflow-x: auto; }
  .stage-cell:nth-child(5) { border-right: 1px solid var(--line); }
  .stage-cell:nth-child(n+6) { border-top: 0; }
  .job-panel,.attention-panel,.queue-panel,.resources-panel { padding: 15px 12px; }
  .job-heading-row { gap: 8px; }
  .job-trail { grid-template-columns: repeat(10,45px); }
  .job-metrics > div { padding: 9px 7px; }
  .job-metrics strong { font-size: 12px; }
  .queue-panel table { min-width: 470px; }
  .dashboard-footer { align-items: flex-start; flex-direction: column; line-height: 1.5; }
  .dashboard-footer span { text-align: left; }
}
</style>