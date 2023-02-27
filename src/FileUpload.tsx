import { SyntheticEvent, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import axios from "axios";

export function FileUpload() {
  // This will be used for the state of uploaded file
  const [file, setFile] = useState(null);
  // state for loading animation
  const [isWorking, setIsWorking] = useState(false);
  // file input ref so it can be reset upon upload
  const inputRef = useRef<any>(null);
  // Sinced we are using presigned post, we are using formdata to upload
  var fd: any = new FormData();
  // UUID for our file
  var pdfid = "";

  function resetState() {
    setIsWorking(false);
    setFile(null);
    inputRef.current!.value = null;
  }

  function generatePresignedURLtoGetObject(pdfid: string) {
    axios
      .get("https://hf1crtnxu8.execute-api.us-east-1.amazonaws.com/v1/getpdf", {
        params: {
          pdfid: pdfid,
        },
      })
      .then((res) => {
        let objectUrl = res["data"]["signedurl"];
        resetState();
        window.open(objectUrl);
        console.log(objectUrl);
      })
      .catch((res) => {
        console.log(res);
      });
  }

  function getWatermarkedPDF(pdfid: string) {
    // get request to trigger lambda function to pull the uploaded pdf from s3 and add samuelarant.com watermark to it
    axios
      .get(
        "https://fo5f7jhe5ehtwmleomduvagh7i0llowa.lambda-url.us-east-1.on.aws/",
        {
          params: {
            pdfid: pdfid,
          },
        }
      )
      .then((res) => {
        console.log(res);
        generatePresignedURLtoGetObject(pdfid);
      })
      .catch((res) => {
        resetState();
      });
  }

  function handleUpload(e: any) {
    // toggle spinner
    setIsWorking(true);
    // This function is a proxy to the lambda function that will return presigned post
    const response: any = axios
      .get(
        "https://hf1crtnxu8.execute-api.us-east-1.amazonaws.com/v1/getsignedurl"
      )
      // This will add all the fields generated to our formdata
      .then((res) => {
        for (let key in res["data"]["Body"]["fields"]) {
          fd.append(key, res["data"]["Body"]["fields"][key]);
        }

        // saving pdfid locally
        pdfid = res["data"]["Body"]["fields"]["key"];

        // adding our file to the formdata
        fd.append("file", file);
        axios
          .post(res["data"]["Body"]["url"], fd, {
            headers: {
              "content-type": "multipart/xml",
            },
          })
          .then((res) => {
            console.log(res);
            getWatermarkedPDF(pdfid);
          });
      })
      .catch((err) => {
        console.log(err);
        resetState();
      });
  }

  // On file change, this will set our file to the updated file
  function handleChange(e: any) {
    setFile(e.target.files[0]);
  }

  return (
    <Container
      className="bg-dark rounded"
      style={{ marginTop: "30vh", width: "460px", height: "130px" }}
    >
      <Form.Group controlId="formfile" className="mb-2 m">
        <Form.Label></Form.Label>
        <Form.Control
          ref={inputRef}
          className={isWorking ? "d-none" : ""}
          onChange={handleChange}
          type="file"
          accept="application/pdf"
        />
      </Form.Group>
      <div className="d-flex flex-row pb-3 justify-content-center">
        <div className="d-inline">
          <Button onClick={handleUpload} className={isWorking ? "d-none" : ""}>
            Upload
          </Button>
        </div>
        <div className="flex justify-content-center">
          <Spinner
            className={isWorking ? "" : "d-none"}
            style={{ width: "4rem", height: "4rem" }}
            variant="primary"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    </Container>
  );
}
