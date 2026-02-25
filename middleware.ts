import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(request: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;
    const isSecure = request.nextUrl.protocol === "https:";

    // Récupérer le token JWT de la requête
    const token = await getToken({ req: request, secret, secureCookie: isSecure });
    console.log('token:', token);

    // Si aucun token n'est présent, rediriger vers la page de connexion
    if (!token) {
        console.log('Token absent, redirection vers la page de connexion');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const { pathname } = request.nextUrl;

    // Autoriser l'Admin à accéder à toutes les routes
    if (token.role === 'Admin') {
        console.log('Admin, accès accordé à toutes les routes.');
        return NextResponse.next();
    }

    // Vérification pour les routes spécifiques à 'User'
    if (pathname.startsWith('/authentified/user')) {
        if (token.role !== 'User') {
            console.log('Accès refusé pour une route utilisateur.');
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
        // Autoriser les utilisateurs
        return NextResponse.next();
    }

    // Vérification pour les autres routes sous '/authentified'
    if (pathname.startsWith('/authentified')) {
        console.log('Accès refusé pour une route protégée.');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Par défaut, autoriser les autres routes
    return NextResponse.next();
}

export const config = {
    matcher: ['/authentified/:path*'], // Applique le middleware aux routes nécessaires
};
