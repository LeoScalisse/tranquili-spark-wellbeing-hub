import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, BarChart3, TrendingUp } from 'lucide-react';
const ReportPage = () => {
  const {
    user
  } = useUser();
  const {
    playClickSound
  } = useAudio();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const getCurrentMonthDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    return {
      daysInMonth,
      firstDay
    };
  };
  const getMoodForDate = (day: number) => {
    if (!user) return null;
    const dateString = new Date(selectedYear, selectedMonth, day).toDateString();
    return user.moods.find(mood => mood.date === dateString);
  };
  const getMoodStats = () => {
    if (!user) return {
      total: 0,
      mostFrequent: null,
      distribution: {}
    };
    const monthMoods = user.moods.filter(mood => {
      const moodDate = new Date(mood.timestamp);
      return moodDate.getMonth() === selectedMonth && moodDate.getFullYear() === selectedYear;
    });
    const distribution: {
      [key: string]: number;
    } = {};
    monthMoods.forEach(mood => {
      distribution[mood.mood] = (distribution[mood.mood] || 0) + 1;
    });
    const mostFrequent = Object.entries(distribution).reduce((a, b) => distribution[a[0]] > distribution[b[0]] ? a : b, ['', 0]);
    return {
      total: monthMoods.length,
      mostFrequent: mostFrequent[0] ? {
        mood: mostFrequent[0],
        count: mostFrequent[1]
      } : null,
      distribution
    };
  };
  const {
    daysInMonth,
    firstDay
  } = getCurrentMonthDays();
  const stats = getMoodStats();
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glassmorphism">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="icon" onClick={() => {
            playClickSound();
            navigate('/');
          }} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Relatório de Humor
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Acompanhe sua jornada emocional
              </p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glassmorphism">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {monthNames[selectedMonth]} {selectedYear}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                    playClickSound();
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}>
                      ‹
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                    playClickSound();
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}>
                      ›
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map(day => <div key={day} className="text-center text-xs font-medium p-2">
                      {day}
                    </div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before the first day of the month */}
                  {Array.from({
                  length: firstDay
                }, (_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
                  
                  {/* Days of the month */}
                  {Array.from({
                  length: daysInMonth
                }, (_, i) => {
                  const day = i + 1;
                  const mood = getMoodForDate(day);
                  const isToday = day === new Date().getDate() && selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear();
                  return <div key={day} className={`
                          aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs
                          ${isToday ? 'border-accent' : 'border-border'}
                          ${mood ? 'bg-secondary' : 'bg-background'}
                        `}>
                        <span className="font-medium">{day}</span>
                        {mood && <span className="text-lg">{mood.emoji}</span>}
                      </div>;
                })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estatísticas do Mês
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dias registrados</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                
                {stats.mostFrequent && <div>
                    <p className="text-sm text-muted-foreground">Humor mais frequente</p>
                    <Badge variant="secondary" className="text-base mt-1">
                      {stats.mostFrequent.mood} ({stats.mostFrequent.count}x)
                    </Badge>
                  </div>}
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Distribuição</p>
                  <div className="space-y-2">
                    {Object.entries(stats.distribution).map(([mood, count]) => <div key={mood} className="flex justify-between items-center">
                        <span className="text-sm">{mood}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Dicas de Bem-estar</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    🌟 Registre seu humor diariamente para identificar padrões e gatilhos emocionais.
                  </p>
                  <p>💙 Celebre os dias positivos e seja gentil consigo nos dias difíceis.</p>
                  <p>
                    📈 Use estes dados para conversar com a Tranquilinha sobre estratégias de bem-estar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default ReportPage;