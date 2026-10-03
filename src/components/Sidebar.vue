<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ collapsed: boolean; mobileOpen: boolean; userName: string; userInitials: string }>()
const emit = defineEmits<{ (event: 'closeMobile'): void; (event: 'navigate', path: string): void }>()

const inquiryOpen = ref(false)
const quotationOpen = ref(false)
const currentPath = ref(window.location.pathname || '/')

const inquiryStatuses = ['ALL', 'NEW', 'FOLLOW-UP', 'QUOTED', 'NEGOTIATING', 'WON', 'LOST']
const quotationStatuses = ['ALL', 'DRAFT', 'SENT', 'NEGOTIATING', 'APPROVED', 'DECLINED', 'EXPIRED']

function go(path: string) {
  currentPath.value = path
  emit('navigate', path)
  emit('closeMobile')
}

function isActive(path: string) {
  return path === '/' ? currentPath.value === '/' : currentPath.value === path
}

function inquiryPath(status: string) {
  return status === 'ALL' ? '/CustomerInquiry' : `/CustomerInquiry/${status.toLowerCase()}`
}

function quotationPath(status: string) {
  return status === 'ALL' ? '/Quotations' : `/Quotations/${status.toLowerCase()}`
}
</script>

<template>
  <div :class="['sidebar-shell', { 'sidebar-shell--collapsed': collapsed, 'mobile-sidebar-open': props.mobileOpen }]">
    <aside :class="['sidebar', { 'sidebar-collapsed': collapsed }]">
      <div class="brand-lockup">
        <img class="brand-logo" src="../../images/AFIM_Logo.jpg" alt="AFHIM Clothing" />
        <div><small>CLOTHING & PRINTING<br />SERVICES INC.</small></div>
      </div>
      <nav id="primary-navigation" aria-label="Main navigation">
      <div class="nav-section-label">COMMERCIAL</div>
      <button :class="['nav-item', { active: isActive('/') }]" :title="collapsed ? 'Overview' : undefined" aria-label="Overview" @click="go('/')"><span class="nav-icon nav-icon--overview">▦</span><span>Overview</span></button>
      <div class="nav-with-submenu">
        <button :class="['nav-item', { active: currentPath.startsWith('/CustomerInquiry') }]" title="Customer Inquiry" aria-label="Customer Inquiry" @click="inquiryOpen = !inquiryOpen; go('/CustomerInquiry')"><span class="nav-icon nav-icon--crm">?</span><span>Customer Inquiry</span><i>{{ inquiryOpen ? '⌄' : '>' }}</i></button>
        <div v-if="!collapsed && inquiryOpen" class="submenu">
          <button v-for="status in inquiryStatuses" :key="status" :class="{ selected: currentPath === inquiryPath(status) }" :title="status === 'ALL' ? 'All inquiries' : `${status} inquiries`" @click="go(inquiryPath(status))">{{ status === 'ALL' ? 'All inquiries' : status }}</button>
        </div>
      </div>

      <div class="nav-with-submenu">
        <button :class="['nav-item', { active: currentPath.startsWith('/Quotations') }]" title="Quotations" aria-label="Quotations" @click="quotationOpen = !quotationOpen; go('/Quotations')"><span class="nav-icon nav-icon--quotations">₱</span><span>Quotations</span><b>08</b><i>{{ quotationOpen ? '⌄' : '>' }}</i></button>
        <div v-if="!collapsed && quotationOpen" class="submenu">
          <button v-for="status in quotationStatuses" :key="status" :class="{ selected: currentPath === quotationPath(status) }" :title="status === 'ALL' ? 'All quotations' : `${status} quotations`" @click="go(quotationPath(status))">{{ status === 'ALL' ? 'All quotations' : status }}</button>
        </div>
      </div>
      <button :class="['nav-item', { active: isActive('/JobOrders') }]" :title="collapsed ? 'Job Orders' : undefined" aria-label="Job Orders" @click="go('/JobOrders')"><span class="nav-icon nav-icon--orders">⌁</span><span>Job Orders</span></button>

      <div class="nav-section-label">PRODUCTION</div>
      <button :class="['nav-item', { active: isActive('/Design') }]" :title="collapsed ? 'Design & Layout' : undefined" aria-label="Design and Layout" @click="go('/Design')"><span class="nav-icon nav-icon--design">◇</span><span>Design & Layout</span></button>
      <button :class="['nav-item', { active: isActive('/Production') }]" :title="collapsed ? 'Production' : undefined" aria-label="Production" @click="go('/Production')"><span class="nav-icon nav-icon--production">◒</span><span>Production</span></button>
      <button :class="['nav-item', { active: isActive('/QualityControl') }]" :title="collapsed ? 'Quality Control' : undefined" aria-label="Quality Control" @click="go('/QualityControl')"><span class="nav-icon nav-icon--quality">✓</span><span>Quality Control</span></button>

      <div class="nav-section-label">SUPPLY & DELIVERY</div>
      <button :class="['nav-item', { active: isActive('/Inventory') }]" :title="collapsed ? 'Inventory' : undefined" aria-label="Inventory" @click="go('/Inventory')"><span class="nav-icon nav-icon--inventory">□</span><span>Inventory</span></button>
      <button :class="['nav-item', { active: isActive('/Purchasing') }]" :title="collapsed ? 'Purchasing' : undefined" aria-label="Purchasing" @click="go('/Purchasing')"><span class="nav-icon nav-icon--purchasing">＋</span><span>Purchasing</span></button>
      <button :class="['nav-item', { active: isActive('/Delivery') }]" :title="collapsed ? 'Delivery' : undefined" aria-label="Delivery" @click="go('/Delivery')"><span class="nav-icon nav-icon--delivery">↗</span><span>Delivery</span></button>

      <div class="nav-section-label">FINANCE & INSIGHTS</div>
      <button :class="['nav-item', { active: isActive('/Finance') }]" :title="collapsed ? 'Finance' : undefined" aria-label="Finance" @click="go('/Finance')"><span class="nav-icon nav-icon--finance">₱</span><span>Finance</span></button>
      <button :class="['nav-item', { active: isActive('/Collections') }]" :title="collapsed ? 'Collections' : undefined" aria-label="Collections" @click="go('/Collections')"><span class="nav-icon nav-icon--collections">◌</span><span>Collections</span></button>
      <button :class="['nav-item', { active: isActive('/AfterSales') }]" :title="collapsed ? 'After-Sales' : undefined" aria-label="After-Sales" @click="go('/AfterSales')"><span class="nav-icon nav-icon--after-sales">↺</span><span>After-Sales</span></button>
      <button :class="['nav-item', { active: isActive('/Reports') }]" :title="collapsed ? 'Reports' : undefined" aria-label="Reports" @click="go('/Reports')"><span class="nav-icon nav-icon--reports">▤</span><span>Reports</span></button>
      </nav>
      <div class="sidebar-bottom">
        <button class="nav-item" title="Settings" aria-label="Settings"><span class="nav-icon">⚙</span><span>Settings</span></button>
        <div class="user-card"><div class="avatar">{{ userInitials }}</div><div><strong>{{ userName }}</strong><small>Operations lead</small></div></div>
      </div>
    </aside>
  </div>
</template>
