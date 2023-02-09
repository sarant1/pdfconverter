import { SyntheticEvent, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

export function FileUpload() {
  const [file, setFile] = useState(null);

  function handleUpload() {
    console.log(file);
  }
  function handleChange(e: any) {
    setFile(e.target.files[0]);
    console.log(e.target.files);
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
