import ffmpeg from 'fluent-ffmpeg';
import Link from 'next/link';

import { getVideos } from '@/app/actions';

export default async function ServerUploadPage() {
	async function upload(data: FormData) {
		'use server';

		console.log(data);
		const file: File | null = data.get('file') as File;
		const size: string = (data.get('size') || 500) as string;
		const duration: string | null = (data.get('duration') || 3) as string;
		const crop: string | undefined = data.get('crop') as string;
		const mute: string | undefined = data.get('mute') as string;

		if (!file) {
			throw new Error('No file uploaded');
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		ffmpeg()
			.input('/tmp/test.mp4')
			.duration(duration)
			.videoFilters([
				{
					filter: 'scale',
					options: `${size}:${size}:force_original_aspect_ratio=increase`,
				},

				!!crop
					? {
							filter: 'crop',
							options: `${size}:${size}`,
					  }
					: { filter: '', options: '' },
			])
			.saveToFile('./public/out.webm')
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

		// const path = join('/', 'tmp', result.MEMFS[0].name);
		// await writeFile(path, result.MEMFS[0].data);

		// if (!!mute) {
		// 	ffmpegCommand = ffmpegCommand.noAudio();
		// }

		// ffmpegCommand.run();

		return { success: true };
	}

	return (
		<main>
			<div className="w-52">
				{(await getVideos()).map((item) => (
					<div key={item}>
						<video src={item} controls />
						<Link href={item} download>
							<button className="btn btn-primary">Download</button>
						</Link>
					</div>
				))}
			</div>

			<h1>Media convertor</h1>
			<form action={upload}>
				<fieldset>
					<legend>Compress video</legend>
					<input type="file" name="file" />
					<br />
					<input type="number" name="size" placeholder="size" />
					<input type="number" name="duration" placeholder="duration" />
					<br />
					<label htmlFor="crop">Crop</label>
					<input type="checkbox" id="crop" name="crop" />
					<label htmlFor="mute">Mute</label>
					<input type="checkbox" id="mute" name="mute" />
					<br />
					<input type="submit" value="Upload" />
				</fieldset>
			</form>
		</main>
	);
}
