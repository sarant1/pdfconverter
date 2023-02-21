import { SyntheticEvent, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";

export function FileUpload() {
  // This will be used for the state of uploaded file
  const [file, setFile] = useState(null);
  // Sinced we are using presigned post, we are using formdata to upload
  let fd: any = new FormData();
  // UUID for our file
  let pdfid = "";

  function handleUpload() {
    // This function is a proxy to the lambda function that will return presigned post
    const response: any = axios
      .get(
        "https://hf1crtnxu8.execute-api.us-east-1.amazonaws.com/v1/getsignedurl"
      )
      // This will add all the fields generated to our formdata
      .then((res) => {
        for (var key in res["data"]["fields"]) {
          fd.append(key, res["data"]["fields"][key]);
        }
        // saving pdfid locally
        pdfid = res["data"]["fields"]["key"];
        // adding our file to the formdata
        fd.append("file", file);
        axios.post(res["data"]["url"], fd, {
          headers: {
            "content-type": "multipart/xml",
          },
        });
        console.log(pdfid);
      })
      .catch((err) => console.log(err));
  }

  // On file change, this will set our file to the updated file
  function handleChange(e: any) {
    setFile(e.target.files[0]);
  }

  return (
    <Container className="bg-light" style={{ marginTop: "30vh" }}>
      <Form.Group controlId="formfile" className="mb-3">
        <Form.Label></Form.Label>
        <Form.Control onChange={handleChange} type="file" />
      </Form.Group>
      <Button onClick={handleUpload}>Upload</Button>
    </Container>
  );
}
