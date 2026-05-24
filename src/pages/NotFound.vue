<template>
  <div class="flex flex-col items-center justify-center min-h-dvh bg-gray-100">
    <h1 class="text-6xl font-bold mb-4">
      404
    </h1>

    <p class="text-xl text-gray-700 mb-8">
      Oops! The page you're looking for doesn't exist.
    </p>

    <router-link
      to="/"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Go to Home
    </router-link>
  </div>    
</template>
