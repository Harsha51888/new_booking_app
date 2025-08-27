import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";

export default function BookingWidget({place}) {
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [redirect,setRedirect] = useState('');
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    if (numberOfNights === 0) {
      numberOfNights = 1;
    }
  }

  async function bookThisPlace() {
    const response = await axios.post('/bookings', {
      checkIn,checkOut,numberOfGuests,name,phone,
      place:place._id,
  price:numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex flex-col sm:flex-row">
          <div className="py-3 px-4 w-full">
            <label>Check in:</label>
            <input type="date"
                   value={checkIn}
                   min={today}
                   onChange={ev => setCheckIn(ev.target.value)}/>
          </div>
          <div className="py-3 px-4 border-t sm:border-t-0 sm:border-l w-full">
            <label>Check out:</label>
            <input type="date" value={checkOut}
                   min={checkIn || today}
                   onChange={ev => setCheckOut(ev.target.value)}/>
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            min={1}
            onChange={ev => setNumberOfGuests(Math.max(1, Number(ev.target.value)))}
            placeholder="e.g. 2"
            className="border rounded-lg px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
              placeholder="e.g. John Doe"
              className="border rounded-lg px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={ev => setPhone(ev.target.value)}
              placeholder="e.g. +1 555 123 4567"
              className="border rounded-lg px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {checkIn && checkOut && (
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  );
}