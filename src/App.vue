<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { supabaseConfigured } from './lib/supabase'

const auth = useAuthStore()
</script>

<template>
  <div v-if="!supabaseConfigured" class="config-error">
    <div class="config-card">
      <div class="config-icon">!</div>
      <h1>Supabase Not Configured</h1>
      <p>The app can't connect to Supabase. Set the following environment variables to get started:</p>
      <div class="config-vars">
        <code>VITE_SUPABASE_URL</code>
        <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
      </div>
      <div class="config-steps">
        <p><strong>1.</strong> Copy <code>.env.example</code> to <code>.env</code></p>
        <p><strong>2.</strong> Fill in your Supabase project URL and publishable key</p>
        <p><strong>3.</strong> Restart the dev server</p>
      </div>
    </div>
  </div>
  <div v-else-if="auth.loading" class="loading">Loading...</div>
  <router-view v-else />
</template>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.config-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.config-card {
  max-width: 480px;
  width: 100%;
  text-align: center;
}

.config-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #fef3c7;
  color: #b45309;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

@media (prefers-color-scheme: dark) {
  .config-icon {
    background: rgba(180, 83, 9, 0.2);
    color: #fbbf24;
  }
}

.config-card h1 {
  font-size: 1.5rem;
  margin: 0 0 8px;
}

.config-card > p {
  color: var(--text);
  margin-bottom: 24px;
  line-height: 1.6;
}

.config-vars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin-bottom: 28px;
}

.config-vars code {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-family: ui-monospace, Consolas, monospace;
  background: var(--hover-bg, #f9fafb);
  border: 1px solid var(--border);
  color: var(--text-h);
}

.config-steps {
  text-align: left;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.config-steps p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.config-steps code {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--hover-bg, #f9fafb);
  border: 1px solid var(--border);
}
</style>
