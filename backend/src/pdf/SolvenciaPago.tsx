import React from "react";
import {
    A,
    BR,
    Center,
    Col2,
    Col5,
    Container,
    H5,
    Img,
    Layout,
    P,
    Font,
    Row,
    Strong,
    View
} from "@react-pdf-levelup/core";
import path from "path";
import { QRstyle } from "@react-pdf-levelup/qr";


const getFontPath = (fontName: string) =>
    path.join(process.cwd(), "src", "pdf", "fonts", fontName);


Font.register({
    family: "Courier Prime",
    fonts: [
        {
            src: getFontPath("CourierPrime-Regular.ttf"),
            fontWeight: "normal",
        },
        {
            src: getFontPath("CourierPrime-Bold.ttf"),
            fontWeight: "bold",
        },
    ],
});


const Component = ({ data }: any) => {
    const colorFull = "#3366cc"

    const dataFull = {
        nombreCompleto: data?.nombreCompleto || "Genaro Octavio",
        apellidosCompletos: data?.apellidosCompletos || "Gonzalez Gonzalez",
        cedula: data?.cedula || "25074591",
        fechaVencimiento: data?.fechaVencimiento || "23/12/28",
        urlQR: data?.urlQR || "https://www.photoroom.com/",
        numeroGremio: data?.numeroGremio || "00000",
    }

    const Header = () => {
        return (
            <Center>
                <Img
                    src="https://genarogg.github.io/media/covzla/logo-covzla.png"
                    style={{ width: "100px", position: "absolute", left: "0px" }}
                />
                <Center style={{ fontSize: "11px", color: colorFull }}>
                    <P style={{ marginBottom: "3", fontSize: "11px" }}>
                        <Strong>REPÚBLICA BOLIVARIANA DE VENEZUELA</Strong>
                    </P>
                    <P style={{ marginBottom: "3", fontSize: "11px" }}>
                        <Strong>COLEGIO DE OPTOMETRISTAS DE VENEZUELA</Strong>
                    </P>
                    <P style={{ fontSize: "11px" }}>
                        <Strong>JUNTA DIRECTIVA</Strong>
                    </P>
                </Center>
                <Img
                    src="https://genarogg.github.io/media/covzla/escudo-optometria.png"
                    style={{ width: "80px", position: "absolute", right: "0px" }}
                />
                <BR />
                <BR />
            </Center>
        );
    }

    const Footer = () => {
        return (
            <Center style={{
                position: "absolute",
                top: "720px",
                left: 0,
                maxHeight: "150px",
                width: "100%",
                opacity: "0.8"
            }}>
                <P style={{ fontSize: "9px" }}>
                    El Marqués, Quinta Isabelita, Calle Araure, Caracas 1071, Miranda, Venezuela
                </P>
                <P style={{ fontSize: "9px" }}>
                    Teléfonos: +58 (0414) 902 2296
                </P>
                <P style={{ fontSize: "9px" }}>
                    <A href="mailto:juntadirectivacov@gmail.com">juntadirectivacov@gmail.com</A>
                </P>
            </Center>
        );
    }

    const Main = () => {
        return (
            <>
                <P style={{ textAlign: "justify" }}>Por medio de la presente, se hace constar que el/la ciudadano(a) <Strong style={{ textTransform: "uppercase" }}>{dataFull.nombreCompleto} {dataFull.apellidosCompletos}</Strong>, titular de la Cédula de Identidad N° <Strong style={{ textTransform: "uppercase" }}>{dataFull.cedula}</Strong>, y debidamente inscrito(a) en este gremio bajo el
                    número de colegiado <Strong style={{ textTransform: "uppercase" }}>{dataFull.numeroGremio}</Strong>, se encuentra al día con todas sus obligaciones administrativas y compromisos
                    económicos correspondientes a este Colegio hasta la presente fecha.
                    <BR />
                    <BR />
                    Se extiende la presente constancia a petición de la parte interesada, para los fines legales o administrativos
                    que el solicitante considere pertinentes, en la ciudad de Ciudad
                </P>

            </>
        )
    }


    const Validacion = ({ data }: any) => {
        return (
            <Container style={{
                position: "absolute",
                top: "500px",
                left: 0,
                maxHeight: "150px",
                // border: "1px solid red",
                padding: 0,
                paddingLeft: 62,
                paddingRight: 62,
                margin: 0
            }}>
                <Row>
                    {/* @ts-ignore */}
                    <Col5><Center style={{ height: '200px' }}></Center> </Col5> <Col2 />
                    <Col5>
                        <Center style={{ height: '200px' }}>
                            <Center style={{ fontSize: "9px" }}>

                                <Center style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>


                                    <QRstyle
                                        backgroundOptions={{
                                            color: "transparent"
                                        }}
                                        url={dataFull.urlQR}
                                        size={100}

                                        imageOptions={{
                                            imageSize: 0.4,
                                            margin: 2
                                        }}
                                        dotsOptions={{
                                            type: "classy",
                                            color: "#3366cc"
                                        }}
                                        cornersSquareOptions={{
                                            type: "extra-rounded",
                                            color: "#3366cc"
                                        }}
                                    />
                                </Center>

                                <View style={{ width: "180px", borderTop: '1px solid #3366cc', marginBottom: "5px" }} />

                                <P style={{ fontSize: "9px" }}><Strong>Escanee para comprobar la validez</Strong></P>
                                <P style={{ fontSize: "9px" }}>Documento válido por 30 días</P>
                                <P style={{ fontSize: "8px" }}>Fecha emisión: {dataFull.fechaVencimiento}</P>
                            </Center>
                        </Center>
                    </Col5>
                </Row>
            </Container>
        );
    }

    return (
        <Layout style={{

            paddingBottom: 0,
            fontFamily: "Courier Prime"
        }}
            padding={62}
            backgroundColor="#F0F7F7"
        >
            <Img
                src="https://genarogg.github.io/media/cov/logo-3d-cov.png"
                style={{
                    opacity: "0.08",
                    position: "absolute",
                    left: "0"
                }} />

            <Header />
            <H5 style={{ color: "#444", textAlign: "center", marginBottom: 30 }}>
                SOLVENCIA DE PAGO
            </H5>
            <Main />
            <Validacion />
            <Footer />
        </Layout>
    );
};

export default Component;
