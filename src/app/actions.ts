'use server';
import fs from 'fs';
import path from 'path';

export async function getVideos() {
	const dir = path.resolve('./public');
	return fs
		.readdirSync(dir)
		.filter((item) =>
			['webm'].includes(item.split('.')[item.split('.').length - 1])
		);
}
