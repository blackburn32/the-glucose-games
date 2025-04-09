<template>
  <Dropdown>
    <div class="flex items-center">
      <span class="sr-only">Music</span>
      <Icon
        name="ph:game-controller-bold"
        size="24"
      />
    </div>
    <template #dropdown>
      <ul ref="dropdown">
        <li>
          <NuxtLink
            class="font-medium text-sm hover:brightness-125 flex items-center py-1 px-3 space-x-4"
            to="/current"
          >
            <Icon
              name="ph:syringe"
              size="16"
            />
            <span>Current Games</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="font-medium text-sm hover:brightness-125 flex items-center py-1 px-3 space-x-4"
            to="/history"
          >
            <Icon
              name="ph:clock-counter-clockwise-bold"
              size="16"
            />
            <span>Gaming Records</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="font-medium text-sm hover:brightness-125 flex items-center py-1 px-3 space-x-4"
            to="/achievements"
          >
            <Icon
              name="ph:trophy"
              size="16"
            />
            <span>Achievements</span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </Dropdown>
</template>
