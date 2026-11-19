/// <reference types="vite/client" />

interface ImportMetaEnv {
	// The public URL of the site, used for canonical URLs and OG tags
	readonly VITE_SITE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
