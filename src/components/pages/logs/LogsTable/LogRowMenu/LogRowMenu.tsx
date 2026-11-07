import { EyeIcon } from '@Components/icons';
import { Menu, MenuItem } from '@mui/material';
import Fade from '@mui/material/Fade';
import { menuPaperStyle } from './LogRowMenu.styles';
import type { LogRowMenuProps } from './LogRowMenu.types';

export const LogRowMenu = ({
	anchorEl,
	onClose,
	paperRef,
}: LogRowMenuProps) => {
	return (
		<Menu
			anchorEl={anchorEl}
			open={anchorEl !== null}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			slots={{ transition: Fade }}
			slotProps={{
				paper: { className: menuPaperStyle, ref: paperRef },
			}}
			disableScrollLock
		>
			<MenuItem onClick={onClose}>
				<EyeIcon />
				Ver detalle
			</MenuItem>
		</Menu>
	);
};
