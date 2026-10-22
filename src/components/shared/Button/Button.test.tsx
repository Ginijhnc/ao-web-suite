import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '.';

describe('Button', () => {
	// really basic test to check vitest implementation
	it('should call onClick handler when clicked', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();
		render(
			<Button size="md" variant="primary" onClick={handleClick}>
				Click me
			</Button>,
		);
		await user.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledOnce();
	});
});
