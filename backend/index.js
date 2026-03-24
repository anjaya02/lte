const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [] };
  }
}

async function writeDB(db) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write to DB:', err);
  }
}

// 1. Search User (By IMSI or SUB)
app.get('/api/users/search', async (req, res) => {
  try {
    const { lteImsi, lteSub } = req.query;
    const db = await readDB();
    const user = db.users.find(u => 
      (lteImsi && u.lteImsi === lteImsi) || 
      (lteSub && u.lteSub === lteSub)
    );
    if (user) {
      return res.json({ success: true, data: user });
    }
    return res.status(404).json({ success: false, message: 'User not found' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. Add/Save User (Updates new LTE IMSI on an existing SUB)
app.post('/api/users/add', async (req, res) => {
  try {
    const { lteSub, newLteImsi, lteImsi, lteIsdn, lteProfile, ltePkg } = req.body;
    const db = await readDB();
    const user = db.users.find(u => u.lteSub === lteSub);
    
    if (user) {
      if (newLteImsi) user.lteImsi = newLteImsi;
      // Depending on other backend logic, you might save other fields here as well
      await writeDB(db);
      return res.json({ success: true, message: 'User updated successfully', data: user });
    }
    // If it didn't exist, we could create it, but usually "Add User" here means provisioning.
    return res.status(404).json({ success: false, message: 'User not found for that SUB' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3a. Delete by SUB
app.delete('/api/users/sub/:sub', async (req, res) => {
  try {
    const { sub } = req.params;
    const db = await readDB();
    db.users = db.users.filter(u => u.lteSub !== sub);
    await writeDB(db);
    return res.json({ success: true, message: 'User deleted successfully (by SUB)' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3b. Delete by IMSI (KI)
app.delete('/api/users/imsi/:imsi', async (req, res) => {
  try {
    const { imsi } = req.params;
    const db = await readDB();
    db.users = db.users.filter(u => u.lteImsi !== imsi);
    await writeDB(db);
    return res.json({ success: true, message: 'User deleted successfully (by KI)' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3c. Delete ALL
app.delete('/api/users/all', async (req, res) => {
  try {
    const { sub, imsi } = req.query;
    const db = await readDB();
    db.users = db.users.filter(u => !(u.lteSub === sub && u.lteImsi === imsi));
    await writeDB(db);
    return res.json({ success: true, message: 'User deleted successfully (by ALL)' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4. Modify User (Update PKG by SUB)
app.put('/api/users/modify', async (req, res) => {
  try {
    const { lteSub, ltePkg } = req.body;
    const db = await readDB();
    const user = db.users.find(u => u.lteSub === lteSub);
    
    if (user) {
      user.ltePkg = ltePkg;
      await writeDB(db);
      return res.json({ success: true, message: 'User package updated', data: user });
    }
    return res.status(404).json({ success: false, message: 'User not found' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
