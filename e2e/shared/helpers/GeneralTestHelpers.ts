import fs from 'fs';
import path from 'path';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';

const getFilePathsFromDirectory = (dir: string): Array<string> => {
	return fs
		.readdirSync(dir)
		.filter((f) => {
			return fs.statSync(path.join(dir, f)).isFile();
		})
		.map((f) => {
			return path.join(dir, f);
		});
};

const uploadFiles = async (
	page: Page,
	uploadButtonTestId: string,
	files: Array<string>,
	expectedToastText: RegExp | string,
): Promise<void> => {
	const fileChooser = page.waitForEvent('filechooser');
	await page.getByTestId(uploadButtonTestId).click();
	const chooser = await fileChooser;
	await chooser.setFiles(files);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		expectedToastText,
	);
};

export const GeneralTestHelpers = {
	getFilePathsFromDirectory,
	uploadFiles,
};
