import { icons } from '@Components/icons';
import { Menu, MenuItem } from '@mui/material';
import Fade from '@mui/material/Fade';
import { menuPaperStyle } from './LogRowMenu.styles';
import type { LogRowMenuProps } from './LogRowMenu.types';

export const LogRowMenu = ({
	anchorEl,
	onClose,
	actions,
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
			{actions.map((action) => {
				const Icon = icons[action.icon];
				return (
					<MenuItem
						key={action.label}
						onClick={() => {
							action.onClick();
							onClose();
						}}
					>
						<Icon />
						{action.label}
					</MenuItem>
				);
			})}
		</Menu>
	);
};
