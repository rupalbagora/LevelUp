<<<<<<< HEAD
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite";
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [tailwindcss(), react()],
=======
// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'
// // import tailwindcss from "@tailwindcss/vite";
// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [tailwindcss(), react()],
// // });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [tailwindcss(), react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//       },
//     },
//   },
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
<<<<<<< HEAD
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
=======
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
});