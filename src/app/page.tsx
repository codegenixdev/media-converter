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
		const videoSize: string = (data.get('size') || 500) as string;
		const imageSize: string = (data.get('imageSize') || 500) as string;
		const duration: string | null = (data.get('duration') || 3) as string;
		const crop: string | undefined = data.get('crop') as string;
		const fps: string | undefined = (data.get('fps') || '18') as string;
		const outputName: string | undefined = (data.get('outputName') ||
			'out') as string;

		if (!file) {
			throw new Error('No file uploaded');
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const path = join('./public/', file.name);
		await writeFile(path, buffer);

		console.log(fps);

		ffmpeg(path)
			.duration(duration)
			.videoFilters([
				{
					filter: 'scale',
					options: `${videoSize}:${videoSize}:force_original_aspect_ratio=increase`,
				},

				{
					filter: 'fps',
					options: fps,
				},
				!!crop
					? {
							filter: 'crop',
							options: `${videoSize}:${videoSize}`,
					  }
					: { filter: '', options: '' },
			])
			.noAudio()
			.saveToFile(`./public/${outputName}.webm`)
			.on('progress', (progress) => {
				if (progress.percent) {
					console.log(`Processing: ${Math.floor(progress.percent)}% done`);
				}
			})
			.on('end', () => {
				console.log('FFmpeg has finished.');
			})
			.on('error', (error) => {
				console.error(error);
			});

		console.log(imageSize);
		ffmpeg(path)
			.outputOptions(
				'-vf',
				`select=eq(n\\,0),scale=${imageSize}:-1,${
					crop ? 'crop=out_w=min(iw\\,ih):out_h=min(iw\\,ih)' : ''
				}`,
				'-q:v',
				'70',
				'-vcodec',
				'libwebp'
			)
			.output(`./public/${outputName}-ff.webp`)
			.on('end', function () {
				console.log('Finished processing');
			})
			.run();
	}

	return (
		<main className="prose container px-4">
			<h1>Media convertor</h1>

			<form action={upload}>
				<fieldset>
					<legend>Compress video</legend>
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
						type="number"
						placeholder="Image size"
						className="input input-primary w-full max-w-xs"
						name="imageSize"
					/>

					<input
						type="number"
						placeholder="Duration"
						className="input input-primary w-full max-w-xs"
						name="duration"
					/>
					<input
						type="number"
						placeholder="FPS"
						className="input input-primary w-full max-w-xs"
						name="fps"
					/>
					<input
						type="text"
						placeholder="Output Name"
						className="input input-primary w-full max-w-xs"
						name="outputName"
					/>
					<br />

					<label className="label cursor-pointer">
						<span className="label-text">Crop</span>
						<input
							type="checkbox"
							className="checkbox checkbox-primary"
							name="crop"
						/>
					</label>

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
