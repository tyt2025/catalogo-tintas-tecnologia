import React, { useState, useEffect } from 'react';
import { Search, Package, Filter } from 'lucide-react';

 const SUPABASE_URL = 'https://cxxifwpwarbrrodtzyqn.supabase.co';
   const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGlmd3B3YXJicnJvZHR6eXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjc5OTAsImV4cCI6MjA3MzgwMzk5MH0.tMgoakEvw8wsvrWZpRClZo3BpiUIJ4OQrQsiM4BGM54';
export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Función para traducir categorías
  const translateCategory = (category) => {
    const translations = {
      'printing': 'Impresión',
      'accessories': 'Accesorios',
      'audio': 'Audio',
      'cables': 'Cables',
      'storage': 'Almacenamiento',
      'networking': 'Redes',
      'office': 'Oficina',
      'power': 'Energía',
      'peripherals': 'Periféricos',
      'gamer': 'Gamer',
      'gaming': 'Gamer',
      'components': 'Componentes',
      'laptop': 'Laptop',
      'desktop': 'Escritorio',
      'security': 'Seguridad',
      'software': 'Software',
      'tv accessories': 'Accesorios TV',
      'mobile accessories': 'Accesorios Móviles',
      'pos': 'Pos',
      'printers': 'Impresoras',
      'tablets': 'Tablets',
      'video': 'Video',
      'computadoras': 'Computadoras',
      'cctv': 'CCTV',
      'almacenamiento': 'Almacenamiento'
    };
    
    if (!category) return '';
    const normalized = category.toLowerCase().trim();
    return translations[normalized] || category;
  };

  // Función para traducir subcategorías
  const translateSubcategory = (subcategory) => {
    const translations = {
      'ink cartridges': 'Cartuchos de Tinta',
      'toner cartridges': 'Cartuchos de Tóner',
      'printer accessories': 'Accesorios de Impresora',
      'printing': 'Impresión',
      'toner': 'Tóner',
      'ink': 'Tinta',
      'mouse': 'Mouse',
      'keyboard': 'Teclado',
      'webcam': 'Cámara Web',
      'headset': 'Audífonos',
      'cables': 'Cables',
      'usb cables': 'Cables USB',
      'hdmi cables': 'Cables HDMI',
      'network cables': 'Cables de Red',
      'hard drives': 'Discos Duros',
      'usb drives': 'Memorias USB',
      'memory cards': 'Tarjetas de Memoria',
      'routers': 'Routers',
      'switches': 'Switches',
      'wifi': 'WiFi',
      'speakers': 'Bocinas',
      'headphones': 'Audífonos',
      'microphones': 'Micrófonos',
      'ups': 'UPS',
      'power supplies': 'Fuentes de Poder',
      'batteries': 'Baterías',
      'monitors': 'Monitores',
      'projectors': 'Proyectores',
      'gaming mouse': 'Mouse',
      'gaming keyboard': 'Teclado',
      'gaming headset': 'Audífonos',
      'gaming chair': 'Silla',
      'mousepad': 'Mousepad',
      'controller': 'Control',
      'accessories': 'Accesorios'
    };
    
    if (!subcategory) return '';
    const normalized = subcategory.toLowerCase().trim();
    return translations[normalized] || subcategory;
  };

  // Función para obtener la etiqueta combinada de categoría + subcategoría
  const getCategoryLabel = (product) => {
    if (!product) return 'Sin categoría';
    
    const category = translateCategory(product.category);
    const subcategory = translateSubcategory(product.subcategory);
    
    // Si no hay ninguna, retornar mensaje por defecto
    if (!category && !subcategory) return 'Sin categoría';
    
    // Si solo hay subcategoría, retornarla sola
    if (!category) return subcategory;
    
    // Si solo hay categoría, retornarla sola
    if (!subcategory) return category;
    
    // Si ambas existen, combinarlas
    return `${category} - ${subcategory}`;
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/productos?select=*&order=product_name.asc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        
        // Generar etiquetas combinadas de categoría + subcategoría
        const categoryLabels = data
          .map(product => getCategoryLabel(product))
          .filter(label => label && label !== 'Sin categoría');
        
        // Eliminar duplicados y ordenar
        const uniqueCategories = [...new Set(categoryLabels)]
          .sort((a, b) => a.localeCompare(b, 'es'));
        
        setCategories(['Todas', ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const productCategoryLabel = getCategoryLabel(product);
    const matchesCategory = selectedCategory === 'Todas' || productCategoryLabel === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppContact = (product) => {
    const message = `Hola, me interesa el producto:\n*${product.product_name}*\n(SKU: ${product.sku})\n\n¿Podrían darme información sobre precio y disponibilidad?`;
    const whatsappUrl = `https://wa.me/5216862504012?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            Tintas Y Tecnología SMT
          </h1>
          <p className="text-white/90 text-center">Catálogo de Productos</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca, descripción o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-white" />
            <h2 className="text-white text-lg font-semibold">Filtrar por categoría:</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-white text-center text-lg">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.product_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Package className="w-24 h-24 text-gray-300" />
                )}
              </div>
              
              <div className="p-4">
                <div className="text-xs text-blue-600 font-semibold mb-1">
                  {getCategoryLabel(product)}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.product_name}
                </h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500">
                    SKU: {product.sku}
                  </span>
                </div>

                <button
                  onClick={() => handleWhatsAppContact(product)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Consultar precio
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-white/50 mx-auto mb-4" />
            <p className="text-white text-xl">No se encontraron productos</p>
          </div>
        )}
      </main>
    </div>
  );
}

