import ffmpeg from 'fluent-ffmpeg';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { Photos } from '@/app/components/Images';
import { Videos } from '@/app/components/Videos';

export default async function Page() {
	async function upload(data: FormData) {
		'use server';

		console.log(data);
		const file: File | null = data.get('file') as File;
		const outputName: string | undefined = (data.get('outputName') ||
			'out') as string;
		const size: string | undefined = (data.get('size') || '800') as string;
		const quality: string | undefined = (data.get('quality') || '50') as string;

		if (!file) {
			throw new Error('No file uploaded');
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const path = join('./public/', file.name);
		await writeFile(path, buffer);

		ffmpeg(path)
			.outputOptions([
				'-c:v libwebp',
				`-q:v ${quality}`,
				`-vf scale=${size}:-1`,
			])
			.output(`./public/${outputName}.webp`)
			.on('end', () => console.log('Finished processing'))
			.run();
	}

	return (
		<main className="prose container px-4">
			<form action={upload}>
				<fieldset>
					<h2>Compress image</h2>
					<input
						type="file"
						className="file-input w-full max-w-xs"
						name="file"
						required
					/>
					<br />
					<input
						type="number"
						placeholder="Size"
						className="input input-primary w-full max-w-xs"
						name="size"
					/>
					<input
						type="text"
						placeholder="Quality"
						className="input input-primary w-full max-w-xs"
						name="quality"
					/>
					<input
						type="text"
						placeholder="Output Name"
						className="input input-primary w-full max-w-xs"
						name="outputName"
					/>

					<br />
					<button className="btn btn-primary" type="submit">
						Upload
					</button>
				</fieldset>
			</form>
			<div className="flex gap-5">
				<Videos />
				<Photos />
			</div>
		</main>
	);
}
