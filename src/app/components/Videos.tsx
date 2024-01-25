import fs from 'fs';
import path from 'path';

import { deleteFile } from '@/actions/file/delete';

export async function Videos() {
	const dir = path.resolve('./public');
	const fileNames = fs
		.readdirSync(dir)
		.filter((item) =>
			['webm'].includes(item.split('.')[item.split('.').length - 1])
		);

	return (
		<div className="flex flex-wrap gap-5 justify-center">
			{fileNames.map((item) => (
				<div key={item}>
					<video className="h-56 w-full" src={item} controls />
					<a href={item} download>
						<button className="btn btn-info w-full">Download</button>
					</a>

					<form action={deleteFile}>
						<input type="hidden" name="fileName" value={item} />
						<button className="btn btn-error" type="submit">
							Delete
						</button>
					</form>
				</div>
			))}
		</div>
	);
}
