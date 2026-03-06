exports.login = (req, res) => {
    console.log("Login API called");

    res.status(200).json({ 
        message: "Login successful",
        user: {
            id: 1,
            username: "testuser",
            email: "testuser@example.com",
        }
    });
};