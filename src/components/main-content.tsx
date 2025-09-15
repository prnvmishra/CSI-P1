import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ChevronDown, Zap, Sparkles, Wand2 } from 'lucide-react';
import { AIAssistant } from '@/components/gemini-assistant';
import { PromptMaterializer } from '@/components/prompt-materializer';

interface PlaceholderImage {
  id: string;
  imageUrl: string;
  description: string;
  imageHint: string;
}

const FeatureCard = ({ image, index }: { image: PlaceholderImage; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full enhanced-card overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative">
          <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="font-headline text-xl pt-2">
            <span className="gradient-text">Feature {index + 1}</span>
          </CardTitle>
          <CardDescription>Dynamic Content Card</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="relative h-48 w-full rounded-xl overflow-hidden mb-4 shadow-lg"
            animate={isHovered ? { scale: 1.03 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Image
              src={image.imageUrl}
              alt={image.description}
              data-ai-hint={image.imageHint}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
          <p className="text-muted-foreground mb-4">
            {image.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
            <Badge variant="secondary" className="text-xs">Interactive</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="group w-full">
            Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export function MainContent() {
  const heroImage = PlaceHolderImages.find((img: PlaceholderImage) => img.id === 'hero-abstract');
  const cardImages = PlaceHolderImages.filter((img: PlaceholderImage) => img.id.startsWith('card-image'));
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroScale, setHeroScale] = useState(1);
  const [heroParallaxY, setHeroParallaxY] = useState(0);

  // Set initial visibility and scroll listener
  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollPosition = window.scrollY;
      
      // Calculate hero section effects
      const newOpacity = Math.max(0, 1 - scrollPosition / 500);
      const newScale = Math.max(0.9, 1 - scrollPosition / 2000);
      
      setHeroOpacity(newOpacity);
      setHeroScale(newScale);
      setHeroParallaxY(scrollPosition * 0.5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.1 });
  
  // Calculate derived state based on scroll position
  const parallaxY = Math.max(0, 100 - scrollY * 0.3);
  const aiAssistantOpacity = Math.min(1, Math.max(0, (scrollY - 200) / 200));
  const aiAssistantScale = 1 + Math.min(0.2, scrollY * 0.001);

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <motion.div 
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          transform: `translateY(${heroParallaxY}px)`,
          opacity: heroOpacity,
          scale: heroScale,
          willChange: 'transform, opacity'
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920')] bg-cover bg-center mix-blend-overlay" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="inline-block mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block mb-2">Welcome to</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              AI Studio
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Transform your ideas into reality with the power of artificial intelligence. 
            Create, customize, and explore like never before.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button size="lg" className="px-8 py-6 text-lg bg-white text-gray-900 hover:bg-gray-100">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white/20 text-white hover:bg-white/10">
              Learn More
            </Button>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 animate-bounce"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 10 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm mb-1">Scroll Down</span>
              <ChevronDown className="h-6 w-6" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Main Content */}
      <div className="relative z-10 bg-background">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="animated-bg" />
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  background: `rgba(99, 102, 241, ${Math.random() * 0.5})`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.5,
                  borderRadius: '50%',
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-24 space-y-24 relative z-10">
          {/* AI Assistant Section with Scroll Reveal */}
          <motion.div 
            ref={heroRef}
            className="relative pt-32 -mt-32"
            style={{
              opacity: aiAssistantOpacity,
              transform: `translateY(${Math.max(0, 100 - scrollY * 0.5)}px)`,
              willChange: 'opacity, transform'
            }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                <AIAssistant />
              </div>
            </div>
          </motion.div>

          {/* Prompt Materializer Section */}
          <motion.div 
            className="relative mt-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-emerald-600/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                <PromptMaterializer />
              </div>
            </div>
          </motion.div>

          {/* Feature Cards Section */}
          <motion.section 
            className="relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Explore the Possibilities</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {cardImages.map((image: PlaceholderImage, index: number) => (
                <FeatureCard key={image.id} image={image} index={index} />
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section 
            className="bg-gradient-to-br from-card to-card/50 rounded-3xl p-8 md:p-12 border border-border/50 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold mb-4">Ready to Transform Your Experience?</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Start exploring the power of AI-driven web interactions. Type a prompt above and see the magic happen in real-time.
              </p>
              <Button size="lg" className="group">
                Get Started
                <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
              </Button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
