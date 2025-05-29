<template>
  <DashboardPanelWithHeader
    :id="path"
    :title="title"
  >
    <UPage v-if="page">
      <UPageHeader
        :title="page.title"
        class="px-[24px]"
      />
      <UPageBody>
        <ContentRenderer
          v-if="page.body"
          :value="page"
          class="md:max-w-4xl px-[24px]"
        />
      </UPageBody>
      <template
        v-if="page?.body?.toc?.links?.length"
        #right
      >
        <UPageAside>
          <UContentToc
            :links="page.body.toc.links"
            :title="title"
            color="neutral"
            highlight-color="neutral"
          />
        </UPageAside>
      </template>
    </UPage>
    <div v-else>
      About not found
    </div>
  </DashboardPanelWithHeader>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  path: string
}>()
const { data: page } = await useAsyncData(() => queryCollection('content').path(props.path).first(), {
  immediate: true,
  lazy: true,
})
</script>
