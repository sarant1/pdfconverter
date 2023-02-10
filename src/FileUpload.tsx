import { SyntheticEvent, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";

export function FileUpload() {
  const [file, setFile] = useState(null);
  let fd: any = new FormData();

  function handleUpload() {
    const response: any = axios
      .get(
        "https://hf1crtnxu8.execute-api.us-east-1.amazonaws.com/v1/getsignedurl"
      )
      .then((res) => {
        for (var key in res["data"]["fields"]) {
          fd.append(key, res["data"]["fields"][key]);
        }

        fd.append("file", file);
        axios.post(res["data"]["url"], fd, {
          headers: {
            "content-type": "multipart/xml",
          },
        });
      })
      .catch((err) => console.log(err));
  }
  function handleChange(e: any) {
    setFile(e.target.files[0]);

    fd.append("pdf-file", file);
  }

  return (
    <Container className="bg-light">
      <Form.Group controlId="formfile" className="mb-3">
        <Form.Label></Form.Label>
        <Form.Control onChange={handleChange} type="file" />
      </Form.Group>
      <Button onClick={handleUpload}>Upload</Button>
    </Container>
  );
}
