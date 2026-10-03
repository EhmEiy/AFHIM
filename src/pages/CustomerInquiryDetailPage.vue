<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  productService,
  type InquiryResponse,
  type SaveInquiryRequest,
} from "../services/ProductService";

type InquiryStatus = "NEW" | "FOLLOW-UP" | "QUOTED" | "NEGOTIATING" | "WON" | "LOST";
type Inquiry = { id: string; date: string; customer: string; contact: string; product: string; quantity: string; source: string; status: InquiryStatus; assignee: string };
type InquiryFormState = {
  inquiryID: string; inquiryDate: string; companyName: string; contactName: string;
  contactNumber: string; email: string; socialAccount: string; address: string;
  source: string; salesPerson: string; status: number; productID: string; productId: string;
  productType: string; quantity: number; targetPrice: number; targetDate: string; remarks: string;
};

const props = defineProps<{ mode: "new" | "detail"; recordId?: string; salespersonName?: string }>();
const emit = defineEmits<{ (event: "navigate", path: string): void }>();
const saved = ref(false);
const status = ref<InquiryStatus>("NEW");
const inquiries = ref<Inquiry[]>([]);
const isLoading = ref(false);
const loadError = ref("");
const createInquiryId = () => `INQ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Date.now() / 1000)}`;
const inquiryStatusMap: Record<InquiryStatus, number> = { NEW: 1, "FOLLOW-UP": 2, QUOTED: 3, NEGOTIATING: 4, WON: 5, LOST: 6 };
const inquiryStatusLabels: Record<number, InquiryStatus> = { 1: "NEW", 2: "FOLLOW-UP", 3: "QUOTED", 4: "NEGOTIATING", 5: "WON", 6: "LOST" };
const form = ref<InquiryFormState>({
  inquiryID: props.mode === "new" ? createInquiryId() : props.recordId || "",
  inquiryDate: new Date().toISOString().slice(0, 10), companyName: "", contactName: "",
  contactNumber: "", email: "", socialAccount: "", address: "", source: "Facebook / Messenger",
  salesPerson: props.salespersonName || "Jane Dela Cruz", status: inquiryStatusMap.NEW,
  productID: "", productId: "", productType: "Custom clothing", quantity: 0, targetPrice: 0,
  targetDate: "", remarks: "",
});

function formatDateInput(value: string | null | undefined) {
  const rawValue = value?.trim() || "";
  const dateOnly = rawValue.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (dateOnly) return dateOnly;
  const parsedDate = new Date(rawValue);
  return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString().slice(0, 10);
}

function mapInquiry(item: InquiryResponse): Inquiry {
  return {
    id: item.inquiryID, date: item.inquiryDate, customer: item.companyName, contact: item.contactName,
    product: item.product?.productType || "—", quantity: item.product?.quantity == null ? "—" : String(item.product.quantity),
    source: item.source, status: inquiryStatusLabels[item.status] || "NEW", assignee: item.salesPerson,
  };
}

function populateForm(item: InquiryResponse) {
  form.value.inquiryID = item.inquiryID; form.value.inquiryDate = item.inquiryDate.slice(0, 10);
  form.value.companyName = item.companyName; form.value.contactName = item.contactName;
  form.value.contactNumber = item.contactNumber; form.value.email = item.email;
  form.value.socialAccount = item.socialAccount; form.value.address = item.address;
  form.value.source = item.source; form.value.salesPerson = item.salesPerson; form.value.status = item.status;
  form.value.productID = item.productID; form.value.productId = item.product?.productId || "";
  form.value.productType = item.product?.productType || "Custom clothing";
  form.value.quantity = Number(item.product?.quantity) || 0; form.value.targetPrice = item.product?.targetPrice || 0;
  form.value.targetDate = formatDateInput(item.product?.targetDate || item.targetDate);
  form.value.remarks = item.product?.remarks || ""; status.value = inquiryStatusLabels[item.status] || "NEW";
}

async function loadInquiryDetail(inquiryId: string) {
  isLoading.value = true; loadError.value = "";
  try {
    const response = await productService.getInquiry(inquiryId);
    if (!response.data) throw new Error(response.message || "The requested inquiry was not found.");
    inquiries.value = [mapInquiry(response.data)]; populateForm(response.data);
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Unable to load the inquiry.");
    emit("navigate", "/CustomerInquiry");
  } finally { isLoading.value = false; }
}

watch([() => props.mode, () => props.recordId], ([mode, recordId]) => {
  if (mode === "detail" && recordId) void loadInquiryDetail(recordId);
}, { immediate: true });

const selected = computed(() => inquiries.value.find((inquiry) => inquiry.id === props.recordId) ?? inquiries.value[0]!);

async function save() {
  const inquiryId = form.value.inquiryID || createInquiryId();
  const payload: SaveInquiryRequest = {
    inquiryID: inquiryId,
    inquiryDate: form.value.inquiryDate ? new Date(`${form.value.inquiryDate}T00:00:00`).toISOString() : new Date().toISOString(),
    companyName: form.value.companyName.trim(), contactName: form.value.contactName.trim(), contactNumber: form.value.contactNumber.trim(),
    email: form.value.email.trim(), socialAccount: form.value.socialAccount.trim(), address: form.value.address.trim(),
    source: form.value.source, salesPerson: form.value.salesPerson || props.salespersonName || "Jane Dela Cruz",
    status: form.value.status || inquiryStatusMap.NEW, productID: form.value.productID || inquiryId,
    productId: form.value.productId || inquiryId, productType: form.value.productType, quantity: Number(form.value.quantity) || 0,
    targetPrice: Number(form.value.targetPrice) || 0, targetDate: form.value.targetDate || new Date().toISOString().slice(0, 10),
    remarks: form.value.remarks.trim(),
  };
  const response = await productService.saveInquiry(payload);
  if (response.status) { saved.value = true; form.value.inquiryID = inquiryId; return; }
  throw new Error(response.message || "Unable to save inquiry.");
}
</script>

