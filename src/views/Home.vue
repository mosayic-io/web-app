<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleSignOut() {
  await auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-brand">Web App</div>
      <div class="nav-right">
        <span class="nav-email">{{ auth.user?.email }}</span>
        <button class="btn-sign-out" @click="handleSignOut">Sign Out</button>
      </div>
    </nav>

    <main class="content">
      <h1>Home</h1>
      <p>You're signed in. Start building from here.</p>
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.nav-brand {
  font-weight: 600;
  font-size: 17px;
  color: var(--text-h);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-email {
  font-size: 14px;
  color: var(--text);
}

.btn-sign-out {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text-h);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-sign-out:hover {
  background: var(--hover-bg);
  border-color: var(--text);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 12px;
}

.content h1 {
  font-size: 2rem;
}
</style>
