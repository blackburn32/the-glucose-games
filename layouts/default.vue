<template>
  <UDashboardGroup>
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      class="bg-(--ui-bg-elevated)/25"
      collapsible
      :ui="{ footer: 'lg:border-t lg:border-(--ui-border)', root: 'w-fit max-w-[280px]' }"
    >
      <template #header="{ collapsed }">
        <div
          class="flex items-center justify-center"
          :class="{
            'space-x-2': !collapsed,
          }"
        >
          <UDashboardSidebarCollapse icon="ph-list" />
          <NuxtLink
            v-if="!collapsed"
            to="/"
            class="shrink-0"
          >
            <NuxtImg
              class="w-8 h-8"
              src="/favicon.png"
              width="128"
              height="128"
            />
          </NuxtLink>
          <div
            v-if="!collapsed"
            class="text-xl font-bold"
          >
            Glucose Games
          </div>
        </div>
      </template>
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          orientation="vertical"
        />
        <SidebarDemoModeController
          class="mt-auto"
          :collapsed="collapsed"
        />
      </template>
      <template #footer="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="aboutLinks"
          orientation="vertical"
        />
      </template>
    </UDashboardSidebar>
    <UDashboardSearch
      :groups="groups"
      :color-mode="false"
    />
    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
const route = useRoute()

const open = ref(false)

const aboutLinks = [
  {
    label: 'Information',
    to: '/about/general',
    icon: 'i-ph-info-fill',
    children: [
      {
        label: 'About',
        to: '/about/general',
        icon: 'i-ph-info-fill',
        onSelect: () => {
          open.value = false
        },
      }, {
        label: 'Nightscout',
        to: '/about/nightscout',
        icon: 'i-ph-chart-line-fill',
        onSelect: () => {
          open.value = false
        },
      }, {
        label: 'Privacy Policy',
        to: '/about/privacy',
        icon: 'i-ph-shield-check-fill',
        onSelect: () => {
          open.value = false
        },
      }, {
        label: 'Terms of Service',
        to: '/about/terms',
        icon: 'i-ph-file-text-fill',
        onSelect: () => {
          open.value = false
        },
      },
    ],
  },
]

const links = [{
  label: 'Dashboard',
  icon: 'i-ph-house-fill',
  to: '/current',
  onSelect: () => {
    open.value = false
  },
}, {
  label: 'Records',
  icon: 'i-ph-user-fill',
  to: '/history',
  onSelect: () => {
    open.value = false
  },
}, {
  label: 'Achievements',
  icon: 'i-ph-trophy-fill',
  to: '/achievements',
  onSelect: () => {
    open.value = false
  },
}, {
  label: 'Settings',
  to: '/account',
  icon: 'i-ph-gear-fill',
}]

const groups = computed(() => [
  {
    id: 'links',
    label: 'Go to',
    items: [...links.flat()],
  }, {
    id: 'information',
    label: 'Information',
    items: [...aboutLinks.map(link => link.children).flat()],
  }, {
    id: 'code',
    label: 'Code',
    items: [{
      id: 'source',
      label: 'View page source',
      icon: 'i-simple-icons-github',
      to: `https://github.com/blackburn32/the-glucose-games/tree/master/pages${route.path === '/' ? '/index' : route.path}.vue`,
      target: '_blank',
    }],
  },
])
</script>
