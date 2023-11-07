import Footer from "@/components/client/footer";
import NavbarClient from "@/components/client/navbar";

export default async function DashboardLayout({
    children,
}:{
    children: React.ReactNode;
    }) {
    
    return (
        <>
            <NavbarClient/>
            {children}
            <Footer/>
        </>
    )
}