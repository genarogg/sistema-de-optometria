import React from "react";
import {
  Center,
  Col1,
  Col2,
  Col6,
  Container,
  Div,
  Font,
  Img,
  ImgBg,
  Layout,
  P,

  Row,
  Strong
} from "@react-pdf-levelup/core";
import { QRstyle } from "@react-pdf-levelup/qr";


Font.register({
  family: "Anton",
  fonts: [
    {
      src: "https://genarogg.github.io/media/font/Anton-Regular.ttf",
      fontWeight: "normal",
    },

  ],
});


Font.register({
  family: "AlexBrush",
  fonts: [
    {
      src: "https://genarogg.github.io/media/font/AlexBrush-Regular.ttf",
      fontWeight: "normal",
    },

  ],
});

const Component = ({ data }: any) => {


  const dataFull = {
    imgAliada: data?.imgAliada || "https://genarogg.github.io/media/genarogg/avatar-placehorder.jpg",
    nombreYApellido: data?.nombreYApellido || "Genaro Gonzalez",
    cedula: data?.cedula || "25074591",
    lugarEvento: data?.lugarEvento || "CARACAS",
    fechaEvento: data?.fechaEvento || "23/12/28",
    urlQR: data?.urlQR || "https://covoficial.org/estatus",
    nombreDelEvento: data?.nombreDelEvento || "Diplomado en Optometría Pediátrica",
    tipoEvento: data?.tipoEvento || "CONGRESO",
    rol: data?.rol || "VISITANTE",
    presidente: {
      nombreYApellido: data?.presidente.nombreYApellido || "Genaro Gonzalez",
      firmaUrl: data?.presidente.firmaUrl || "https://genarogg.github.io/media/genarogg/avatar-placehorder.jpg",
    },
    vicepresidente: {
      nombreYApellido: data?.vicepresidente.nombreYApellido || "Genaro Gonzalez",
      firmaUrl: data?.vicepresidente.firmaUrl || "https://genarogg.github.io/media/genarogg/avatar-placehorder.jpg",
    },
    directorEvento: {
      nombreYApellido: data?.directorEvento.nombreYApellido || "Genaro Gonzalez",
      firmaUrl: data?.directorEvento.firmaUrl || "https://genarogg.github.io/media/genarogg/avatar-placehorder.jpg",
    },
  }

  const Membrete = () => {
    return (

      <Container style={{ paddingTop: 30, fontFamily: "Anton", }} >
        <Center >
          <Row >
            <Col2 style={{ left: 75 }}>
              <Center>
                <Img style={{ width: 110 }} src="https://genarogg.github.io/media/cov/logo-3d-cov.png" />
              </Center>
            </Col2>
            <Col1></Col1>
            <Col6 style={{ position: "relative" }}>
              <Div style={{ top: 25 }}>
                <Center>
                  <Img style={{ width: 350 }} src="https://genarogg.github.io/media/cov/text-certificado.svg" />
                  <P style={{ textTransform: "uppercase", fontSize: 16, color: "#0c83ad", marginTop: 2 }}>DE PARTICIPACION que se otorga a</P>
                </Center>
              </Div>
            </Col6>
            <Col1></Col1>
            <Col2 style={{ left: -75 }}>
              <Center>
                <Img style={{ width: 110 }} src="https://genarogg.github.io/media/cov/logo-3d-cov.png" />
              </Center>
            </Col2>
          </Row>
        </Center>
      </Container>

    )
  }

  const NombrePersona = () => {
    return (
      <Center style={{ marginTop: 40, fontFamily: "AlexBrush" }}>

        <P style={{ marginBottom: 0, top: 25, fontSize: 80, color: "#a07832" }}>{dataFull.nombreYApellido}</P>
        <Img src="https://genarogg.github.io/media/cov/linea-nombre.png" style={{ width: 600 }} />
        <P style={{ marginBottom: 0, color: "#a07832", fontSize: 16, fontFamily: "Courier" }}><Strong>CI: {dataFull.cedula}</Strong></P>
      </Center>

    )
  }
  const Informacion = () => {
    return (
      <Center style={{ fontFamily: "Courier" }}>

        <P style={{ color: "#021849", maxWidth: "60%", lineHeight: "16px", marginTop: 10, fontSize: 15 }}>
          <Strong style={{ textTransform: "uppercase" }}>
            POR HABER ASISTIDO {dataFull.nombreDelEvento}
          </Strong>
        </P>

        <P style={{ color: "#a07832", marginTop: 5, fontSize: 15 }}>
          <Strong>
            CARACAS, 14 DE SEPTIEMBRE 2024
          </Strong>
        </P>
      </Center>

    )
  }

  const Validacion = () => {
    return (
      <Container >
        <Row style={{ display: "flex", justifyContent: "space-evenly", marginTop: 10 }}>
          <Col2 >
            <Center style={{ width: 140, height: 140, fontFamily: "Courier" }}>
              <Img src={dataFull.presidente.firmaUrl} style={{ width: 90, height: 90 }} />
              <Img src="https://genarogg.github.io/media/cov/linea-de-firmas.png" />
              <Strong>
                <P style={{ textTransform: "capitalize", fontSize: 12, color: "#0c82b0" }}>
                  {dataFull.presidente.nombreYApellido}
                </P>

              </Strong>
              <Strong>
                <P style={{ color: "#a07832" }}>PRESIDENTE</P>
              </Strong>
            </Center>
          </Col2>
          <Col2 >
            <Center style={{ width: 140, height: 140, fontFamily: "Courier" }}>
              <Img src={dataFull.vicepresidente.firmaUrl} style={{ width: 90, height: 90 }} />
              <Img src="https://genarogg.github.io/media/cov/linea-de-firmas.png" />
              <Strong>
                <P style={{ textTransform: "capitalize", fontSize: 12, color: "#0c82b0" }}>
                  {dataFull.vicepresidente.nombreYApellido}
                </P>


              </Strong>
              <Strong>
                <P style={{ color: "#a07832" }}>VICEPRESIDENTE</P>
              </Strong>
            </Center>
          </Col2>
          <Col2 >
            <Center style={{ width: 140, height: 140, fontFamily: "Courier" }}>
              <Img src={dataFull.directorEvento.firmaUrl} style={{ width: 90, height: 90 }} />
              <Img src="https://genarogg.github.io/media/cov/linea-de-firmas.png" />
              <Strong>
                <P style={{ textTransform: "capitalize", fontSize: 12, color: "#0c82b0" }}>
                  {dataFull.directorEvento.nombreYApellido}
                </P>


              </Strong>
              <Strong>
                <P style={{ color: "#a07832" }}>DIR. EVENTOS</P>
              </Strong>
            </Center>
          </Col2>
          <Col2 >
            <Center style={{ width: 140, height: 140, }}>

              <QRstyle

                url="https://example.com"
                size={100}
                colorDark="#021849"
                colorLight="#ffffff"

                dotsOptions={{ color: "#021849", type: "rounded" }}
                backgroundOptions={{ color: "#ffffff" }}
                imageOptions={{ margin: 0, imageSize: 0.4 }}
                cornersSquareOptions={{ type: "extra-rounded", color: "#021849" }}
                cornersDotOptions={{ type: "dot", color: "#021849" }}
                margin={0}
                errorCorrectionLevel="H"
              />
            </Center>
          </Col2>
        </Row>
      </Container>
    )
  }

  return (
    <Layout
      size="A4"
      orientation="h"
      pagination={false}
      padding={0}
      style={{ margin: 0, padding: 0 }}>
      <ImgBg
        src="https://genarogg.github.io/media/cov/cov-certificado-bg.jpg"
        objectPosition="center"
        objectFit="cover"
        opacity={1}
      >
        <Membrete />
        <NombrePersona />
        <Informacion />
        <Validacion />
      </ImgBg>
    </Layout>
  );
};



