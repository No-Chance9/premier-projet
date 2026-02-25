"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { MinusCircleIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

export const YearlyVisitorsChart = ({ dashboardData }: any) => {
    const [chartData, setChartData] = useState<{
        labels: string[];
        visitors: number[];
    }>({
        labels: [],
        visitors: [],
    });

    const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility

    const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false); // State to control form visibility

    const [newLabel, setNewLabel] = useState(""); // Input state for label

    const [newVisitor, setNewVisitor] = useState<number | "">(""); // Input state for visitor count

    const [error, setError] = useState(""); // Error message state


    useEffect(() => {
        if (dashboardData?.yearlyVisitors) {
            const labels = dashboardData.yearlyVisitors.map((item: any) => item.label);
            const visitors = dashboardData.yearlyVisitors.map((item: any) => item.value);

            setChartData({ labels, visitors });
        }
    }, [dashboardData]);

    const handleAddData = async () => {
        // Validation pour éviter les erreurs côté utilisateur
        if (!newLabel.trim()) {
            setError("Label cannot be empty.");
            return;
        }
        if (newVisitor === "" || newVisitor < 0) {
            setError("Visitors count must be a non-negative number.");
            return;
        }
    
        // Mise à jour localement pour un rendu immédiat
        setChartData((prevData) => ({
            labels: [...prevData.labels, newLabel],
            visitors: [...prevData.visitors, newVisitor],
        }));
    
        setError(""); // Réinitialisation des erreurs
    
        try {
            // Enregistrement dans la base de données via API
            const response = await fetch(`/api/dashboards/${dashboardData._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "yearlyVisitors",
                    data: {
                        label: newLabel,
                        value: newVisitor,
                    },
                }),
            });
    
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Failed to add new yearly data.");
            }
    
            console.log("Data successfully saved in database.");
        } catch (error: any) {
            console.error("Error adding data:", error);
            setError(error.message || "Failed to save data.");
        } finally {
            // Nettoyage des champs d'entrée
            setNewLabel("");
            setNewVisitor("");
        }
    };

    const handleDeleteLabel = async (label: string) => {
        const userConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer le label ?");
        if (!userConfirmed) {
            return; // Si l'utilisateur clique sur "Annuler", on sort de la fonction
        }

        try {
            const response = await fetch(`/api/dashboards/${dashboardData._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: 'yearlyVisitors',
                    name: label,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete label.");
            }

            // Mettre à jour les données du front après suppression
            setChartData((prevData) => ({
                labels: prevData.labels.filter((l) => l !== label), // Supprimer le label correspondant
                visitors: prevData.visitors.filter((_, index) => prevData.labels[index] !== label), // Supprimer le visiteur correspondant
            }));

            // sendLabelToparent(newLabel);
        } catch (error) {
            console.error("Error deleting label:", error);
        }
    };

    const dataPie = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Visitors",
                data: chartData.visitors,
                backgroundColor: [
                    "rgba(54, 162, 235, 0.6)",  // Bleu
                    "rgba(255, 206, 86, 0.6)",  // Jaune
                    "rgba(75, 192, 192, 0.6)",  // Vert menthe
                    "rgba(255, 159, 64, 0.6)",  // Orange
                    "rgba(153, 102, 255, 0.6)", // Violet
                    "rgba(201, 203, 207, 0.6)", // Gris clair
                    "rgba(255, 99, 132, 0.6)",  // Rouge clair
                    "rgba(129, 199, 132, 0.6)", // Vert clair
                    "rgba(255, 215, 0, 0.6)",   // Or
                    "rgba(244, 143, 177, 0.6)"  // Rose clair
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-5 relative">
            <h3 className="text-xl font-semibold mb-4">2023 Visitors This Year</h3>
            <div className="flex items-center mb-4 w-fit"
                onClick={() => setIsFormOpen(!isFormOpen)} // Toggle form visibility
            >
                <PlusCircleIcon
                    className="h-5 w-5 text-gray-400 mr-2 hover:text-blue-400 cursor-pointer"
                />
                <span className="hover:underline">Add New Label</span>
            </div>
            <div className="flex items-center mb-4 w-fit"
                onClick={() => setIsDeleteFormOpen(!isDeleteFormOpen)} // Toggle form visibility
            >
                <MinusCircleIcon className="h-5 w-5 text-gray-400 mr-2 hover:text-blue-400 cursor-pointer" />
                <span className="hover:underline">Delete  Label</span>
            </div>

            {/* Conditionally render the form */}
            {isFormOpen && (
                <div className="md:absolute max-w-24 static bg-gray-50 shadow-lg rounded-md p-4 w-full z-10">
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>} {/* Display error if exists */}
                    <div className="mb-2">
                        <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                            Label
                        </label>
                        <input
                            type="text"
                            id="label"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter label"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="visitor" className="block text-sm font-medium text-gray-700">
                            Visitors
                        </label>
                        <input
                            type="number"
                            id="visitor"
                            value={newVisitor}
                            onChange={(e) => setNewVisitor(Number(e.target.value))}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter visitors count"
                        />
                    </div>
                    <button
                        onClick={handleAddData}
                        className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                        Add Data
                    </button>
                </div>
            )}

            {/* List of labels with trash icons */}
            {isDeleteFormOpen && (
                <div className="md:absolute max-w-40 static  bg-gray-50 shadow-lg rounded-md p-4 w-full z-10">
                    <div className="mt-4">
                        <ul>
                            {chartData.labels.map((label, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2"
                                >
                                    <span className="text-gray-700">{label}</span>
                                    <TrashIcon
                                        className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
                                        onClick={() => handleDeleteLabel(label)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <Pie data={dataPie}
            />
        </div>
    );
};