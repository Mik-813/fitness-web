<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="animate-spin"
  >
    <defs>
      <linearGradient
        id="throbber-grad"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop
          offset="0%"
          stop-color="#9810FA"
        />

        <stop
          offset="100%"
          stop-color="#4D37EF"
        />
      </linearGradient>
    </defs>

    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#E5E5F7"
      stroke-width="3"
      class="opacity-25"
    />

    <path
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22"
      stroke="url(#throbber-grad)"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</template>
