import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return NextResponse.json(
                { error: "Adresse email invalide." },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Aucun utilisateur trouvé avec cette adresse email." },
                { status: 404 }
            );
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
        await user.save();

        const appBaseUrl = process.env.NEXTAUTH_URL?.trim();
        if (!appBaseUrl) {
            return NextResponse.json(
                { error: "NEXTAUTH_URL is not configured." },
                { status: 500 }
            );
        }

        const resetUrl = new URL(`/reset-password?token=${resetToken}`, appBaseUrl).toString();

        const transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        await transporter.sendMail({
            from: '"Support" <support@example.com>',
            to: email,
            subject: "Réinitialisation de mot de passe",
            text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`,
            html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
                <a href="${resetUrl}">${resetUrl}</a>`,
        });

        return NextResponse.json({ message: "Email de réinitialisation envoyé." });
    } catch (error) {
        console.error("Erreur serveur :", error);
        return NextResponse.json(
            { error: "Erreur lors du traitement de la demande." },
            { status: 500 }
        );
    }
}