<template>
  <div class="content inquiry-content">
    <div class="page-intro">
      <div>
        <button class="back-link" @click="emit('navigate', '/CustomerInquiry')">← Back</button>
        <p class="eyebrow detail-eyebrow">CUSTOMER RELATIONSHIP MANAGEMENT</p>
        <h1>{{ props.mode === "new" ? "New inquiry" : "Inquiry detail" }}</h1>
        <p class="muted">{{ props.mode === "new" ? "Create a new customer record." : (selected?.id ?? props.recordId ?? "Loading inquiry") + " · Review and update this customer record." }}</p>
      </div>
      <button class="outline-button" @click="save">{{ props.mode === "new" ? "Save inquiry" : "Save changes" }}</button>
    </div>
    <div v-if="saved" class="save-banner"><span>✓</span> Inquiry saved successfully. It is ready for follow-up.</div>
    <div class="inquiry-layout">
      <form class="inquiry-form" @submit.prevent="save">
        <div class="form-section">
          <div class="form-section-heading"><span>01</span><div><p class="eyebrow">CUSTOMER DETAILS</p><h2>Who are we helping?</h2></div></div>
          <div class="field-grid">
            <div><label for="inquiry-id">Inquiry ID</label><input id="inquiry-id" v-model="form.inquiryID" readonly /></div>
            <div><label for="inquiry-date">Date</label><input id="inquiry-date" v-model="form.inquiryDate" type="date" /></div>
            <div class="field-span-2"><label for="company">Customer / company</label><input id="company" v-model="form.companyName" placeholder="Company or customer name" required /></div>
            <div><label for="contact">Contact person</label><input id="contact" v-model="form.contactName" placeholder="Full name" required /></div>
            <div><label for="phone">Phone</label><input id="phone" v-model="form.contactNumber" type="tel" placeholder="09XX XXX XXXX" /></div>
            <div><label for="email-inquiry">Email</label><input id="email-inquiry" v-model="form.email" type="email" placeholder="contact@company.com" /></div>
            <div><label for="social">Social account</label><input id="social" v-model="form.socialAccount" placeholder="Facebook / Messenger handle" /></div>
            <div class="field-span-2"><label for="address">Address</label><input id="address" v-model="form.address" placeholder="Business or delivery address" /></div>
            <div><label for="lead-source">Lead source</label><select id="lead-source" v-model="form.source"><option v-for="source in ['Facebook / Messenger', 'Walk-in', 'Referral', 'Repeat client', 'Government', 'School', 'Organization', 'Reseller', 'Other']" :key="source" :value="source">{{ source }}</option></select></div>
            <div><label for="salesperson">Assigned salesperson</label><select id="salesperson" v-model="form.salesPerson"><option v-for="person in ['Jane Dela Cruz', 'Mark Santos', 'Leah Garcia']" :key="person" :value="person">{{ person }}</option></select></div>
          </div>
        </div>
        <div class="form-section">
          <div class="form-section-heading"><span>02</span><div><p class="eyebrow">PRODUCT INQUIRY</p><h2>What do they need?</h2></div></div>
          <div class="field-grid">
            <div><label for="product-type">Product type</label><select id="product-type" v-model="form.productType"><option v-for="product in ['Custom clothing', 'Screen printing', 'Embroidery', 'Digital printing', 'Promotional items']" :key="product" :value="product">{{ product }}</option></select></div>
            <div><label for="quantity">Estimated quantity</label><input id="quantity" v-model.number="form.quantity" type="number" min="0" placeholder="e.g. 350" /></div>
            <div><label for="target-price">Target price / unit</label><input id="target-price" v-model.number="form.targetPrice" type="number" min="0" placeholder="₱ 0.00" /></div>
            <div><label for="required-date">Required date</label><input id="required-date" v-model="form.targetDate" type="date" /></div>
            <div class="field-span-2"><label for="notes">Notes</label><textarea id="notes" v-model="form.remarks" rows="4" placeholder="Sizes, colors, artwork, specifications, or other customer notes"></textarea></div>
          </div>
        </div>
        <div class="form-actions"><button type="button" class="cancel-button" @click="emit('navigate', '/CustomerInquiry')">Cancel</button><button class="primary-button save-button" type="submit">Save inquiry <span>→</span></button></div>
      </form>
      <aside class="inquiry-side"><div class="status-panel"><div class="side-heading"><div><p class="eyebrow">INQUIRY STATUS</p><h2>Move the lead forward.</h2></div></div><div class="status-flow"><div v-for="step in ['NEW', 'FOLLOW-UP', 'QUOTED', 'NEGOTIATING', 'WON', 'LOST']" :key="step" :class="['status-step', { selected: status === step }]" aria-hidden="true"><span></span>{{ step }}<b v-if="status === step">Active</b></div></div><div class="handoff-note"><strong>WON</strong><p>When a lead is won, convert it into a quotation and issue its permanent Job Order ID.</p><span>JO ID handoff →</span></div></div></aside>
    </div>
  </div>
</template>