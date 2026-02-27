import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // For user session management
import Totaux from "./totaux";
import { CustomerGrowthChart } from "./customerGrowth";
import { YearlyVisitorsChart } from "./yearlyVisitors";
import BestSelling from "./bestSelling";
import ButtonDl from "./buttonDownload";
import saveAs from "file-saver";

export const Dashboard = ({ setformSubmitFromChildren }: any) => {
    const { data: session } = useSession(); // Get the logged-in user's session
    const [dashboardData, setDashboardData] = useState(null);

    const [dataGlobal, setDataGlobal] = useState<{
        customerGrowthData: any[];
        yearlyVisitors: any[];
        bestSelling: any[];
        totaux: any[];
    }>({
        customerGrowthData: [],
        yearlyVisitors: [],
        bestSelling: [],
        totaux: [],
    });

    const handleDownloadCSV = () => {
        // Helper function to generate CSV content
        const generateCSVContent = (keys: string[], data: any[]) => {
            const csvRows = [
                keys.join(","), // Header
                ...data.map((row) =>
                    keys.map((key) => (row[key] !== undefined ? row[key] : "")).join(",")
                ),
            ];
            return csvRows.join("\n");
        };

        // Prepare data for each section
        const customerGrowthKeys = dataGlobal.customerGrowthData[0]
            ? Object.keys(dataGlobal.customerGrowthData[0]).filter((key) => !["_id", "__v"].includes(key))
            : [];
        const yearlyVisitorsKeys = dataGlobal.yearlyVisitors[0]
            ? Object.keys(dataGlobal.yearlyVisitors[0]).filter((key) => !["_id", "__v"].includes(key))
            : [];
        const bestSellingKeys = dataGlobal.bestSelling[0]
            ? Object.keys(dataGlobal.bestSelling[0]).filter((key) => !["_id", "__v"].includes(key))
            : [];

        const customerGrowthCSV = customerGrowthKeys.length
            ? generateCSVContent(customerGrowthKeys, dataGlobal.customerGrowthData)
            : "";
        const yearlyVisitorsCSV = yearlyVisitorsKeys.length
            ? generateCSVContent(yearlyVisitorsKeys, dataGlobal.yearlyVisitors)
            : "";
        const bestSellingCSV = bestSellingKeys.length
            ? generateCSVContent(bestSellingKeys, dataGlobal.bestSelling)
            : "";

        // Combine all CSVs
        const combinedCSV = [
            customerGrowthCSV,
            yearlyVisitorsCSV,
            bestSellingCSV,
        ]
            .filter((csv) => csv) // Remove empty sections
            .join("\n\n"); // Add space between sections

        // Download as a single CSV file
        const blob = new Blob([combinedCSV], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "dashboard_data.csv");
    };

    const fetchDashboard = async () => {
        if (!session?.user?.id) {
            console.log("Session or user ID not available");
            return;
        }

        try {
            const resUser = await fetch("/api/users");
            const dataUser = await resUser.json();

            const UserDashboard = dataUser.find((item: any) => item._id === session.user.id);

            if (UserDashboard) {
                const res = await fetch(`/api/dashboards/${UserDashboard.dashboard}`);
                const data = await res.json();

                console.log("Dashboard fetched successfully:", data);
                setDashboardData(data);
                setDataGlobal(data);
            } else {
                console.log("No dashboard associated with the user");
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [session]);

    if (!dashboardData) return <p>Loading dashboard...</p>;

    return (
        <main className="p-4  max-w-screen-xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-bold">Overview</h1>
                <div className="flex gap-4 mt-4 sm:mt-0">
                    <ButtonDl onClick={handleDownloadCSV} />
                </div>
            </header>

            <section className="grid grid-cols-1 gap-6 mb-6">
                <div className="bg-gray-100 dark:bg-neutral-800 p-6 md:items-center rounded-lg shadow">
                    <Totaux data={dashboardData} />
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6">
                <div className="bg-gray-100 dark:bg-neutral-800 p-6 rounded-lg shadow">
                    <CustomerGrowthChart data={dashboardData} />
                </div>
                <div className="bg-gray-100 dark:bg-neutral-800 p-6 rounded-lg shadow">
                    <YearlyVisitorsChart dashboardData={dashboardData} onDashboardChange={fetchDashboard} />
                </div>
                <div className="lg:col-span-3 bg-gray-100 dark:bg-neutral-800 p-6 rounded-lg shadow">
                    <BestSelling
                        data={dashboardData}
                        setformSubmitFromChildren={setformSubmitFromChildren}
                        onDashboardChange={fetchDashboard}
                    />
                </div>
            </section>
        </main>
    );
};
