import type { PageMetaEntry } from '@Constants/seo';

export const PageMetadata = ({
	title,
	description,
	canonical,
	ogImage,
}: PageMetaEntry): React.ReactElement => {
	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={canonical} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={canonical} />
			<meta property="og:image" content={ogImage} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={ogImage} />
		</>
	);
};
