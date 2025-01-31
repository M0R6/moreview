<template>
    <h1>Welcome to the landing page!</h1>
</template>

<script setup>
import { useHead } from '#imports';

useHead({
title: 'Landing - Moreview',
  meta: [
    { name: 'description', content: 'See movie trailers, synopsis, reviews on Moreview' },
    { name: 'keywords', content: 'Moreview, Register, Account' },
  ]
});

definePageMeta({
  layout: "anon",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})

</script>
