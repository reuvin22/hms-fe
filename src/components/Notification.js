import { useState, useEffect } from 'react';
import styles from '../../public/assets/css/notification.module.css';

function Notification() {
  // const [notifications, setNotifications] = useState([])

  // useEffect(() => {
  //     // For this example, we'll use mock data. In a real-world scenario, you'd fetch this data from your API.
  //     setNotifications([
  //         {
  //             id: 1,
  //             viewed: false,
  //             time: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
  //             user: {
  //                 name: 'John Doe',
  //                 image: '/path/to/john-image.jpg',
  //                 action: 'commented on your post'
  //             }
  //         },
  //         // ... Other notifications
  //     ])
  // }, [])

  const notifications = [
    {
      id: 1,
      userName: 'John Doe',
      userImage: 'path_to_image',
      action: 'commented on',
      description: 'your post',
      time: Date.now() - 3600000, // 1 hour ago
      viewed: false
    }
    // ... add more notifications as needed
  ];

  const elapsedTime = (time) => {
    const seconds = Math.floor((Date.now() - time) / 1000);

    if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  };

  console.log(styles);

  return (
    <div className="relative -translate-x-[12rem]">
      {/* <button className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 17h5l1.405-1.405A2.032 2.032 0 0020 13.6V8a7 7 0 10-14 0v5.6a2.032 2.032 0 00.595 1.395L5 17h5m1 0v1a3 3 0 01-6 0v-1m6 0v1a3 3 0 006 0v-1"
                    />
                </svg>
                {notifications.some(notification => !notification.viewed) && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    !
                </span>
                )}
            </button> */}
    </div>
    // <div className={styles.notification_dropdown}>
    //     {notifications.map(notification => (
    //         <div key={notification.id} className={styles.notification + (notification.viewed ? '' : ` ${styles.notification_unviewed}`)}>
    //             <img src={notification.user.image} alt={notification.user.name} className={styles.notification_userImage} />
    //             <span>
    //                 {notification.user.name} {notification.user.action}
    //             </span>
    //             <span className={styles.notification_time}>
    //                 {elapsedTime(notification.time)}
    //             </span>
    //         </div>
    //     ))}
    // </div>
  );
}

export default Notification;
