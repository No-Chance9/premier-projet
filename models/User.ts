import mongoose, { Schema, model } from "mongoose";

export interface UserDocument {
    _id: string;
    email: string;
    role: string;
    password: string;
    name: string;
    surname: string;
    phone: number;
    avatar: string;
    adresse: string;
    ville: string;
    code: number;
    dashboard?: mongoose.Types.ObjectId
    profilePicture?: mongoose.Types.ObjectId ;
    notification?: mongoose.Types.ObjectId;
    resetPasswordToken: string;
    resetPasswordExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const UserSchema = new Schema<UserDocument>({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email is invalid",
        ],
        validate: {
            validator: (value: string) => value.trim().length > 0, // Empêche les espaces uniquement
            message: "Email cannot be empty or only spaces",
        },
    },
    role: {
        type: String,
        default: 'User',
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"], // Minimum 8 characters
        validate: {
            validator: (value: string) => {
                const plainPasswordRegex =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
                const bcryptHashRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
                return plainPasswordRegex.test(value) || bcryptHashRegex.test(value);
            },
            message:
                "Password must be a strong plain password or a valid bcrypt hash.",
        },
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        validate: {
            validator: (value: string) => value.trim().length > 0, // Empêche les espaces uniquement
            message: "Name cannot be empty or only spaces",
        },
        maxlength: [15, "Name can't be longer than 15 characters "], // Max 15 characters

    },
    surname: {
        type: String,
        maxlength: [15, "Surname can't be longer than 15 characters "], // Max 15 characters
    },
    phone: {
        type: Number,
        validate: {
            validator: (value: number) => value.toString().length <= 15, // Vérifie que le nombre a 10 chiffres maximum
            message: "Code cannot be longer than 15 digits",
        },    },
    avatar: {
        type: String,
    },
    adresse: {
        type: String,
        maxlength: [50, "adresse can't be longer than 50 characters "], // Max 50 characters

    },
    ville: {
        type: String,
        maxlength: [30, "ville can't be longer than 30 characters "], // Max 30 characters
    },
    code: {
        type: Number,
        validate: {
            validator: (value: number) => value.toString().length <= 7, // Vérifie que le nombre a 7 chiffres maximum
            message: "Code cannot be longer than 7 digits",
        },
    },
    profilePicture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfilePicture',
        default: null,
    }, // Référence à une image
    dashboard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dashboard',
    },//Ref du dashboard perso
    notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notification',
    },//Ref du dashboard perso
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    }, // Soft delete flag
}, {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Exporter le modèle
const User = mongoose.models?.User || model<UserDocument>('User', UserSchema);
export default User;
