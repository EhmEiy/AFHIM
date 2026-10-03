<script setup lang="ts">
import { computed, ref } from "vue";

type QuotationStatus = "DRAFT" | "SENT" | "NEGOTIATING" | "APPROVED";
const props = defineProps<{ filter: string }>();
const view = ref<"list" | "detail">("list");
const selectedId = ref("QT-2026-0018");
const status = ref<QuotationStatus>("DRAFT");
const selectedItem = ref(0);

const quotations = [
  {
    id: "QT-2026-0018",
    date: "27 Aug 2026",
    customer: "Northstar Academy",
    inquiry: "INQ-2026-0031",
    project: "Foundation Day",
    total: "₱428,650",
    status: "DRAFT",
    salesperson: "Jane Dela Cruz",
  },
  {
    id: "QT-2026-0017",
    date: "26 Aug 2026",
    customer: "Brightside Co.",
    inquiry: "INQ-2026-0030",
    project: "Company event shirts",
    total: "₱96,300",
    status: "SENT",
    salesperson: "Mark Santos",
  },
  {
    id: "QT-2026-0016",
    date: "25 Aug 2026",
    customer: "Metrobank Makati",
    inquiry: "INQ-2026-0029",
    project: "Branch uniforms",
    total: "₱72,480",
    status: "NEGOTIATING",
    salesperson: "Jane Dela Cruz",
  },
  {
    id: "QT-2026-0015",
    date: "23 Aug 2026",
    customer: "Lumen PH",
    inquiry: "INQ-2026-0028",
    project: "Marketing kits",
    total: "₱154,200",
    status: "APPROVED",
    salesperson: "Leah Garcia",
  },
  {
    id: "QT-2026-0014",
    date: "21 Aug 2026",
    customer: "City Schools Division",
    inquiry: "INQ-2026-0027",
    project: "Student uniforms",
    total: "₱312,000",
    status: "DECLINED",
    salesperson: "Mark Santos",
  },
];
const filtered = computed(() =>
  props.filter === "ALL"
    ? quotations
    : quotations.filter((quotation) => quotation.status === props.filter),
);
const items = [
  {
    product: "Performance shirt",
    variant: "Round neck / dry-fit",
    fabric: "Polyester",
    gsm: "160",
    sizes: "S–2XL",
    quantity: 250,
    unitPrice: 285,
    discount: 0,
  },
  {
    product: "Embroidered cap",
    variant: "6-panel / adjustable",
    fabric: "Twill",
    gsm: "280",
    sizes: "One size",
    quantity: 50,
    unitPrice: 165,
    discount: 0,
  },
  {
    product: "Event tote bag",
    variant: "Full color print",
    fabric: "Canvas",
    gsm: "220",
    sizes: "14 × 16 in",
    quantity: 100,
    unitPrice: 120,
    discount: 500,
  },
];
const subtotal = computed(() =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
);
const discount = computed(() =>
  items.reduce((sum, item) => sum + item.discount, 0),
);
const additional = 5500;
const tax = computed(() =>
  Math.round((subtotal.value - discount.value + additional) * 0.12),
);
const grandTotal = computed(
  () => subtotal.value - discount.value + additional + tax.value,
);

function openQuotation(quotation: (typeof quotations)[number]) {
  selectedId.value = quotation.id;
  status.value =
    quotation.status === "SENT" ||
    quotation.status === "NEGOTIATING" ||
    quotation.status === "APPROVED"
      ? quotation.status
      : "DRAFT";
  view.value = "detail";
}
function advanceStatus() {
  if (status.value === "DRAFT") status.value = "SENT";
  else if (status.value === "SENT") status.value = "NEGOTIATING";
  else if (status.value === "NEGOTIATING") status.value = "APPROVED";
}
</script>

