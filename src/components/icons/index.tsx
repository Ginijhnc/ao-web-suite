import { ArrowForwardIcon } from './ArrowForwardIcon';
import { CheckIcon } from './CheckIcon';
import { ChevronLeftIcon } from './ChevronLeftIcon';
import { ChevronRightIcon } from './ChevronRightIcon';
import { CloseIcon } from './CloseIcon';
import { CodeIcon } from './CodeIcon';
import { CopyIcon } from './CopyIcon';
import { DatsIcon } from './DatsIcon';
import { ErrorIcon } from './ErrorIcon';
import { EyeIcon } from './EyeIcon';
import { HomeIcon } from './HomeIcon';
import { ImageIcon } from './ImageIcon';
import { IndexingDataIcon } from './IndexingDataIcon';
import { InfoIcon } from './InfoIcon';
import { LogsIcon } from './LogsIcon';
import { MapeadorIcon } from './MapeadorIcon';
import { MenuIcon } from './MenuIcon';
import { MoreHorizIcon } from './MoreHorizIcon';
import { SearchIcon } from './SearchIcon';
import { SearchOffIcon } from './SearchOffIcon';
import { SettingsIcon } from './SettingsIcon';
import { TrashIcon } from './TrashIcon';
import { TutorialIcon } from './TutorialIcon';
import { UploadIcon } from './UploadIcon';
import { WarningIcon } from './WarningIcon';

// Named exports for direct imports when the icon is statically known.
export {
	ArrowForwardIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CloseIcon,
	CodeIcon,
	CopyIcon,
	DatsIcon,
	ErrorIcon,
	EyeIcon,
	HomeIcon,
	ImageIcon,
	IndexingDataIcon,
	InfoIcon,
	LogsIcon,
	MapeadorIcon,
	MenuIcon,
	MoreHorizIcon,
	SearchIcon,
	SearchOffIcon,
	SettingsIcon,
	TrashIcon,
	TutorialIcon,
	UploadIcon,
	WarningIcon,
};

// Map for dynamic lookup by IconName
export const icons = {
	ArrowForwardIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CloseIcon,
	CodeIcon,
	CopyIcon,
	DatsIcon,
	ErrorIcon,
	EyeIcon,
	HomeIcon,
	ImageIcon,
	IndexingDataIcon,
	InfoIcon,
	LogsIcon,
	MapeadorIcon,
	MenuIcon,
	MoreHorizIcon,
	SearchIcon,
	SearchOffIcon,
	SettingsIcon,
	TrashIcon,
	TutorialIcon,
	UploadIcon,
	WarningIcon,
};

export type IconProps = React.SVGProps<SVGSVGElement>;

export type IconName = keyof typeof icons;
