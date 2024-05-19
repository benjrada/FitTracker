import React, { useState } from 'react';
import axios from 'axios';

const ExerciseForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        duration: '',
        calories: '',
    });

    const { name, duration, calories } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post('/api/exercises/add', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res.data);
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="name" value={name} onChange={onChange} placeholder="Exercise Name" required />
            <input type="number" name="duration" value={duration} onChange={onChange} placeholder="Duration (minutes)" required />
            <input type="number" name="calories" value={calories} onChange={onChange} placeholder="Calories Burned" required />
            <button type="submit">Log Exercise</button>
        </form>
    );
};

export default ExerciseForm;
