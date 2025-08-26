import React from 'react';
import { useAuth } from './context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  if (!user) {
    return <p>Loading profile...</p>;
  }
  
  const familyData = [
    { name: 'Priya Kumar', relation: 'Spouse', age: 29 },
    { name: 'Anjali Kumar', relation: 'Daughter', age: 5 },
  ];
  
  const photoUrl = 'https://blog.swiggy.com/wp-content/uploads/2023/10/IMG_7701-1-991x1024.jpg';

  return (
    <>
      <header className="header">
        <h1>User Profile</h1>
      </header>
      <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <img src={photoUrl} alt="User Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', marginRight: '24px', objectFit: 'cover' }} />
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{user.name || 'Ravi Kumar'}</h2>
            <p style={{ margin: '4px 0', fontSize: '16px', color: '#6b7280' }}>{user.phone_number}</p>
            <p style={{ margin: '4px 0', fontSize: '16px', color: '#6b7280' }}>Delivery Partner @ Swiggy</p>
          </div>
        </div>
        <hr style={{ width: '100%', border: 0, borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 600 }}>Family Details</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '16px' }}>
            {familyData.map(member => (
              <li key={member.name} style={{ padding: '10px 0', borderBottom: '1px solid #f0f2f5' }}>
                <strong style={{ fontWeight: 600 }}>{member.name}</strong> ({member.relation}) - {member.age} years old
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default Profile;