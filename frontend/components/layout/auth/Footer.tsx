import React from "react";
import "./css/footer.scss"
interface FooterProps {
    children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = () => {

    return (
        <footer className="footer-container">
            <div className="desktop-footer">
                <p><strong>© {new Date().getFullYear()} Sociedad Venezolana de Optometría. Todos los derechos reservados.</strong></p>
            </div>
        </footer>
    );
};

export default Footer;
