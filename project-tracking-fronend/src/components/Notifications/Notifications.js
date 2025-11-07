import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import "../../styles/Notifications/Notifications.css";
import { useEmployee } from "../../context/EmployeeContext";


const Notifications = () => {
    const { employee } = useEmployee();  // get current employee
    const isAGM = employee.role === "Assistant General Manager";
    const userId = employee?.empId;
    const [notifications, setNotifications] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Fetch notifications
    //   const fetchNotifications = async () => {
    //     try {
    //       const res = await axios.get(`http://localhost:8080/api/notifications/${userId}`);
    //       setNotifications(res.data);
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };


    const formatDateTime = (dateString) => {
        const d = new Date(dateString);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
        const day = String(d.getDate()).padStart(2, '0');

        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 → 12

        return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    };


    const fetchNotifications = async () => {
        // Dummy data
        const dummyData = [
            {
                id: 1,
                title: "New Project Assigned",
                message: "Project Alpha has been assigned to you.",
                type: "PROJECT_ASSIGN",
                readStatus: true,
                createdAt: "2025-11-06T10:30:00",
            },
            {
                id: 2,
                title: "Task Assigned",
                message: "You have been assigned a new task in Project Beta.",
                type: "ACTIVITY_ASSIGN",
                readStatus: false,
                createdAt: "2025-11-05T14:20:00",
            },
            {
                id: 3,
                title: "Extra Hours Request",
                message: "PM requests extra hours for Project Gamma.",
                type: "REQUEST",
                readStatus: false,
                createdAt: "2025-11-04T09:00:00",
            },
            {
                id: 4,
                title: "Extra Hours Request",
                message: "Team member requests extra hours for Project Delta.",
                type: "REQUEST",
                readStatus: false,
                createdAt: "2025-11-03T16:45:00",
            },
            {
                id: 5,
                title: "Meeting Scheduled",
                message: "Client meeting scheduled for Project Epsilon.",
                type: "MEETING",
                readStatus: false,
                createdAt: "2025-11-06T12:00:00",
            }
        ];
        dummyData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNotifications(dummyData);
    };


    useEffect(() => {
        fetchNotifications();
    }, [userId]);

    const unreadCount = notifications.filter(n => !n.readStatus).length;

    // Open notification details & mark as read
    //   const openDetails = async (n) => {
    //     if (!n.readStatus) {
    //       await axios.put(`http://localhost:8080/api/notifications/read/${n.id}`);
    //       fetchNotifications();
    //     }
    //     setSelectedNotification(n);
    //   };

    const closeDetails = () => setSelectedNotification(null);

    //   // Approve / Reject (AGM only)
    //   const handleApproval = async (approved) => {
    //     try {
    //       await axios.put(`http://localhost:8080/api/notifications/approve/${selectedNotification.id}`);
    //       fetchNotifications();
    //       closeDetails();
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };

    const openDetails = (n) => {
        // For AGM and REQUEST type, do NOT mark as read automatically
        if (!(isAGM && n.type === "REQUEST")) {
            if (!n.readStatus) {
                setNotifications((prev) =>
                    prev.map((item) =>
                        item.id === n.id ? { ...item, readStatus: true } : item
                    )
                );
            }
        }
        setSelectedNotification(n);
    };



    const handleApproval = (approved) => {
        console.log("Approved?", approved);

        // Mark the notification as read locally
        setNotifications((prev) =>
            prev.map((item) =>
                item.id === selectedNotification.id
                    ? { ...item, readStatus: true }
                    : item
            )
        );

        // Close the modal
        setSelectedNotification(null);
    };



    return (
        <>
            {/* Bell Icon */}
            <div className="notification-icon" onClick={() => setOpenModal(true)}>
                <FaBell size={22} />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </div>

            {/* Notifications List Modal */}
            {openModal && (
                <div className="overlay" onClick={() => setOpenModal(false)}>
                    <div className="notification-modal" onClick={e => e.stopPropagation()}>
                        {/* Close button at top-right */}
                        <button className="close-top-btn" onClick={() => setOpenModal(false)}>
                            &times;
                        </button>

                        <h3>Notifications</h3>
                        <ul className="notification-list">
                            {notifications.length === 0 && <p>No Notifications</p>}
                            {notifications.map(n => (
                                <li
                                    key={n.id}
                                    className={`notification-item ${!n.readStatus ? "unread" : ""}`}
                                    onClick={() => openDetails(n)}
                                >
                                    <strong>{n.title}</strong>
                                    <small>{formatDateTime(n.createdAt)}</small>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}

            {/* Notification Details Modal */}
            {selectedNotification && (
                <div className="overlay" onClick={closeDetails}>
                    <div className="details-modal" onClick={e => e.stopPropagation()}>
                        <h3>{selectedNotification.title}</h3>
                        <p>{selectedNotification.message}</p>
                       <small>{formatDateTime(selectedNotification.createdAt)}</small>

                        {/* Approve / Reject buttons only for AGM & type="REQUEST" */}
                        {isAGM && selectedNotification.type === "REQUEST" && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                                <button className="approve-btn" onClick={() => handleApproval(true)}>Approve</button>
                                <button className="reject-btn" onClick={() => handleApproval(false)}>Reject</button>
                            </div>
                        )}

                        <button className="close-btn" onClick={closeDetails}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Notifications;
