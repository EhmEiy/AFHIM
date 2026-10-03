<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import LoginPage from "./pages/LoginPage.vue";
import ManagementDashboardPage from "./pages/ManagementDashboardPage.vue";
import CustomerInquiryListPage from "./pages/CustomerInquiryListPage.vue";
import CustomerInquiryDetailPage from "./pages/CustomerInquiryDetailPage.vue";
import QuotationsPage from "./pages/QuotationsPage.vue";
import ModulePage from "./pages/ModulePage.vue";
import type { LoginResponse } from "./services/AuthService";

const authTokenKey = "afhim_demo_access_token";
const themeStorageKey = "afhim_theme_preference";
const theme = ref(localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light");
document.documentElement.dataset.theme = theme.value;
const getAuthToken = () =>
  localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey);
const setAuthToken = (token: string) => localStorage.setItem(authTokenKey, token);
const clearAuthToken = () => {
  localStorage.removeItem(authTokenKey);
  sessionStorage.removeItem(authTokenKey);
};

const initialPath = window.location.pathname || "/login";
const path = ref(
  initialPath !== "/login" && !getAuthToken() ? "/login" : initialPath,
);
const sidebarCollapsed = ref(false);
const mobileNavOpen = ref(false);
const profileMenuOpen = ref(false);
const userName = ref("User");
const userInitials = ref("U");
const pathSegment = computed(() => path.value.split("/")[2] || "");
const inquiryFilter = computed(() =>
  ["NEW", "FOLLOW-UP", "QUOTED", "NEGOTIATING", "WON", "LOST"].includes(
    pathSegment.value.toUpperCase(),
  )
    ? pathSegment.value.toUpperCase()
    : "ALL",
);
const inquiryMode = computed(() =>
  pathSegment.value === "new-entry"
    ? "new"
    : pathSegment.value &&
        !["new", "follow-up", "quoted", "negotiating", "won", "lost"].includes(
          pathSegment.value.toLowerCase(),
        )
      ? "detail"
      : "list",
);

function navigate(nextPath: string) {
  mobileNavOpen.value = false;

  if (nextPath === "/login") {
    clearAuthToken();
  }

  if (nextPath !== "/login" && !getAuthToken()) {
    window.history.replaceState({}, "", "/login");
    path.value = "/login";
    return;
  }

  window.history.pushState({}, "", nextPath);
  path.value = nextPath;
}
function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, theme.value);
  document.documentElement.dataset.theme = theme.value;
}
function login(response: LoginResponse) {
  if (!response.accessToken) return;

  setAuthToken(response.accessToken);
  const user = response.userData?.[0];
  if (user) {
    userName.value = `${user.firstName} ${user.lastName}`.trim();
    userInitials.value = `${user.firstName[0] || ""}${user.lastName[0] || ""}`;
  }
  navigate("/");
}
function logout() {
  clearAuthToken();
  profileMenuOpen.value = false;
  window.history.replaceState({}, "", "/login");
  path.value = "/login";
}
function handlePopState() {
  mobileNavOpen.value = false;
  const nextPath = window.location.pathname || "/login";

  if (nextPath !== "/login" && !getAuthToken()) {
    window.history.replaceState({}, "", "/login");
    path.value = "/login";
    return;
  }

  path.value = nextPath;
}
onMounted(() => window.addEventListener("popstate", handlePopState));

const pageTitles: Record<string, [string, string]> = {
  "/JobOrders": [
    "Job Orders",
    "Every confirmed project and its permanent JO ID.",
  ],
  "/Design": [
    "Design & Layout",
    "Manage artwork versions, customer approvals, and production release gates.",
  ],
  "/Production": ["Production", "Plan and track printing, heat press, cutting, bundling, and sewing."],
  "/QualityControl": [
    "Quality Control",
    "Review inspections and release approvals.",
  ],
  "/Delivery": ["Delivery", "Coordinate dispatches and delivery handoffs."],
  "/Collections": ["Collections", "Track payments, balances, and receivables."],
  "/Finance": ["Finance", "Review payments, expenses, receivables, and job profitability."],
  "/Inventory": ["Inventory", "Manage fabric, paper, ink, and accessories."],
  "/Purchasing": ["Purchasing", "Move purchase requests through approval, ordering, and receiving."],
  "/AfterSales": ["After-Sales", "Resolve customer issues and feed rework costs back to the job."],
  "/Reports": ["Reports", "Review operational and profitability reporting."],
};
</script>

