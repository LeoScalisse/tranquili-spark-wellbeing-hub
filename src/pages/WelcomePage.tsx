import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-4">
            Tranquili<span className="tranquili-plus">+</span>
          </CardTitle>
          <p className="text-xl text-muted-foreground">
            Você já possui uma conta?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => navigate('/auth')}
            variant="default"
            className="w-full"
            size="lg"
          >
            Sim, já tenho uma conta
          </Button>
          <Button
            onClick={() => navigate('/onboarding')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Não, quero criar uma conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;