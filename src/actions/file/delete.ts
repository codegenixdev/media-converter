'use server';
import fs from 'fs';
import { revalidatePath } from 'next/cache';

export async function deleteFile(data: FormData) {
	const fileName: string | undefined = data.get('fileName') as string;

	fs.unlinkSync(`./public/${fileName}`);
	revalidatePath('/');
}
