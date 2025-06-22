
import { useNavigate } from 'react-router-dom';
import BotanicalGardenGame from '@/components/garden/BotanicalGardenGame';

const BotanicalGardenPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <BotanicalGardenGame onBack={handleBack} />;
};

export default BotanicalGardenPage;
