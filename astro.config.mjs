// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Self-Japanized-Manual',
      social: {
        github: 'https://github.com/BuntinJP',
      },
      customCss: [
        './src/styles/custom.css',
      ],
      sidebar: [
        {
          label: 'TOP',
          link: '/top/',
        },
        {
          label: 'isync(mbsync)',
          autogenerate: { directory: 'isync' },
        },
      ],
    }),
  ],
});
