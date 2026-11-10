import { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'react-router';

export type ProgressBarState = {
	visible: boolean;
	width: number;
	opacity: number;
};

const INITIAL_STATE: ProgressBarState = {
	visible: false,
	width: 0,
	opacity: 1,
};
const SHOW_DELAY_MS = 150;

const scheduleTrickle = (
	setBar: React.Dispatch<React.SetStateAction<ProgressBarState>>,
): Array<ReturnType<typeof setTimeout>> => {
	const tickCount = 3 + Math.floor(Math.random() * 3);
	const timeouts: Array<ReturnType<typeof setTimeout>> = [];
	let elapsed = 0;

	for (let i = 0; i < tickCount; i++) {
		elapsed += 300 + Math.random() * 400;
		const id = setTimeout(() => {
			setBar((prev) => {
				return {
					...prev,
					width: Math.min(
						prev.width + 2 + Math.random() * 3,
						85,
					),
				};
			});
		}, elapsed);
		timeouts.push(id);
	}

	return timeouts;
};

export const useNavigationProgressBar = (): ProgressBarState => {
	const navigation = useNavigation();
	const isLoading = navigation.state === 'loading';
	const [bar, setBar] = useState<ProgressBarState>(INITIAL_STATE);
	const barVisibleRef = useRef(false);

	useEffect(() => {
		if (isLoading) {
			let tickTimeouts: Array<ReturnType<typeof setTimeout>> = [];

			const showId = setTimeout(() => {
				const initialWidth = 15 + Math.random() * 15;
				setBar({ visible: true, width: initialWidth, opacity: 1 });
				barVisibleRef.current = true;
				tickTimeouts = scheduleTrickle(setBar);
			}, SHOW_DELAY_MS);

			return () => {
				clearTimeout(showId);
				tickTimeouts.forEach(clearTimeout);
			};
		}

		if (!barVisibleRef.current) return;

		barVisibleRef.current = false;

		setBar((prev) => {
			return { ...prev, width: 100 };
		});

		const fadeId = setTimeout(() => {
			setBar((prev) => {
				return { ...prev, opacity: 0 };
			});
		}, 150);

		const resetId = setTimeout(() => {
			setBar(INITIAL_STATE);
		}, 450);

		return () => {
			clearTimeout(fadeId);
			clearTimeout(resetId);
		};
	}, [isLoading]);

	return bar;
};
