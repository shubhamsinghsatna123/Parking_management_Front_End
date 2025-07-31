import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!username || !token) {
      setLoading(false);
      return;
    }

    

    fetch(`http://localhost:8080/${username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        setLoading(false);
      });
  }, [username, token]);

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (!user) return <div className="text-center mt-5">User not found or not logged in.</div>;

  return (
    <>
      
          <div className="card-body">
            <p><strong>Name:</strong> {user.fullname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        {/* </div>
      </div> */}
    </>
  );
}

export default Profile;
