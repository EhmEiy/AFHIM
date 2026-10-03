<script setup lang="ts">
import { ref } from "vue";
import { authService, type LoginResponse } from "../services/AuthService";

const emit = defineEmits<{
  (event: "login", response: LoginResponse): void;
}>();
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

function dismissError() {
  errorMessage.value = "";
}

async function submitLogin() {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const result = await authService.login({
        username: username.value,
        password: password.value,
      });

    emit("login", result);
  } catch (error) {
    errorMessage.value =
      error instanceof TypeError && error.message === "Failed to fetch"
        ? "Unable to connect to the server."
        : error instanceof Error
          ? error.message
          : "Unable to sign in.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-art" aria-label="AFHIM brand introduction">
      <div class="brand-lockup brand-lockup--light">
        <img class="brand-logo" src="../../images/AFIM_Logo.jpg" alt="AFHIM Clothing" />
        <div>
          <small>CLOTHING & PRINTING<br />SERVICES INC.</small>
        </div>
      </div>
      <div class="art-copy">
        <p class="eyebrow">THE WORKFLOW, CONNECTED</p>
        <h1>Every order.<br /><em>One clear trail.</em></h1>
        <p>
          From the first quotation to final collection, keep every moving part
          of the work connected to its Job Order ID.
        </p>
      </div>
      <div class="art-footer">
        <span>EST. 2014</span><span>MANILA · PH</span>
      </div>
    </section>
    <section class="login-panel">
      <div class="mobile-brand brand-lockup">
        <img class="brand-logo" src="../../images/AFIM_Logo.jpg" alt="AFHIM Clothing" />
        <div>
          <small>CLOTHING & PRINTING<br />SERVICES INC.</small>
        </div>
      </div>
      <div class="login-form-wrap">
        <p class="eyebrow">TEAM ACCESS</p>
        <h2>Welcome back.</h2>
        <p class="muted">
          Sign in to continue managing your connected workflow.
        </p>
        <form @submit.prevent="submitLogin">
          <label for="username">Username</label
          ><input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            required
          />
          <label for="password">Password</label>
          <div class="password-field">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              required
            /><button
              type="button"
              class="reveal-button"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>
          <a class="forgot-password" href="#">Forgot password?</a>
          <button class="primary-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Signing in..." : "Sign in" }} <span>→</span>
          </button>
        </form>
        <p class="security-note">
          <span>◉</span> Demo sign-in works offline; inquiry changes stay in this browser.
        </p>
      </div>
      <p class="login-meta">AFHIM OPERATIONS PORTAL <span>·</span> v1.0</p>
    </section>
    <Transition name="toast">
      <aside v-if="errorMessage" class="login-toast" role="alert" aria-live="assertive">
        <span class="toast-icon" aria-hidden="true">!</span>
        <div class="toast-content">
          <strong>Sign-in failed</strong>
          <p>{{ errorMessage }}</p>
        </div>
        <button
          class="toast-dismiss"
          type="button"
          aria-label="Dismiss sign-in error"
          title="Dismiss"
          @click="dismissError"
        >
          ×
        </button>
      </aside>
    </Transition>
  </main>
</template>
