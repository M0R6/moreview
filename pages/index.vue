<template>
  <p>This is your index component!</p>
</template>

<script setup>
import { useHead } from '#imports';

useHead({
title: 'Dashboard - Moreview',
  meta: [
    { name: 'description', content: 'Create an account on Moreview' },
    { name: 'keywords', content: 'Moreview, Register, Account' },
  ]
});
</script>