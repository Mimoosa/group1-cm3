# Self-Assessment for NoAuthBackend

## Test Code:
Example 1: Made test code run in mongomemory to not make a seperate test database since one isn't needed
```
let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Close any existing connection and connect to the in-memory DB
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});
```

Example 2: Testing with mock data
Made new mock data with the new required parameters and used username instead of email for account creation
```
const mockUserData = {
        name: "John Doe",
        username: "john_doe",
        password: "password123",
        phone_number: "1234567890",
        gender: "male",
        date_of_birth: "1990-01-01",
        membership_status: "active",
        bio: "A short bio",
        address: "123 Street, City",
        profile_picture: "url_to_picture",
      };
```
Also simulated login with username and password
```
 describe("POST /api/users/login", () => {
    it("should successfully log in a user", async () => {
      const mockUserData = {
        username: "john_doe",
        password: "password123",
      };
```
## Self-Grading:
- Functionality: 10/10 - The tests and backend work well and use the new schema correctly.
- Code Quality: 8/10 - The code is clean and readable with sensible parameter names.

## Key Improvements:
Changed products controller into jobs controller.
Seperated auth and non auth backends

# Self-Assesment for AuthBackend
