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
    <UPage v-else>
      <UPageHeader
        title="Loading"
        class="px-[24px]"
      />
      <UPageBody>
        <div>
          Loading...
        </div>
      </UPageBody>
    </UPage>
  </DashboardPanelWithHeader>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  path: string
}>()
const { data: page } = await useAsyncData(`content-${props.path}`, () => queryCollection('content').path(props.path).first(), {
  immediate: true,
})
</script>
