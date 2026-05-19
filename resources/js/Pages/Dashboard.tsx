import DashboardLayout from "@/Layouts/DashboardLayout";

export default function Dashboard() {
    return (
        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-3 gap-4">

                <div className="bg-white rounded-lg shadow p-4">
                    Total Patients
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    Queue Today
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    Total Doctors
                </div>

            </div>

        </DashboardLayout>
    );
}