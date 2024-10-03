<script setup lang="ts">
const { buttonText, description, label, placeholder, visible } = useAppConfig().newsletter
const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
  if (loading.value) {
    return
  }
  loading.value = true

  $fetch('', {
    method: 'POST',
    body: { email: email.value },
  }).then(() => {
    toast.add({ title: 'Abonnement ausstehend', description: 'Bitte prüfen Sie Ihre E-Mails, um Ihr Abonnement zu bestätigen.', color: 'green' })
    email.value = ''
  }).catch((err) => {
    const description = err.data?.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.'
    toast.add({ title: 'Abonnement fehlgeschlagen', description, color: 'red' })
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <form v-if="visible" @submit.prevent="onSubmit">
    <UFormGroup name="email" :label="label" :description="description" size="md" :ui="{ container: 'mt-2' }">
      <UInput
        v-model="email"
        type="email"
        :placeholder="placeholder"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        required
        autocomplete="off"
        class="max-w-sm"
      >
        <template #trailing>
          <UButton type="submit" size="2xs" color="black" :label="loading ? 'Abboniert' : buttonText" :loading="loading" />
        </template>
      </UInput>
    </UFormGroup>
  </form>
</template>
