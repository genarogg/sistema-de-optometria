import React from "react";
import {
    BR,
    Center,
    Col6,
    Container,
    Div,
    Img,
    ImgBg,
    Layout,
    P,
    Row,
    Strong,
    View,
    Font
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

const ConstanciaSolvencia = ({ data }: any) => {
    const width1 = 340;
    const height1 = 272
    const internalWidth1 = (width1 / 2) - 2
    const internalHeight1 = height1 - 4

    const colorFull = "#006BC5"
    const urlAsset = "https://genarogg.github.io/media/cov"


    const dataFull = {
        imgAvatar: data?.imgAvatar || "https://genarogg.github.io/media/genarogg/avatar-placehorder.jpg",
        nombreCompleto: data?.nombreCompleto || "Genaro Octavio",
        apellidosCompletos: data?.apellidosCompletos || "Gonzalez Gonzalez",
        nivelAcademico: data?.nivelAcademico || "Ing Informatico",
        cargo: data?.cargo || "Presidente",
        numeroGremio: data?.numeroGremio || "00000",
        cedula: data?.cedula || "25074591",
        fechaVencimiento: data?.fechaVencimiento || "23/12/28",
        urlQR: data?.urlQR || "https://www.photoroom.com/",
        autoridad: {
            nombreCompletos: data?.autoridad.nombreCompletos || "Genaro Octavio",
            apellidosCompletos: data?.autoridad.apellidosCompletos || "Gonzalez Gonzalez",
            firma: data?.autoridad.firma || "https://genarogg.github.io/media/genarogg/sello.png"
        }
    }


    const Frontend = () => {
        return (
            <>
                <Img src={urlAsset + "/logo-cov.svg"} style={{ width: "150px" }} />
                <Div
                    style={{

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "1px",
                        border: "2px solid #fff",
                        position: "absolute",
                        top: "62px",
                        borderRadius: "500px",
                    }}
                >
                    <Div
                        style={{
                            border: "7px solid #006BC5",
                            backgroundColor: "#006BC5",
                            borderRadius: "500px",
                            width: "75px",
                            height: "75px",
                        }}
                    >
                        <Img
                            style={{
                                borderRadius: "500px",
                                width: "64px",
                                position: "absolute",
                                left: "-1px",
                                top: "-2px"
                            }}
                            src={dataFull.imgAvatar}
                        />
                    </Div>
                </Div>
                <BR style={{ marginTop: 80 }} />

                <Div style={{
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: "center",
                    textTransform: "uppercase",
                    maxWidth: "130px",

                }}>
                    <Strong style={{ fontSize: "8px", color: "#006BC5" }} >
                        {dataFull.nombreCompleto}
                    </Strong>
                    <BR />

                    <Strong style={{ fontSize: "7px", lineHeight: "8px", maxWidth: "90px", color: "#006BC5", marginTop: "-10px" }}>
                        {dataFull.apellidosCompletos}
                    </Strong>



                </Div>

                <Img src="https://genarogg.github.io/media/cov/linea-de-separacion.png" style={{ width: "120px" }} />

                <Div style={{
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: "center",
                    textTransform: "uppercase",
                    maxWidth: "130px",
                    marginTop: 2

                }}>
                    <Strong style={{ fontSize: "7px", color: "#af7c28", lineHeight: "8px", maxWidth: "90px" }}>
                        {dataFull.cargo ? dataFull.cargo : dataFull.nivelAcademico}
                    </Strong>
                </Div>
                <Div
                    style={{
                        height: "75px",
                        fontWeight: "bold",
                        textAlign: "center",
                        top: "195px",
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        maxWidth: "120px",
                    }}
                >
                    <P style={{ fontSize: "7px", marginBottom: "2px", color: "#006BC5" }}>
                        CI: {dataFull.cedula}
                    </P>
                    <P style={{ fontSize: "7px", marginBottom: "2px", color: "#006BC5" }}>NUMERO COV: {dataFull.numeroGremio}</P>
                    <P style={{ fontSize: "7px", marginBottom: "2px", color: "#006BC5" }}>Vence: {dataFull.fechaVencimiento}</P>
                </Div>
            </>
        )
    }

    const Backend = () => {
        return (
            <>
                <Div
                    style={{
                        //border:"1px solid red",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "1px",
                    }}
                >
                    <Img src={urlAsset + "/logo-3d-cov.png"} style={{ width: "50px" }} />
                </Div>

                <P style={{
                    //border:"1px solid red",
                    fontSize: "6px",
                    textAlign: "center",
                    color: "#af7c28",
                    fontWeight: "bold",
                    lineHeight: "7px",

                    textTransform: "uppercase"

                }}>
                    credencial profesional
                </P>


                <P
                    style={{
                        //border:"1px solid red",
                        padding: 15,
                        paddingTop: "8px",
                        paddingBottom: 0,
                        textAlign: "justify",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        fontSize: "6px",
                        lineHeight: 1.5,
                        color: "#006BC5"

                    }}
                >
                    Esta credencial es intransferible y acredita al portador - titular como trabajador del área de la salud según la legislación vigente de la República Bolivariana de Venezuela. Agradecemos a las autoridades civiles y militares la mayor colaboración posible a su portador en todo el territorio nacional.
                </P>
                <Container style={{ paddingTop: "12px", paddingLeft: 15, paddingRight: 20, margin: 0 }}>
                    <Row >

                        <Col6>
                            <Center
                                style={{

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}
                            >
                                <Div style={{
                                    position: "relative", width: "60px", height: "60px",
                                }}>


                                    <Div style={{
                                        position: "absolute", bottom: "-16px", right: "-10px",
                                        overflow: "hidden",
                                        transform: "scale(.6)",
                                        borderRadius: "35px"
                                    }}>
                                        <QRstyle
                                            url={dataFull.urlQR}
                                            size={90}


                                            imageOptions={{
                                                imageSize: 0.4,
                                                margin: 2
                                            }}
                                            dotsOptions={{
                                                type: "classy-rounded",
                                                color: "#006BC5"
                                            }}
                                            cornersSquareOptions={{
                                                type: "extra-rounded",
                                                color: "#006BC5"
                                            }}

                                            backgroundOptions={{
                                                color: "#fff"
                                            }}
                                        />
                                    </Div>
                                </Div>
                            </Center>
                        </Col6>

                     <Col6>
                            <Center
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    left: "9px",
   backgroundColor:"#ffffff6c",
   borderRadius:5
                                }}
                            >
                                <Div style={{
                                    height: "40px",
                                    width: "40px",
                                }}>
                                    <Img

                                        src={dataFull.autoridad.firma}
                                        style={{

                                            marginBottom: "0px",
                                            objectFill: "cover"
                                        }}
                                    />
                                </Div>

                                <P style={{
                                    fontSize: "5px",
                                    top: "0",
                                    marginBottom: "0",
                                    color: "#000",
                                    fontWeight: "bold",
                                 
                                }}>
                                    {dataFull.autoridad.nombreCompletos}<BR />{dataFull.autoridad.apellidosCompletos}
                                </P>
                                <View style={{
                                    width: "95%",
                                    borderTop: '1px solid #000',
                                    marginTop: 2,
                                    marginBottom: 2,
                                    fontWeight: "bold"
                                }} />
                                <P style={{
                                    fontSize: "4px",
                                    marginBottom: "0px",
                                    color: "#000",
                                    fontWeight: "bold",
                                 
                                }}>
                                    Presidente (a) del COV
                                </P>

                            </Center>
                        </Col6>
                    </Row>
                </Container>
            </>
        )
    }

    return (
        <Layout size="A4" orientation="v" style={{ fontFamily: "Courier Prime" }}>

            <View style={{
                position: "relative",
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                width: width1,
                height: height1,
            }}>

                <ImgBg
                    src={urlAsset + "/bg-carnet-cvo6.png"}
                    opacity={1}>
                    <Container style={{ width: "100%" }}>
                        <Row style={{ width: "100%" }}>
                            <Col6 style={{
                                height: internalHeight1,
                                width: internalWidth1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <Frontend />
                            </Col6>
                            <Col6 style={{ height: internalHeight1, width: internalWidth1, left: "4px" }}>
                                <Backend />
                            </Col6>
                        </Row>
                    </Container>
                </ImgBg>
            </View>
        </Layout>
    )
};

export default ConstanciaSolvencia;