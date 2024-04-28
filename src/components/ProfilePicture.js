import { useEffect, useRef } from 'react';

const getRandomColor = () => {
  const letters = '012345678';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

function ProfilePicture({ userDetails, width, height, font }) {
  // console.log(userDetails)
  const canvasRef = useRef(null);
  useEffect(() => {
    const drawOnCanvas = (initial) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 2;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clip context to circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.clip();

      // Set background
      // const color = getRandomColor()
      const color = '#bbf7d0';
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      ctx.font = `${font}px Arial`;
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, centerX, centerY);
    };

    if (userDetails && userDetails.email) {
      // console.log(userDetails.name[0])
      // Use the first letter of the name or '?' if the name is not available
      const initial =
        !userDetails.email || userDetails.email === null
          ? '?'
          : userDetails.email[0];
      drawOnCanvas(initial);
    }
  }, [userDetails]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default ProfilePicture;
