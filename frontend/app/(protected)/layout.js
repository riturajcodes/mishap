import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }) => {
    return (
        <>
            <ProtectedRoute>
                <div className="layout">
                    <Sidebar />
                    <div className="layout_main">
                        {children}
                    </div>
                </div>
            </ProtectedRoute>
        </>
    );
};

export default layout;