<template>
  <div class="content quotation-content">
    <template v-if="view === 'list'">
      <div class="page-intro">
        <div>
          <p class="eyebrow">SALES CONVERSION</p>
          <h1>Quotations</h1>
          <p class="muted">
            Select a Quotation ID to view its items, charges, totals, and
            approval trail.
          </p>
        </div>
        <button
          class="outline-button"
          @click="
            view = 'detail';
            selectedId = 'NEW QUOTATION';
            status = 'DRAFT';
          "
        >
          + New quotation
        </button>
      </div>
      <div class="quotation-register">
        <div class="table-heading">
          <div>
            <p class="eyebrow">QUOTATION REGISTER</p>
            <h2>
              {{
                props.filter === "ALL"
                  ? "All quotations"
                  : props.filter + " quotations"
              }}
            </h2>
          </div>
          <div class="table-tools">
            <span class="filter-button">{{
              props.filter === "ALL" ? "All statuses" : props.filter
            }}</span
            ><button class="text-button">Export <span>↗</span></button>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Quotation ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Inquiry ID</th>
                <th>Project name</th>
                <th>Grand total</th>
                <th>Salesperson</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quotation in filtered" :key="quotation.id">
                <td>
                  <button
                    class="inquiry-id-button"
                    @click="openQuotation(quotation)"
                  >
                    {{ quotation.id }} <span>→</span>
                  </button>
                </td>
                <td>{{ quotation.date }}</td>
                <td>
                  <strong>{{ quotation.customer }}</strong>
                </td>
                <td>{{ quotation.inquiry }}</td>
                <td>{{ quotation.project }}</td>
                <td>
                  <strong>{{ quotation.total }}</strong>
                </td>
                <td>{{ quotation.salesperson }}</td>
                <td>
                  <span
                    :class="['inquiry-status', quotation.status.toLowerCase()]"
                    >{{ quotation.status }}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="page-intro">
        <div>
          <button class="back-link" @click="view = 'list'">
            ← All quotations
          </button>
          <p class="eyebrow detail-eyebrow">SALES CONVERSION</p>
          <h1>Quotation detail</h1>
          <p class="muted">
            {{ selectedId }} · Build a clear offer from the inquiry, then move
            it into production.
          </p>
        </div>
        <button class="outline-button">Save changes</button>
      </div>
      <div class="quotation-toolbar">
        <div class="quotation-ref">
          <strong>{{ selectedId }}</strong
          ><span class="status-pill">{{ status }}</span
          ><small>Last edited today at 09:38 AM</small>
        </div>
        <div class="quote-actions">
          <button class="cancel-button">Duplicate</button
          ><button
            class="primary-button quote-action-button"
            :disabled="status === 'APPROVED'"
            @click="advanceStatus"
          >
            {{
              status === "DRAFT"
                ? "Send quotation"
                : status === "SENT"
                  ? "Start negotiation"
                  : status === "NEGOTIATING"
                    ? "Approve quotation"
                    : "Approved"
            }}
            <span>→</span>
          </button>
        </div>
      </div>
      <div class="quotation-meta-grid">
        <div>
          <label for="quote-customer">Customer ID</label
          ><input
            id="quote-customer"
            value="CUS-00142 · Northstar Academy"
            readonly
          />
        </div>
        <div>
          <label for="quote-inquiry">Inquiry ID</label
          ><input id="quote-inquiry" value="INQ-2026-0031" readonly />
        </div>
        <div>
          <label for="quote-date">Date</label
          ><input id="quote-date" type="date" value="2026-08-27" />
        </div>
        <div>
          <label for="quote-valid">Valid until</label
          ><input id="quote-valid" type="date" value="2026-09-10" />
        </div>
        <div>
          <label for="quote-salesperson">Salesperson</label
          ><select id="quote-salesperson">
            <option>Jane Dela Cruz</option>
            <option>Mark Santos</option>
          </select>
        </div>
        <div class="project-field">
          <label for="project-name">Project name</label
          ><input id="project-name" value="Northstar Academy Foundation Day" />
        </div>
      </div>
      <div class="quotation-table-panel">
        <div class="table-heading">
          <div>
            <p class="eyebrow">QUOTATION ITEMS</p>
            <h2>Products and pricing</h2>
          </div>
          <button class="text-button">+ Add item</button>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Product / variant</th>
                <th>Fabric</th>
                <th>GSM</th>
                <th>Sizes</th>
                <th>Qty</th>
                <th>Unit price</th>
                <th>Discount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in items"
                :key="item.product"
                :class="{ 'selected-row': selectedItem === index }"
                @click="selectedItem = index"
              >
                <td>
                  <strong>{{ item.product }}</strong
                  ><small>{{ item.variant }}</small>
                </td>
                <td>{{ item.fabric }}</td>
                <td>{{ item.gsm }}</td>
                <td>{{ item.sizes }}</td>
                <td>{{ item.quantity }}</td>
                <td>₱{{ item.unitPrice.toLocaleString() }}</td>
                <td>₱{{ item.discount.toLocaleString() }}</td>
                <td>
                  <strong
                    >₱{{
                      (
                        item.quantity * item.unitPrice -
                        item.discount
                      ).toLocaleString()
                    }}</strong
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="selected-item">
          <span class="selected-indicator"></span>
          <div>
            <b>{{ items[selectedItem]?.product }}</b
            ><small
              >Selected item · click any row to inspect or edit its
              details</small
            >
          </div>
          <button class="text-button">Edit item <span>→</span></button>
        </div>
      </div>
      <div class="quotation-lower">
        <div class="charges-panel">
          <div class="table-heading">
            <div>
              <p class="eyebrow">ADDITIONAL CHARGES</p>
              <h2>Project extras</h2>
            </div>
            <button class="text-button">+ Add charge</button>
          </div>
          <div class="charge-row">
            <span>Rush production</span><b>₱2,500</b>
          </div>
          <div class="charge-row"><span>Delivery</span><b>₱1,800</b></div>
          <div class="charge-row">
            <span>Packaging & design</span><b>₱1,200</b>
          </div>
        </div>
        <div class="totals-panel">
          <div>
            <span>Subtotal</span><b>₱{{ subtotal.toLocaleString() }}</b>
          </div>
          <div>
            <span>Discount</span
            ><b class="discount">− ₱{{ discount.toLocaleString() }}</b>
          </div>
          <div>
            <span>Additional charges</span
            ><b>₱{{ additional.toLocaleString() }}</b>
          </div>
          <div>
            <span>Tax (12%)</span><b>₱{{ tax.toLocaleString() }}</b>
          </div>
          <div class="grand-total">
            <span>Grand total</span
            ><strong>₱{{ grandTotal.toLocaleString() }}</strong>
          </div>
        </div>
      </div>
      <div class="quotation-footer">
        <div class="quote-status-flow">
          <span :class="{ current: status === 'DRAFT' }">DRAFT</span><i>→</i
          ><span :class="{ current: status === 'SENT' }">SENT</span><i>→</i
          ><span :class="{ current: status === 'NEGOTIATING' }"
            >NEGOTIATING</span
          ><i>→</i
          ><span :class="{ current: status === 'APPROVED' }">APPROVED</span>
        </div>
        <button
          class="dark-button convert-button"
          :disabled="status !== 'APPROVED'"
        >
          {{
            status === "APPROVED"
              ? "Convert to order"
              : "Approve quotation to convert"
          }}
          <span>→</span>
        </button>
      </div>
    </template>
  </div>
</template>
