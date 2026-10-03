<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  productService,
  type InquiryResponse,
} from "../services/ProductService";

type InquiryStatus =
  | "NEW"
  | "FOLLOW-UP"
  | "QUOTED"
  | "NEGOTIATING"
  | "WON"
  | "LOST";
type Inquiry = {
  id: string;
  date: string;
  customer: string;
  contact: string;
  product: string;
  quantity: string;
  source: string;
  status: InquiryStatus;
  assignee: string;
};

const props = defineProps<{ filter: string }>();
const emit = defineEmits<{ (event: "navigate", path: string): void }>();
const inquiries = ref<Inquiry[]>([]);
const isLoading = ref(false);
const loadError = ref("");
const currentPage = ref(1);
const pageSize = 10;

const inquiryStatusMap: Record<InquiryStatus, number> = {
  NEW: 1,
  "FOLLOW-UP": 2,
  QUOTED: 3,
  NEGOTIATING: 4,
  WON: 5,
  LOST: 6,
};
const inquiryStatusLabels: Record<number, InquiryStatus> = {
  1: "NEW",
  2: "FOLLOW-UP",
  3: "QUOTED",
  4: "NEGOTIATING",
  5: "WON",
  6: "LOST",
};

function formatInquiryDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}

function mapInquiry(item: InquiryResponse): Inquiry {
  const quantity = item.product?.quantity;

  return {
    id: item.inquiryID,
    date: formatInquiryDate(item.inquiryDate),
    customer: item.companyName,
    contact: item.contactName,
    product: item.product?.productType || "—",
    quantity: quantity == null ? "—" : String(quantity),
    source: item.source,
    status: inquiryStatusLabels[item.status] || "NEW",
    assignee: item.salesPerson,
  };
}

function handleLoadError(error: unknown) {
  loadError.value =
    error instanceof Error ? error.message : "Unable to load inquiries.";
}

async function loadInquiries() {
  isLoading.value = true;
  loadError.value = "";
  currentPage.value = 1;

  try {
    const requestedStatus =
      props.filter === "ALL"
        ? 0
        : inquiryStatusMap[props.filter as InquiryStatus] || inquiryStatusMap.NEW;
    const response = await productService.getInquiries(requestedStatus);
    inquiries.value = (response.data || []).map(mapInquiry);
  } catch (error) {
    handleLoadError(error);
  } finally {
    isLoading.value = false;
  }
}

watch(() => props.filter, () => void loadInquiries(), { immediate: true });

const filtered = computed(() =>
  props.filter === "ALL"
    ? inquiries.value
    : inquiries.value.filter((inquiry) => inquiry.status === props.filter),
);
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));
const paginatedInquiries = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filtered.value.slice(start, start + pageSize);
});

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
}

function openDetail(inquiry: Inquiry) {
  emit("navigate", `/CustomerInquiry/${inquiry.id}`);
}
</script>

<template>
  <div class="content inquiry-content">
    <div class="page-intro">
      <div>
        <p class="eyebrow">CUSTOMER RELATIONSHIP MANAGEMENT</p>
        <h1>Customer inquiries</h1>
        <p class="muted">
          Select an Inquiry ID to view the complete customer and product record.
        </p>
      </div>
      <button class="outline-button" @click="emit('navigate', '/CustomerInquiry/new-entry')">
        + New inquiry
      </button>
    </div>
    <div class="inquiry-table-panel">
      <div class="table-heading">
        <div>
          <p class="eyebrow">INQUIRY REGISTER</p>
          <h2>{{ props.filter === "ALL" ? "All customer inquiries" : props.filter + " inquiries" }}</h2>
        </div>
        <div class="table-tools">
          <span class="filter-button">{{ props.filter === "ALL" ? "All statuses" : props.filter }}</span>
          <button class="text-button">Export <span>↗</span></button>
        </div>
      </div>
      <p v-if="isLoading" class="muted">Loading inquiries...</p>
      <p v-else-if="loadError" class="muted">{{ loadError }}</p>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Inquiry ID</th><th>Date</th><th>Customer / company</th>
              <th>Contact person</th><th>Product inquiry</th><th>Qty</th>
              <th>Lead source</th><th>Status</th><th>Assigned</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!isLoading && !loadError && filtered.length === 0">
              <td colspan="9" class="muted">No inquiries found.</td>
            </tr>
            <tr v-for="inquiry in paginatedInquiries" :key="inquiry.id">
              <td><button class="inquiry-id-button" @click="openDetail(inquiry)">{{ inquiry.id }} <span>→</span></button></td>
              <td>{{ inquiry.date }}</td>
              <td><strong>{{ inquiry.customer }}</strong></td>
              <td>{{ inquiry.contact }}</td>
              <td>{{ inquiry.product }}</td>
              <td>{{ inquiry.quantity }}</td>
              <td>{{ inquiry.source }}</td>
              <td><span :class="['inquiry-status', inquiry.status.toLowerCase().replace('-', '')]">{{ inquiry.status }}</span></td>
              <td>{{ inquiry.assignee }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filtered.length > 0" class="pagination" aria-label="Inquiry table pagination">
        <span class="pagination-summary">
          Showing {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, filtered.length) }} of {{ filtered.length }}
        </span>
        <div class="pagination-controls">
          <button
            class="pagination-button"
            type="button"
            :disabled="currentPage === 1"
            aria-label="Previous page"
            @click="goToPage(currentPage - 1)"
          >
            ←
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            class="pagination-button"
            type="button"
            :disabled="currentPage === totalPages"
            aria-label="Next page"
            @click="goToPage(currentPage + 1)"
          >
            →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>