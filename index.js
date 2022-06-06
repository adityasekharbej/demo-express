const express = require("express");
const nanoid = require("nanoid");

const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use("/votes/*", (req, res, next) => {
//   if (!req.query.apiKey) {
//     return res.status(401).send("No API key exist");
//   }
// });
app.get("/", (req, res) => {
  res.send("Welcome!")
})
app.post("/user/create", (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = [...parsed.users, req.body];

    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      res.status(201).send("user created");
    });
  });
});

app.post("/user/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .send(`{ status: "please provide username and password" }`);
  }

  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = parsed.users.map((el) =>
      req.body.username == el.username && req.body.password == el.password
        ? { ...el, token: Math.random() }
        : el
    );

    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      res.status(201).send("login successful");
    });
  });
});

app.post("/user/logout", (req, res) => {
  res.send("user logged out successfully");
});

app.get("/votes/party/:party", (req, res) => {
  const { party } = req.params;
  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = parsed.users.filter((el) => el.party === party);
    res.send(JSON.stringify(parsed.users));
  });
});

app.get("/votes/voters", (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = parsed.users.filter((el) => el.role === "voter");
    res.send(JSON.stringify(parsed.users));
  });
});

app.post("/votes/vote/:user", (req, res) => {
  const { user } = req.params;
  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = parsed.users.map((t) =>
      t.name == user ? { ...t, votes: 1 } : t
    );

    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      res.send("user voted");
    });
  });
});

// app.get("/votes/count/:user", (req, res) => {
//   const { user } = req.params;
//   fs.readFile("./db.json", "utf-8", (err, data) => {
//     const parsed = JSON.parse(data);
//     parsed.users = parsed.users.map((el) =>
//       el.name == user ? res.send(el.votes) : el
//     );
//   });
// });


app.post("/db", (req, res) => {
    fs.readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        parsed.users = [...parsed.users, req.body];
    
        fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
          res.send("user added");
        });
      });
})


app.get("/db", (req, res) => {
    fs.readFile("./db.json", "utf-8", (err, data)=>{
      res.send(data)
    })
})





const PORT = process.env.PORT || 8080
app.listen(PORT);
