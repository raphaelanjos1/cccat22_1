import request from "supertest";
import app from "../src/app";

test("Deve criar uma conta", async () => {
  // Given
  const input = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123"
  };

  // When
  const responseSignup = await request(app)
    .post("/signup")
    .send(input);

  const outputSignup = responseSignup.body;

  // Then
  expect(outputSignup.accountId).toBeDefined();

  const responseGetAccount = await request(app)
    .get(`/accounts/${outputSignup.accountId}`);

  const outputGetAccount = responseGetAccount.body;

  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);
});
