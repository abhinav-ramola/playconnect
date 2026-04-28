import React, { useState } from 'react';

function isTimeOverlap(slot1, slot2) {
    // slot format: "HH:MM-HH:MM"
    const [start1, end1] = slot1.split('-').map(t => t.trim());
    const [start2, end2] = slot2.split('-').map(t => t.trim());
    return !(end1 <= start2 || end2 <= start1);
}

function BookingForm({ onBook }) {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [slot, setSlot] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !latitude || !longitude || !slot) return;
        onBook({ name, latitude, longitude, slot });
        setName('');
        setLatitude('');
        setLongitude('');
        setSlot('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded">
            <div>
                <label className="block">Turf Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required className="border px-2 py-1 w-full" />
            </div>
            <div>
                <label className="block">Latitude</label>
                <input value={latitude} onChange={e => setLatitude(e.target.value)} required className="border px-2 py-1 w-full" />
            </div>
            <div>
                <label className="block">Longitude</label>
                <input value={longitude} onChange={e => setLongitude(e.target.value)} required className="border px-2 py-1 w-full" />
            </div>
            <div>
                <label className="block">Time Slot</label>
                <input value={slot} onChange={e => setSlot(e.target.value)} required placeholder="e.g. 18:00-19:00" className="border px-2 py-1 w-full" />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Book Turf</button>
        </form>
    );
}

function BookingList({ bookings }) {
    if (bookings.length === 0) return <p>No bookings yet.</p>;
    return (
        <ul className="mt-4 space-y-2">
            {bookings.map((b, idx) => (
                <li key={idx} className="border p-2 rounded">
                    <strong>{b.name}</strong> <br />
                    Lat: {b.latitude}, Lng: {b.longitude} <br />
                    Slot: {b.slot}
                </li>
            ))}
        </ul>
    );
}

export default function BookingManager() {
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');

    const handleBook = (newBooking) => {
        // Check for conflict
        const conflict = bookings.some(b =>
            b.latitude === newBooking.latitude &&
            b.longitude === newBooking.longitude &&
            isTimeOverlap(b.slot, newBooking.slot)
        );
        if (conflict) {
            setMessage('This slot is already booked for this turf.');
            return;
        }
        setBookings([...bookings, newBooking]);
        setMessage('Booking successful!');
    };

    return (
        <div className="max-w-xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Turf Booking Manager</h2>
            <BookingForm onBook={handleBook} />
            {message && <div className="mt-2 text-center font-semibold text-red-600">{message}</div>}
            <BookingList bookings={bookings} />
        </div>
    );
}
