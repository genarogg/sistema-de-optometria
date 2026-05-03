import React from "react";
import "./css/footer.scss"
interface FooterProps {
    children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = () => {

    return (
        <footer className="footer-container">
            <div className="desktop-footer text-primary">
                <p className="text-primary"><strong className="text-primary">© {new Date().getFullYear()} Sociedad Venezolana de Optometría. Todos los derechos reservados.</strong></p>
            </div>
        </footer>
    );
};

export default Footer;
