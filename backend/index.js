const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
require("dotenv").config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "db.json");

async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return { users: [], serviceOrders: [] };
  }
}

async function writeDB(db) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to DB:", err);
  }
}

// SUB LIST - Search by LTE_SUB or LTE_IMSI
app.post("/api/users/list", async (req, res) => {
  try {
    const { LTE_SUB, LTE_IMSI } = req.body;
    const db = await readDB();

    let user = null;
    if (LTE_SUB && LTE_SUB !== "") {
      user = db.users.find((u) => u.LTE_SUB === LTE_SUB);
      if (user) {
        return res.json({ result: "success", message: user.LTE_IMSI });
      }
    } else if (LTE_IMSI && LTE_IMSI !== "") {
      user = db.users.find((u) => u.LTE_IMSI === LTE_IMSI);
      if (user) {
        return res.json({ result: "success", message: user.LTE_SUB });
      }
    }

    return res.json({ result: "failed", message: "User not found" });
  } catch (e) {
    res.status(500).json({ result: "failed", message: "Server error" });
  }
});

// GET User details with serviceOrders and workOrders
app.post("/api/users/details", async (req, res) => {
  try {
    const { LTE_SUB, LTE_IMSI } = req.body;
    const db = await readDB();

    let user = null;
    if (LTE_SUB && LTE_SUB !== "") {
      user = db.users.find((u) => u.LTE_SUB === LTE_SUB);
    } else if (LTE_IMSI && LTE_IMSI !== "") {
      user = db.users.find((u) => u.LTE_IMSI === LTE_IMSI);
    }

    if (user) {
      const serviceOrders = db.serviceOrders.filter(
        (so) => so.LTE_SUB === user.LTE_SUB,
      );
      return res.json({
        status: "success",
        serviceOrders: serviceOrders,
        workOrders: {
          LTE_IMSI: user.LTE_IMSI,
          LTE_ISDN: user.LTE_ISDN,
          LTE_PROFILE: user.LTE_PROFILE,
          LTE_PKG: user.LTE_PKG,
        },
      });
    }

    return res.json({ status: "failed", message: "User not found" });
  } catch (e) {
    res.status(500).json({ status: "failed", message: "Server error" });
  }
});

// SUB CREATE - ADD_SERVICE_ALL or ADD_SOD_ALL
app.post("/api/users/create", async (req, res) => {
  try {
    const {
      operation,
      LTE_IMSI,
      LTE_SUB,
      LTE_PROFILE,
      LTE_PKG,
      SO_ID_VOICE,
      SO_ID_BB,
      SO_ID_AB,
      SID_VOICE,
      SID_BB,
      SID_AB,
    } = req.body;

    const db = await readDB();

    // Check if user already exists
    const existingUser = db.users.find(
      (u) => u.LTE_SUB === LTE_SUB || u.LTE_IMSI === LTE_IMSI,
    );
    if (existingUser) {
      return res.json({ result: "failed", message: "CREATE_LTE_UDR_HSS" });
    }

    // Create new user
    const newUser = {
      LTE_SUB,
      LTE_IMSI,
      LTE_ISDN: "",
      LTE_PROFILE,
      LTE_PKG,
    };
    db.users.push(newUser);

    // Create service order based on operation type
    if (operation === "ADD_SERVICE_ALL") {
      db.serviceOrders.push({
        LTE_SUB,
        CIRT_TYPE: "S",
        VOICE_SO: SID_VOICE || "",
        BB_SO: SID_BB || "",
        AB_SO: SID_AB || "",
      });
    } else if (operation === "ADD_SOD_ALL") {
      db.serviceOrders.push({
        LTE_SUB,
        CIRT_TYPE: "N",
        VOICE_SO: SO_ID_VOICE || "",
        BB_SO: SO_ID_BB || "",
        AB_SO: SO_ID_AB || "",
      });
    }

    await writeDB(db);
    return res.json({
      result: "success",
      message: "LTE User Create Operation Completed",
    });
  } catch (e) {
    res.status(500).json({ result: "failed", message: "CREATE_LTE_KI" });
  }
});

// SUB DELETE - DEL_ALL, DEL_KI, DEL_SUB
app.post("/api/users/delete", async (req, res) => {
  try {
    const { operation, LTE_IMSI, LTE_SUB } = req.body;
    const db = await readDB();

    if (operation === "DEL_ALL") {
      const userExists = db.users.find(
        (u) => u.LTE_SUB === LTE_SUB && u.LTE_IMSI === LTE_IMSI,
      );
      if (!userExists) {
        return res.json({ result: "failed", message: "DELETE_LTE_UDR_HSS" });
      }
      db.users = db.users.filter(
        (u) => !(u.LTE_SUB === LTE_SUB && u.LTE_IMSI === LTE_IMSI),
      );
      db.serviceOrders = db.serviceOrders.filter(
        (so) => so.LTE_SUB !== LTE_SUB,
      );
    } else if (operation === "DEL_KI") {
      const userExists = db.users.find((u) => u.LTE_IMSI === LTE_IMSI);
      if (!userExists) {
        return res.json({ result: "failed", message: "DELETE_LTE_KI" });
      }
      db.users = db.users.filter((u) => u.LTE_IMSI !== LTE_IMSI);
    } else if (operation === "DEL_SUB") {
      const userExists = db.users.find((u) => u.LTE_SUB === LTE_SUB);
      if (!userExists) {
        return res.json({ result: "failed", message: "DELETE_LTE_UDR_HSS" });
      }
      db.users = db.users.filter((u) => u.LTE_SUB !== LTE_SUB);
      db.serviceOrders = db.serviceOrders.filter(
        (so) => so.LTE_SUB !== LTE_SUB,
      );
    }

    await writeDB(db);
    return res.json({
      result: "success",
      message: "LTE User Delete Operation Completed",
    });
  } catch (e) {
    res.status(500).json({ result: "failed", message: "Server error" });
  }
});

// MODIFY APN
app.post("/api/users/modify", async (req, res) => {
  try {
    const { LTE_SUB, LTE_PKG } = req.body;
    const db = await readDB();
    const user = db.users.find((u) => u.LTE_SUB === LTE_SUB);

    if (user) {
      user.LTE_PKG = LTE_PKG;
      await writeDB(db);
      return res.json({
        result: "success",
        message: "LTE ModAPN Operation Completed",
      });
    }
    return res.json({ result: "failed", message: "User not found" });
  } catch (e) {
    res.status(500).json({ result: "failed", message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
