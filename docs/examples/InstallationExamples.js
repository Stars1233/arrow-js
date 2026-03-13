export default {
  cdn: `<script type="module">
  import { reactive, html, component } from 'https://esm.sh/@arrow-js/core';
  // Start your app here!
</script>`,
  local: `<script type="module">
  import { reactive, html, component } from '/js/arrow.js';
  // Start your app here!
</script>`,
  npm: `npm install @arrow-js/core`,
  yarn: `yarn add @arrow-js/core`,
}
