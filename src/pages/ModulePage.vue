<script setup lang="ts">
defineProps<{ title: string; description: string }>();
</script>
<template>
  <div class="content">
    <div class="page-intro">
      <div>
        <p class="eyebrow">AFHIM OPERATIONS PORTAL</p>
        <h1>{{ title }}</h1>
        <p class="muted">{{ description }}</p>
      </div>
      <button class="outline-button">+ New record</button>
    </div>
    <div class="empty-module">
      <span class="empty-module-icon">◌</span>
      <p class="eyebrow">WORKSPACE READY</p>
      <h2>{{ title }} workspace</h2>
      <p>
        Records connected to the permanent Job Order trail will appear here.
      </p>
    </div>
  </div>
</template>
