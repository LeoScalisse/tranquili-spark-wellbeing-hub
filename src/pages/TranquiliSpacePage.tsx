
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ShoppingCart, Star, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Fidget Spinner Relaxante',
    description: 'Spinner premium para reduzir ansiedade e stress',
    price: 29.90,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop',
    category: 'Brinquedos Sensoriais'
  },
  {
    id: '2',
    name: 'Cubo Anti-Stress',
    description: 'Cubo multifuncional para alívio da ansiedade',
    price: 39.90,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop',
    category: 'Brinquedos Sensoriais'
  },
  {
    id: '3',
    name: 'Óleo Essencial Lavanda',
    description: 'Óleo puro de lavanda para relaxamento',
    price: 49.90,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=300&fit=crop',
    category: 'Aromaterapia'
  },
  {
    id: '4',
    name: 'Difusor Ultrassônico',
    description: 'Difusor de aromas com luzes LED relaxantes',
    price: 89.90,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop',
    category: 'Aromaterapia'
  },
  {
    id: '5',
    name: 'Bola de Stress',
    description: 'Bola de gel para exercícios de mão e alívio do stress',
    price: 19.90,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop',
    category: 'Brinquedos Sensoriais'
  },
  {
    id: '6',
    name: 'Kit Aromaterapia Completo',
    description: 'Kit com 6 óleos essenciais e difusor portátil',
    price: 149.90,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop',
    category: 'Aromaterapia'
  }
];

const TranquiliSpacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cart, setCart] = useState<string[]>([]);
  const { playClickSound, playSuccessSound } = useAudio();
  const navigate = useNavigate();

  const categories = ['Todos', 'Brinquedos Sensoriais', 'Aromaterapia'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCart([...cart, productId]);
    playSuccessSound();
    toast.success('Produto adicionado ao carrinho!', {
      icon: '🛒',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="glassmorphism">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                playClickSound();
                navigate('/');
              }}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                TranquiliSpace Loja
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Produtos de bem-estar e autocuidado
              </p>
            </div>
            
            {cart.length > 0 && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                🛒 {cart.length}
              </Badge>
            )}
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="glassmorphism pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    playClickSound();
                    setSelectedCategory(category);
                  }}
                  className="glassmorphism"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="glassmorphism hover:scale-105 transition-transform">
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <Badge variant="outline" className="text-xs mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-sm text-muted-foreground">
                    ({product.rating})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  
                  <Button
                    onClick={() => addToCart(product.id)}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="glassmorphism">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou termo de busca
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>💡 Sobre Nossos Produtos</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🧸 Brinquedos Sensoriais</h4>
                <p>Produtos especialmente selecionados para ajudar no alívio do stress e ansiedade através do toque e movimento.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">🌿 Aromaterapia</h4>
                <p>Óleos essenciais e difusores de alta qualidade para criar um ambiente relaxante e promover o bem-estar.</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-accent/20">
              <p className="text-sm">
                <strong>Nota:</strong> Esta é uma demonstração da funcionalidade de e-commerce. 
                Em uma implementação real, seria necessário integrar com um sistema de pagamento e gestão de estoque.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranquiliSpacePage;
