import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"

export const Layout = () => {
    return (
        <ScrollToTop>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </ScrollToTop>
    )
}
