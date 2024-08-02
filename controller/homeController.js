// controllers/homeController.js

async function loginController(req, res) {
  try {
    // Access the session variable
    const username = req.session.username || "Guest";

    // Render the 'home' view and pass the session data
    const viewsData = {
      pageTitle: "Central Visayas Waste Management Complex Corporation",
      username,
    };
    res.render("login", viewsData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function homeController(req, res) {
  try {
    // Access the session variable
    const username = req.session.username || "Guest";

    // Render the 'home' view and pass the session data
    const viewsData = {
      pageTitle: "Central Visayas Waste Management Complex Corporation",
      username,
    };
    res.render("home", viewsData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function logoutController(req, res) {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Redirect to the login page after successful logout
        res.redirect("/");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function error404Controller(req, res, next) {
  res.status(404).send("404 Not Found");
}

module.exports = {
  loginController,
  homeController,
  logoutController,
  error404Controller,
};
