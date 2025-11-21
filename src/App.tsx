import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Map from './pages/Map/Map';
import Splash from './pages/Splash/Splash';
// import AiRecommend from './pages/AiRecommend';
// import MyPage from './pages/MyPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/map" element={<Map />} />
        {/* <Route path="/recommend" element={<AiRecommend />} />
          <Route path="/mypage" element={<MyPage />} /> */}
      </Routes>
    </Router>
  );
}
