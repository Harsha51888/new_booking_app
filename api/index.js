const express = require('express');


const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.js')
const Place = require('./models/place.js');
const Booking = require('./models/booking.js');
const app = express();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt =require('jsonwebtoken');

// Root route for health check or base API response
app.get('/', (req, res) => {
  res.send('API is running');
});
const jwtSecret = process.env.JWT_SECRET;
const cookieParser = require('cookie-parser');
const bcryptSalt = bcrypt.genSaltSync(10);
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
// List of allowed origins for CORS (local dev and deployed frontend)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mybookingapp-frontend.onrender.com',
];
app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
// Handle preflight requests for all routes
app.options('*', cors({
  credentials: true,
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mybookingapp-frontend.onrender.com',
];
app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
// Handle preflight requests for all routes
app.options('*', cors({
  credentials: true,
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
// Delete a place (accommodation) by ID, only if owned by the user
app.delete('/places/:id', async (req, res) => {
  const { id } = req.params;
  const userData = await getUserDataFromToken(req);
  if (!userData) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const place = await Place.findById(id);
    if (!place) return res.status(404).json({ error: 'Not found' });
    if (String(place.owner) !== String(userData.id)) {
      return res.status(403).json({ error: 'You are not allowed to delete this accommodation.' });
    }
    await Place.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete accommodation.' });
  }
});
mongoose.connect(process.env.MONGO_URL)
function getUserDataFromToken(req) {
  return new Promise((resolve) => {
    const token = req.cookies.token;
    if (!token) return resolve(null);
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) return resolve(null);
      resolve(userData);
    });
  });
}
app.get('/test', (req, res) => {
    res.json('test ok');
});
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (!userDoc) {
    return res.status(404).json({ error: 'User not found. Please register first.' });
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) {
    return res.status(422).json({ error: 'Incorrect password.' });
  }
  jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
    if (err) throw err;
    // Set cookie flags for cross-site cookies in production
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      path: '/',
    }).json(userDoc);
  });
});
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.json(null);
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.json(null);
        const userDoc = await User.findById(userData.id);
        res.json(userDoc);
    });
});
app.post('/logout', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        expires: new Date(0),
        path: '/',
    }).json(true);
});
app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  // Validate URL starts with http or https
  if (!link || !(link.startsWith('http://') || link.startsWith('https://'))) {
    return res.status(400).json({ error: 'Invalid image URL. Must start with http:// or https://'});
  }
  // Get extension from link
  const extMatch = link.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  const ext = extMatch ? extMatch[1] : 'jpg';
  const newName = 'photo' + Date.now() + '.' + ext;
  const destPath = __dirname + '/uploads/' + newName;
  try {
    await imageDownloader.image({
      url: link,
      dest: destPath,
    });
    // Validate file is an image
    let type;
    try {
      const fileType = await import('file-type');
      type = await fileType.fileTypeFromFile(destPath);
    } catch (err) {
      fs.unlinkSync(destPath);
      return res.status(500).json({ error: 'Image validation failed.' });
    }
    if (!type || !type.mime.startsWith('image/')) {
      fs.unlinkSync(destPath); // Remove invalid file
      return res.status(400).json({ error: 'Downloaded file is not a valid image.' });
    }
    res.json(`/uploads/${newName}`);
  } catch (e) {
    res.status(500).json({ error: 'Failed to download image.' });
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads/');
  },
  filename: function (req, file, cb) {
    // Save with original name and timestamp for uniqueness
    const ext = file.originalname.split('.').pop();
    const base = file.originalname.replace(/\.[^/.]+$/, "");
    cb(null, base + '-' + Date.now() + '.' + ext);
  }
});
const photosMiddleware = multer({ storage });
app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { filename } = req.files[i];
    // Ensure only one /uploads/ prefix
    uploadedFiles.push(`/uploads/${filename}`);
  }
  res.json(uploadedFiles);
});
app.post('/places', (req, res) => {
 const { token } = req.cookies;
 const { title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
 if (!token) return res.status(401).json({ error: 'Unauthorized' });
 jwt.verify(token, jwtSecret, {}, async (err, userData) => {
   if (err) return res.status(401).json({ error: 'Unauthorized' });
   const placeDoc = await Place.create({
     owner: userData.id,
     title,
     address,
     photos,
     description,
     perks,
     extraInfo,
     checkIn,
     checkOut,
     maxGuests,
     price,
   });
   res.json(placeDoc);
 });
});
app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});
app.put('/places', async (req, res) => {
   const { token } = req.cookies;
   const { id, title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
     const placeDoc = await Place.findById(id);
     if (userData.id === placeDoc.owner.toString()) {
       placeDoc.title = title;
       placeDoc.address = address;
       placeDoc.photos = photos;
       placeDoc.description = description;
       placeDoc.perks = perks;
       placeDoc.extraInfo = extraInfo;
       placeDoc.checkIn = checkIn;
       placeDoc.checkOut = checkOut;
       placeDoc.maxGuests = maxGuests;
       placeDoc.price = price;
       await placeDoc.save();
       res.json(placeDoc);
     } else {
       res.status(403).json({ error: 'Unauthorized' });
     }
   });
 });
app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

// Create a booking, status defaults to 'pending'
app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromToken(req);
  const {
    place, checkIn, checkOut, numberOfGuests, name, phone, price
  } = req.body;
  Booking.create({
    user: userData.id,
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    status: 'pending',
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    res.status(500).json({ error: 'Booking creation failed.' });
  });
});

// Get bookings for places owned by the logged-in user (owner view)
app.get('/owner/bookings', async (req, res) => {
  const userData = await getUserDataFromToken(req);
  if (!userData) return res.status(401).json({ error: 'Unauthorized' });
  // Find places owned by user
  const places = await Place.find({ owner: userData.id });
  const placeIds = places.map(p => p._id);
  // Find bookings for those places
  const bookings = await Booking.find({ place: { $in: placeIds } }).populate('place user');
  res.json(bookings);
});

// Accept or reject a booking (owner action)
app.post('/owner/bookings/:id/status', async (req, res) => {
  const userData = await getUserDataFromToken(req);
  if (!userData) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  const booking = await Booking.findById(id).populate('place');
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  if (String(booking.place.owner) !== String(userData.id)) {
    return res.status(403).json({ error: 'You are not allowed to update this booking.' });
  }
  booking.status = status;
  await booking.save();
  res.json(booking);
});

  
app.get('/bookings', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  });
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Return all places for the logged-in user (used by frontend /user-places fetch)
app.get('/user-places', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = userData;
    const places = await Place.find({ owner: id });
    // Add fallback for 'addedPhotos' for backward compatibility
    const placesWithPhotos = places.map(place => {
      const obj = place.toObject();
      if (!obj.photos && obj.addedPhotos) {
        obj.photos = obj.addedPhotos;
      }
      return obj;
    });
    res.json(placesWithPhotos);
  });
});