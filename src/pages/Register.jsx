import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('تم التسجيل بنجاح');
      navigate('/login');
    } catch (err) {
      alert('فشل في التسجيل');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>تسجيل حساب جديد</h2>
      <input name="fullName" onChange={handleChange} placeholder="الاسم الكامل" required />
      <input name="email" onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
      <button type="submit">تسجيل</button>
    </form>
  );
}
