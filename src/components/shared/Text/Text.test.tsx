import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
	it('renders as <p> when no renderAs is passed', () => {
		render(<Text>Hola mundo</Text>);
		expect(screen.getByText('Hola mundo').tagName).toBe('P');
	});

	it('renders as <span> when renderAs="span"', () => {
		render(
			<Text variant="label" renderAs="span">
				Etiqueta
			</Text>,
		);
		expect(screen.getByText('Etiqueta').tagName).toBe('SPAN');
	});

	it('renders as <a> when renderAs="a"', () => {
		render(<Text renderAs="a">Enlace</Text>);
		expect(screen.getByText('Enlace').tagName).toBe('A');
	});

	it('overrides the element via renderAs without changing the variant', () => {
		render(
			<Text variant="body" renderAs="span">
				En línea
			</Text>,
		);
		expect(screen.getByText('En línea').tagName).toBe('SPAN');
	});

	it('passes native props through to the element', () => {
		render(
			<Text renderAs="a" href="https://example.com">
				Ir al sitio
			</Text>,
		);
		expect(screen.getByText('Ir al sitio')).toHaveAttribute(
			'href',
			'https://example.com',
		);
	});

	it('renders headings via renderAs', () => {
		const cases = [
			{ tag: 'h1', label: 'Título 1' },
			{ tag: 'h2', label: 'Título 2' },
			{ tag: 'h3', label: 'Título 3' },
		] as const;

		for (const { tag, label } of cases) {
			const { unmount } = render(
				<Text renderAs={tag}>{label}</Text>,
			);
			expect(screen.getByText(label).tagName).toBe(
				tag.toUpperCase(),
			);
			unmount();
		}
	});
});
