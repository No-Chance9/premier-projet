import React, { useEffect, useState } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";


export default function BestSelling({ data, setformSubmitFromChildren, onDashboardChange }: any) {
    const [values, setValues] = useState<
        Array<{
            name: string;
            price: number;
            sold: number;
            stock: number;
            status?: string; // Optionnel, sera calculé dynamiquement
        }>
    >([]);

    const [isFormOpen, setIsFormOpen] = useState(false); // Contrôle de la visibilité du formulaire
    
    const [newProduct, setNewProduct] = useState<{
        name: string;
        price: number | "";
        sold: number | "";
        stock: number | "";
    }>({
        name: "",
        price: "",
        sold: "",
        stock: "",
    });

    const [error, setError] = useState<string | null>(null); // Gestion des erreurs

    // const [formSubmit, setFormSubmit] = useState('test');

    useEffect(() => {
        // Synchroniser les données locales avec les props 'data'
        if (data?.bestSelling) {
            setValues(data.bestSelling);
        }
    }, [data]);

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { status: "Out of Stock", class: "bg-red-200 text-red-800" };
        if (stock > 0 && stock <= 10) return { status: "Low Stock", class: "bg-yellow-200 text-yellow-800" };
        if (stock > 10 && stock <= 50) return { status: "In Stock", class: "bg-green-200 text-green-800" };
        return { status: "High Stock", class: "bg-blue-200 text-blue-800" };
    };

    const handleModif = async (index: number, field: string, value: number) => {
        try {
            const response = await fetch(`/api/dashboards/${data._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "bestSelling",
                    index,
                    [field]: value,
                }),
            });

            if (!response.ok) throw new Error(`Failed to update ${field}.`);

            const updatedDashboard = await response.json();

            // Mise à jour locale
            setValues(updatedDashboard.bestSelling);
            onDashboardChange?.();
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`Failed to update ${field}. Please try again.`);
        }
    };

    const handleDelete = async (index: number) => {
        const userConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer le produit ?");
        if (!userConfirmed) {
            return; // Si l'utilisateur clique sur "Annuler", on sort de la fonction
        }
        try {
            const response = await fetch(`/api/dashboards/${data._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "bestSelling",
                    index,
                }),
            });

            if (!response.ok) throw new Error("Failed to delete product.");

            const updatedDashboard = await response.json();

            // Mise à jour locale
            setValues(updatedDashboard.bestSelling);
            onDashboardChange?.();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product. Please try again.");
        }
    };

    // Ajout d'un nouveau produit
    const handleAddData = async () => {
        // if (!newProduct.name.trim() || !newProduct.price || !newProduct.sold || !newProduct.stock) {
        //     setError("All fields are required and must be valid.");
        //     return;
        // }
        setError(null); // Clear errors

        try {
            const response = await fetch(`/api/dashboards/${data._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "bestSelling",
                    data: {
                        name: newProduct.name,
                        price: Number(newProduct.price),
                        sold: Number(newProduct.sold),
                        stock: Number(newProduct.stock),
                    }

                }),
            });

            if (!response.ok) {
                // Extraire le message d'erreur de la réponse JSON
                const errorData = await response.json();
                setError(errorData.error || "Failed to add new product.");
                return; // Stop further execution
            }

            const updatedDashboard = await response.json();

            // Mise à jour locale instantanée
            setValues(updatedDashboard.bestSelling);
            onDashboardChange?.();

            // Réinitialisation du formulaire
            setNewProduct({ name: "", price: "", sold: "", stock: "" });

            console.log("Submitted name:", newProduct.name); // Vérifiez que c'est une chaîne
            console.log("Setting formSubmitFromChildren:", newProduct.name);

            //donnees envoye au contexte pour notification
            if (setformSubmitFromChildren) {
                setformSubmitFromChildren(newProduct.name);
            }

            // Fermeture du formulaire
            // setIsFormOpen(false); 

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        }
    };

    // Fonction pour récupérer les valeurs depuis le backend
    // const fetchValues = async () => {
    //     try {
    //         const response = await fetch(`/api/dashboards/${data._id}`);
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch values.");
    //         }

    //         const fetchedData = await response.json();
    //         setValues(fetchedData.bestSelling || []);
    //     } catch (err) {
    //         console.error("Error fetching values:", err);
    //     }
    // };

    // useEffect(() => {
    //     fetchValues();
    // }, [data]);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto  p-5 w-full ">
            <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">Best Selling Products</h3>
                <div
                    className="flex items-center mb-4 w-fit cursor-pointer"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                >
                    <PlusCircleIcon className="h-5 w-5 text-gray-400 mr-2 hover:text-blue-400" />
                    <span className="hover:underline">Add New Product</span>
                </div>
            </div>

            {isFormOpen && (
                <div className="bg-gray-100  md:max-w-max p-4 rounded shadow">
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <input
                        type="text"
                        placeholder="Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Sold"
                        value={newProduct.sold}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, sold: Number(e.target.value) }))}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <button
                        onClick={handleAddData}
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Add Product
                    </button>
                </div>
            )}

            <table className="min-w-full  mt-4">
                <thead>
                    <tr>
                        <th className="text-left p-2">Product Name</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Stock</th>
                        <th className="text-left p-2">Sold</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {values.map((product: any, index: any) => (
                        <tr key={index} className="border-t">
                            <td className="p-2">{product.name}</td>
                            <td className="p-2">{product.price}$</td>
                            <td className="p-2">
                                <button
                                    className="bg-gray-200 p-1 rounded"
                                    onClick={() => handleModif(index, 'stock', Math.max(0, product.stock - 1))}
                                >
                                    -
                                </button>
                                {product.stock}
                                <button
                                    className="bg-gray-200 p-1 rounded"
                                    onClick={() => handleModif(index, 'stock', product.stock + 1)}
                                >
                                    +
                                </button>
                            </td>
                            <td className="p-2">
                                <button
                                    className="bg-gray-200 p-1 rounded"
                                    onClick={() => handleModif(index, 'sold', Math.max(0, product.sold - 1))}
                                >
                                    -
                                </button>
                                {product.sold} pcs
                                <button
                                    className="bg-gray-200 p-1 rounded"
                                    onClick={() => handleModif(index, 'sold', product.sold + 1)}
                                >
                                    +
                                </button>
                            </td>
                            <td className={`p-2 ${getStockStatus(product.stock).class}`}>{getStockStatus(product.stock).status}</td>
                            <td className="p-2">
                                <TrashIcon
                                    className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
                                    onClick={() => handleDelete(index)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
