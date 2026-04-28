import React, { useState } from 'react';

const initialTurfs = [];

function TurfForm({ onAddTurf }) {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [status, setStatus] = useState('available');
    const [slot, setSlot] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !latitude || !longitude || !slot) return;
        onAddTurf({
            name,
            latitude,
            longitude,
            slot,
            status,
        });
        setName('');
        setLatitude('');
        setLongitude('');
        setSlot('');
        setStatus('available');
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
            <div>
                <label className="block">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="border px-2 py-1 w-full">
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Add Turf</button>
        </form>
    );
}

function TurfList({ turfs }) {
    if (turfs.length === 0) return <p>No turfs added yet.</p>;
    return (
        <ul className="mt-4 space-y-2">
            {turfs.map((turf, idx) => (
                <li key={idx} className="border p-2 rounded flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <strong>{turf.name}</strong> <br />
                        Lat: {turf.latitude}, Lng: {turf.longitude} <br />
                        Slot: {turf.slot}
                    </div>
                    <span className={
                        turf.status === 'booked' ? 'text-red-600 font-bold' : 'text-green-600 font-bold'
                    }>
                        {turf.status === 'booked' ? 'Booked' : 'Available'}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default function TurfManager() {
    const [turfs, setTurfs] = useState(initialTurfs);

    const handleAddTurf = (turf) => {
        setTurfs([...turfs, turf]);
    };

    return (
        <div className="max-w-xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Turf Manager</h2>
            <TurfForm onAddTurf={handleAddTurf} />
            <TurfList turfs={turfs} />
        </div>
    );
}
