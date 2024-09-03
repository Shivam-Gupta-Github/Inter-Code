import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

function Home() {

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        // console.log(id);
        toast.success("New Room Created!")
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Room id and username both are required.');
            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    }

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    }

    return (
        <div className='homepage-wrapper'>
            <div className='form-wrapper'>
                <img className='homepage-logo' src="/logo.png" alt='homepage-logo' />
                <h4 className="main-label">Paste invitation ROOM ID</h4>
                <div className='input-wrapper'>
                    <input
                        type='text'
                        className='input-box'
                        placeholder='ROOM ID'
                        value={roomId}
                        onChange={(e) => {
                            setRoomId(e.target.value);
                        }}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type='text'
                        className='input-box'
                        placeholder='USERNAME'
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        onKeyUp={handleInputEnter}
                    />
                    <button className='btn join-btn' onClick={joinRoom} >Join</button>
                    <h4>Do you want to create new Room? <a onClick={createNewRoom} href="">New Room</a></h4>
                </div>
            </div>
            <footer>
                <h4>
                    Built by &nbsp;
                    <a className='create-new-btn' href="https://www.linkedin.com/in/cse-shivam-gupta/">Shivam Gupta</a>
                </h4>
            </footer>
        </div>
    )
}

export default Home;
