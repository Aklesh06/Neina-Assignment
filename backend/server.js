import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
app.use(cors());
app.use(bodyParser.json());

const bookings = []; 

const weeklySlots = {
    Monday: [
      { time: "10:00 AM", available: 10 },
      { time: "11:00 AM", available: 10 },
      { time: "01:00 PM", available: 10 },
      { time: "03:00 PM", available: 10 },
      { time: "04:00 PM", available: 10 },
      { time: "05:00 PM", available: 10 },
    ],
    Tuesday: [
        { time: "10:00 AM", available: 10 },
        { time: "11:00 AM", available: 10 },
        { time: "01:00 PM", available: 10 },
        { time: "03:00 PM", available: 10 },
        { time: "04:00 PM", available: 10 },
        { time: "05:00 PM", available: 10 },
    ],
    Wednesday: [
        { time: "10:00 AM", available: 10 },
        { time: "11:00 AM", available: 10 },
        { time: "01:00 PM", available: 10 },
        { time: "03:00 PM", available: 10 },
        { time: "04:00 PM", available: 10 },
        { time: "05:00 PM", available: 10 },
      ],
    Thursday: [
        { time: "10:00 AM", available: 10 },
        { time: "11:00 AM", available: 10 },
        { time: "01:00 PM", available: 10 },
        { time: "03:00 PM", available: 10 },
        { time: "04:00 PM", available: 10 },
        { time: "05:00 PM", available: 10 },
      ],
    Friday: [
        { time: "10:00 AM", available: 10 },
        { time: "11:00 AM", available: 10 },
        { time: "01:00 PM", available: 10 },
        { time: "03:00 PM", available: 10 },
        { time: "04:00 PM", available: 10 },
        { time: "05:00 PM", available: 10 },
      ],
    Saturday: [
        { time: "10:00 AM", available: 10 },
        { time: "11:00 AM", available: 10 },
        { time: "01:00 PM", available: 10 },
        { time: "03:00 PM", available: 10 },
        { time: "04:00 PM", available: 10 },
        { time: "05:00 PM", available: 10 },
      ],
    Sunday: [
        { time: "10:00 AM", available: 10 },
        { time: "11:00 AM", available: 10 },
        { time: "01:00 PM", available: 10 },
        { time: "03:00 PM", available: 10 },
        { time: "04:00 PM", available: 10 },
        { time: "05:00 PM", available: 10 },
      ],

    
  };

const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getUTCDay()];
  };

app.get("/api/slots", (req, res) => {
    const { date } = req.query;
  
    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }
  
    const dayOfWeek = getDayOfWeek(date);
    const slots = weeklySlots[dayOfWeek] || [];
    res.status(200).json(slots);
  });

app.post('/api/bookings', (req, res) => {
  const { date, time, guests, name, contact } = req.body;

  if (!date || !time || !guests || !name || !contact) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const dayOfWeek = getDayOfWeek(date);
  const slots = weeklySlots[dayOfWeek];

  if (!slots) {
    return res.status(400).json({ message: "No slots available for this day." });
  }

  const slot = slots.find((s) => s.time === time);
  if (!slot || slot.available <= 0) {
    return res.status(400).json({ message: "Slot not available." });
  }

  slot.available -= 1;

  const newBooking = { id: bookings.length + 1, date, time, guests, name, contact };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});


app.get('/api/bookings', (req, res) => {
  res.status(200).json(bookings);
});


app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const index = bookings.findIndex((booking) => booking.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  bookings.splice(index, 1);
  res.status(200).json({ message: 'Booking deleted successfully.' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));