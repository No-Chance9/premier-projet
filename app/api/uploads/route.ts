import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import ProfilePicture from '../../../models/ProfilePicture';

// API Route pour le téléchargement et l'enregistrement en BDD
export async function POST(req: Request) {
    await connectDB(); // Connexion à MongoDB

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    if (!file) {
        return NextResponse.json({ error: 'File is missing' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // Sauvegarder l'image en base (évite le filesystem local non persistant en prod)
    try {
        const newImage = await ProfilePicture.create({
            fileName: file.name,
            path: dataUri,
            description: description || '',
        });
        return NextResponse.json({ message: 'File uploaded successfully', file: newImage });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement en BDD :", error);
        return NextResponse.json({ error: `Failed to save file metadata: ${error}` }, { status: 500 });
    }
}
