import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }) => {
    return (
        <>
            <ProtectedRoute>
                <div>
                    <Sidebar />
                    {children}
                </div>

            </ProtectedRoute>
        </>
    );
};

export default layout;