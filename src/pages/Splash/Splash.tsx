import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

export default function Splash() {
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      nav('/map');
    }, 2000);
    return () => clearTimeout(timer);
  }, [nav]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-white">
      <img
        src="src/assets/images/SplashLogo.png"
        alt="Splash Logo"
        className="w-70 h-70 object-contain animate-splash"
      />
    </div>
  );
}