<template>
  <LoginPage v-if="path === '/login'" @login="login" />
  <main v-else class="app-shell">
    <button
      v-if="mobileNavOpen"
      class="mobile-nav-backdrop"
      type="button"
      aria-label="Close navigation"
      @click="mobileNavOpen = false"
    ></button>
    <Sidebar
      :collapsed="sidebarCollapsed && !mobileNavOpen"
      :mobile-open="mobileNavOpen"
      :user-name="userName"
      :user-initials="userInitials"
      @close-mobile="mobileNavOpen = false"
      @navigate="navigate"
    />
    <section class="dashboard">
      <header class="topbar">
        <div class="topbar-leading">
          <button
            class="desktop-sidebar-toggle"
            type="button"
            :aria-expanded="!sidebarCollapsed"
            aria-controls="primary-navigation"
            :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <span class="sidebar-menu-icon" aria-hidden="true"></span>
          </button>
          <button
            class="mobile-menu-toggle"
            type="button"
            :aria-expanded="mobileNavOpen"
            aria-controls="primary-navigation"
            :aria-label="mobileNavOpen ? 'Close navigation' : 'Open navigation'"
            :title="mobileNavOpen ? 'Close navigation' : 'Open navigation'"
            @click="mobileNavOpen = !mobileNavOpen"
          >
            <span class="sidebar-menu-icon" aria-hidden="true"></span>
          </button>
          <div class="crumb">
            WORKSPACE <span>/</span>
            {{ path === "/" ? "OVERVIEW" : path.slice(1).toUpperCase() }}
          </div>
        </div>
        <div class="top-actions">
          <button
            class="theme-toggle"
            type="button"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-pressed="theme === 'dark'"
            :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            <span aria-hidden="true">{{ theme === "dark" ? "☀" : "☾" }}</span>
          </button>
          <button class="icon-button" aria-label="Notifications">
            ♢<i></i></button
          ><div class="profile-menu">
            <button
              class="avatar avatar--small"
              aria-label="Profile"
              :aria-expanded="profileMenuOpen"
              aria-haspopup="menu"
              @click="profileMenuOpen = !profileMenuOpen"
            >
              {{ userInitials }}
            </button>
            <div v-if="profileMenuOpen" class="profile-dropdown" role="menu">
              <span class="profile-name">{{ userName }}</span>
              <button type="button" role="menuitem" @click="logout">
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>
      <ManagementDashboardPage
        v-if="path === '/'"
        :user-name="userName"
        @navigate="navigate"
      />
      <CustomerInquiryListPage
        v-else-if="path.startsWith('/CustomerInquiry') && inquiryMode === 'list'"
        :filter="inquiryFilter"
        @navigate="navigate"
      />
      <CustomerInquiryDetailPage
        v-else-if="path.startsWith('/CustomerInquiry')"
        :mode="inquiryMode as 'new' | 'detail'"
        :record-id="pathSegment === 'new-entry' ? undefined : pathSegment"
        :salesperson-name="userName"
        @navigate="navigate"
      />
      <QuotationsPage
        v-else-if="path.startsWith('/Quotations')"
        :filter="path.split('/')[2]?.toUpperCase() || 'ALL'"
      />
      <ModulePage
        v-else
        :title="pageTitles[path]?.[0] || 'Workspace'"
        :description="
          pageTitles[path]?.[1] || 'Connected operations workspace.'
        "
      />
    </section>
  </main>
</template>
