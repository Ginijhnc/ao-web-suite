import { createContext, useContext, useState } from 'react';

type UploadStatusContextValue = {
	isUploading: boolean;
	setIsUploading: (isUploading: boolean) => void;
};

const UploadStatusContext = createContext<UploadStatusContextValue | null>(
	null,
);

export const UploadStatusProvider = ({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement => {
	const [isUploading, setIsUploading] = useState(false);

	return (
		<UploadStatusContext value={{ isUploading, setIsUploading }}>
			{children}
		</UploadStatusContext>
	);
};

export const useUploadStatus = (): UploadStatusContextValue => {
	const context = useContext(UploadStatusContext);
	if (!context) {
		throw new Error(
			'useUploadStatus debe usarse dentro de UploadStatusProvider',
		);
	}
	return context;
};
