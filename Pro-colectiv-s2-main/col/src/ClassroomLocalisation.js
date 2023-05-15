import React, { useState } from 'react';
import "./modal.css"

function MyTable() {
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    const handleButtonClick = (imageUrl) => {
        setShowModal(true);
        setModalImage(imageUrl);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalImage('');
    };

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>ClassrromNames</th>
                    <th>Located</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>A02</td>
                    <td>
                        <button onClick={() => handleButtonClick('images/plan.jpg')}>Click Me</button>
                    </td>
                </tr>
                <tr>
                    <td>F206</td>
                    <td>
                        <button onClick={() => handleButtonClick('images/eta22.jpg')}>Click Me</button>
                    </td>
                </tr>
                <tr>
                    <td>A32</td>
                    <td>
                        <button onClick={() => handleButtonClick('images/et33.jpg')}>Click Me</button>
                    </td>
                </tr>
                <tr>
                    <td>402</td>
                    <td>
                        <button onClick={() => handleButtonClick('images/eta44.jpg')}>Click Me</button>
                    </td>
                </tr>
                <tr>
                    <td>505</td>
                    <td>
                        <button onClick={() => handleButtonClick('images/5.jpg')}>Click Me</button>
                    </td>
                </tr>
                </tbody>
            </table>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <img src={modalImage} alt="My Image" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyTable;
