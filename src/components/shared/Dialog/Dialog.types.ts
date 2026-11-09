export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type DialogRootProps = {
	open: boolean;
	onClose: () => void;
	size: DialogSize;
	className?: string;
	children: React.ReactNode;
};

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
	title: React.ReactNode;
};

export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement>;

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

export type DialogDividerProps = React.HTMLAttributes<HTMLHRElement>;

export type DialogCloseButtonProps =
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		onClose: () => void;
	};

export type DialogIconProps = React.HTMLAttributes<HTMLDivElement> & {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
