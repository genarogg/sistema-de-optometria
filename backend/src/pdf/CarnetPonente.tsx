
import {
    Center,
    Div,
    H5,
    Img,
    ImgBg,
    Layout,
    Strong,
    View,
    BR,
    Span
} from "@react-pdf-levelup/core";

const CarnetPonente = ({ data }: any) => {
    const width1 = 240;
    const height1 = 240

    const colorFull = "#019a9d"
    const urlAsset = "https://genarogg.github.io/media/cov"


    const dataFull = {
        imgAvatar: data?.imgAvatar || "https://genarogg.github.io/media/genarogg/avatar-placehorder.jpg",
        nombreCompleto: data?.nombreCompleto || "Genaro Octavio",
        apellidosCompletos: data?.apellidosCompletos || "Gonzalez Gonzalez",
        cedula: data?.cedula || "25074591",
        fechaVencimiento: data?.fechaVencimiento || "23/12/28",
        urlQR: data?.urlQR || "https://www.photoroom.com/",
        nombreDelEvento: data?.nombreDelEvento || "Diplomado en Optometría Pediátrica",

    }


    const Frontend = () => {
        return (
            <>
                <Center>
                    <Img src={urlAsset + "/logo-cov.svg"} style={{ width: "120px" }} />
                    <Img
                        style={{
                            width: "140px",
                            position: "absolute",
                            top: "110px"
                        }}
                        src={urlAsset + "/linea-divisuria2.png"}
                    />
                    <Div
                        style={{

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "1px",
                            border: "2px solid #019a9d",
                            position: "absolute",
                            top: "48px",
                            borderRadius: "500px",
                        }}
                    >

                        <Div
                            style={{
                                border: "5px solid #fff",
                                backgroundColor: "#fff",
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
                                    top: "0px",
                                    left: "1px",
                                }}
                                src={dataFull.imgAvatar}
                            />
                        </Div>
                    </Div>
                    <Div style={{ marginTop: 68 }}></Div>

                    <Strong style={{ textTransform: "uppercase", color: "#ba9c5c", }}>Ponente</Strong>
                     <H5 style={{textTransform: "uppercase", color:"#016167", fontSize:"12px"}}>
                 <Span>{dataFull.nombreCompleto}</Span>
                 <BR />
                 
                        <Span> {dataFull.apellidosCompletos}</Span>
                </H5>
                    <Img
                        style={{
                            width: "90px",
                            marginTop: -4
                        }}
                        src={urlAsset + "/linea-divisuria1.png"}
                    />
                    <Div style={{ maxWidth: 150 }}>
                        <Center style={{ marginTop: -10 }}>
                            <Strong style={{ color: "#016167", fontSize: "8px" }}>Ponente de el {dataFull.nombreDelEvento}</Strong>
                            <Strong style={{ marginTop: 4, color: "#016167", fontSize: "8px" }}>{dataFull.fechaVencimiento}</Strong>
                        </Center>
                    </Div>
                </Center>
                <Img
                    src={urlAsset + "/logo-3d-cov.png"}
                    style={{
                        width: "25px",
                        position: "absolute",
                        top: 210,
                        left: 20
                    }} />
            </>
        )
    }



    return (
        <Layout style={{ fontFamily: "Courier" }}>
            <View style={{
                position: "relative",
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                width: width1,
                height: height1,
            }}>

                <ImgBg
                    src={urlAsset + "/babero-bg.jpg"}
                    opacity={1}>
                    <Frontend />
                </ImgBg>
            </View>
        </Layout>
    )
};
CarnetPonente;

export default CarnetPonente;
