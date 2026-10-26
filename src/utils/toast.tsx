import { WarningIcon } from '@Components/icons/WarningIcon';
import {
	errorToastStyle,
	successToastStyle,
	toastBaseStyle,
	warningIconContainerStyle,
	warningToastStyle,
} from '@Components/shared/ToastContainer/ToastContainer.styles';
import toast from 'react-hot-toast';

const success = (message: string): void => {
	toast.success(message, {
		className: `${toastBaseStyle} ${successToastStyle}`,
	});
};

const warning = (message: string): void => {
	toast(message, {
		icon: (
			<div className={warningIconContainerStyle}>
				<WarningIcon />
			</div>
		),
		className: `${toastBaseStyle} ${warningToastStyle}`,
	});
};

const error = (message: string): void => {
	toast.error(message, {
		className: `${toastBaseStyle} ${errorToastStyle}`,
	});
};

export const Toast = { success, warning, error } as const;
