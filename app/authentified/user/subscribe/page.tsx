'use client';

import React from "react";

export default function Subscribe() {
    const plans = [
        {
            name: "Basic Plan",
            description: [
                "Accédez à toutes les fonctionnalités de base.",
                "Suivi des ventes et des produits.",
            ],
            notice: "Ne permet pas la gestion avancée.",
            buttonText: "Choisir Basic",
            recommended: false,
        },
        {
            name: "Pro Plan",
            description: [
                "Accédez à toutes les fonctionnalités avancées.",
                "Gestion des ventes, produits et clients.",
                "Analyse complète avec des graphiques.",
            ],
            notice: "Le plan recommandé pour la gestion avancée.",
            buttonText: "Choisir Pro",
            recommended: true,
        },
        {
            name: "Enterprise Plan",
            description: [
                "Accès complet à toutes les fonctionnalités.",
                "Support prioritaire.",
                "Fonctionnalités personnalisées pour votre entreprise.",
            ],
            notice: "Idéal pour les grandes entreprises.",
            buttonText: "Choisir Enterprise",
            recommended: false,
        },
    ];

    return (
        <main className="p-4 mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold text-center mb-8">
                Choisissez un plan d'abonnement adapté à vos besoins
            </h1>
            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`border rounded-lg p-6 shadow-lg ${
                            plan.recommended ? "border-blue-500" : "border-gray-300"
                        }`}
                    >
                        {plan.recommended && (
                            <div className="absolute -mt-12 bg-blue-500 text-white px-4 py-1 rounded-md text-sm">
                                Recommandé
                            </div>
                        )}
                        <h2 className="text-xl font-semibold mb-4">{plan.name}</h2>
                        <ul className="space-y-2 mb-4">
                            {plan.description.map((desc, i) => (
                                <li key={i} className="flex items-center">
                                    <span className="text-green-500 mr-2">✔️</span>
                                    {desc}
                                </li>
                            ))}
                        </ul>
                        <p className="text-yellow-500 text-sm mb-4">{plan.notice}</p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full">
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
            {/* <div className="mt-8 text-center">
                <button className="text-blue-500 underline">
                    Revenir à la page de connexion
                </button>
            </div> */}
        </main>
    );
}