import { useState } from 'react';
import { CheckIcon, CopyIcon } from '@Components/icons';
import { Text } from '@Components/shared/Text';
import { LOGS_MESSAGES } from '@Constants/messages';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { cx } from '@emotion/css';
import { Toast } from '@Utils/toast';
import {
	codeBlockPreStyle,
	codeBlockWrapperStyle,
	copyButtonStyle,
	scrollHintStyle,
} from './CodeBlock.styles';
import type { CodeBlockProps } from './CodeBlock.types';

const CopyButton = ({
	code,
	isScrollable,
}: {
	code: string;
	isScrollable: boolean;
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		void navigator.clipboard.writeText(code).then(
			() => {
				Toast.success(LOGS_MESSAGES.COPY_SUCCESS);
				setCopied(true);
				setTimeout(() => {
					setCopied(false);
				}, 2000);
			},
			() => {
				Toast.error(LOGS_MESSAGES.COPY_ERROR);
			},
		);
	};

	return (
		<button
			type="button"
			className={copyButtonStyle(isScrollable)}
			onClick={handleCopy}
			aria-label="Copiar"
		>
			{copied ? (
				<CheckIcon data-icon="check" />
			) : (
				<CopyIcon data-icon="copy" />
			)}
		</button>
	);
};

export const CodeBlock = ({ code, className }: CodeBlockProps) => {
	const [isOverflowing, setIsOverflowing] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);

	const handleRef = (el: HTMLPreElement | null) => {
		if (el !== null) {
			setIsOverflowing(el.scrollHeight > el.clientHeight);
		}
	};

	const handleScroll = (event: React.UIEvent<HTMLPreElement>) => {
		setHasScrolled(event.currentTarget.scrollTop > 0);
	};

	return (
		<div className={cx(codeBlockWrapperStyle, className)}>
			<CopyButton code={code} isScrollable={isOverflowing} />
			<pre
				ref={handleRef}
				onScroll={handleScroll}
				className={codeBlockPreStyle}
			>
				<Text renderAs="span" variant="body" size="sm">
					{code}
				</Text>
			</pre>
			{isOverflowing && (
				<div
					data-testid={GENERAL_SELECTORS.SCROLL_HINT}
					className={scrollHintStyle(!hasScrolled)}
				/>
			)}
		</div>
	);
};
