// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: 'https://self-japanized-manual.buntin.dev',
  integrations: [
    starlight({
      title: 'Self-Japanized-Manual',
      social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/BuntinJP/self-japanized-manual",
				},
			],
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
        {
          label: 'Glance',
          autogenerate: { directory: 'glance' },
        },
      ],
    }),
  ],
});
