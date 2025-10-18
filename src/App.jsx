import React, { useState, useEffect } from 'react';
import { Search, Package, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const SUPABASE_URL = 'https://cxxifwpwarbrrodtzyqn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGlmd3B3YXJicnJvZHR6eXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjc5OTAsImV4cCI6MjA3MzgwMzk5MH0.tMgoakEvw8wsvrWZpRClZo3BpiUIJ4OQrQsiM4BGM54';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const translateCategory = (category) => {
    if (!category) return '';
    const normalized = category.toString().toLowerCase().trim();
    
    const translations = {
      'accessories': 'Accesorios',
      'accesories': 'Accesorios',
      'accesorios': 'Accesorios',
      'almacenamiento': 'Almacenamiento',
      'storage': 'Almacenamiento',
      'audio': 'Audio',
      'cables': 'Cables',
      'cctv': 'CCTV',
      'computer components': 'Componentes de Computador',
      'componentes de computadora': 'Componentes de Computador',
      'components': 'Componentes de Computador',
      'computers': 'Computadores',
      'computadoras': 'Computadores',
      'gamer': 'Gamer',
      'gaming': 'Gamer',
      'impresion': 'Impresión',
      'impresión': 'Impresión',
      'printing': 'Impresión',
      'impresoras': 'Impresoras',
      'printers': 'Impresoras',
      'mobile accesories': 'Accesorios Móviles',
      'mobile accessories': 'Accesorios Móviles',
      'accesorios móviles': 'Accesorios Móviles',
      'accesorios moviles': 'Accesorios Móviles',
      'networking': 'Redes',
      'redes': 'Redes',
      'office supplies': 'Suministros de Oficina',
      'suministros de oficina': 'Suministros de Oficina',
      'peripherals': 'Periféricos',
      'periféricos': 'Periféricos',
      'perifericos': 'Periféricos',
      'pos': 'POS',
      'power & electrical': 'Energía y Eléctricos',
      'power': 'Energía y Eléctricos',
      'energia': 'Energía y Eléctricos',
      'energía': 'Energía y Eléctricos',
      'tablets': 'Tablets',
      'tv accessories': 'Accesorios TV',
      'accesorios tv': 'Accesorios TV',
      'video': 'Video'
    };
    
    return translations[normalized] || category;
  };

  const translateSubcategory = (subcategory) => {
    if (!subcategory) return '';
    // Normalizar: minúsculas, quitar espacios extra, quitar comas
    const normalized = subcategory.toString()
      .toLowerCase()
      .trim()
      .replace(/,/g, '')  // Quitar comas
      .replace(/\s+/g, ' '); // Normalizar espacios múltiples a uno solo
    
    const translations = {
      'adaptador serial': 'Adaptador Serial',
      'adaptadores usb': 'Adaptadores USB',
      'apuntadores láser': 'Apuntadores Láser',
      'cables & adapters': 'Cables y Adaptadores',
      'cables de carga': 'Cables de Carga',
      'card readers': 'Lectores de Tarjetas',
      'charging cables': 'Cables de Carga',
      'cleaning kits': 'Kits de Limpieza',
      'kit de limpieza': 'Kits de Limpieza',
      'cooling pads': 'Bases Refrigerantes',
      'bases refrigerantes': 'Bases Refrigerantes',
      'laser pointers': 'Apuntadores Láser',
      'power adapters': 'Adaptadores de Corriente',
      'power adapter': 'Adaptador de Corriente',
      'adaptadores de corriente': 'Adaptadores de Corriente',
      'serial adapter': 'Adaptador Serial',
      'stylus pens': 'Lápices Stylus',
      'lápices stylus': 'Lápices Stylus',
      'tv antennas': 'Antenas TV',
      'antenas tv': 'Antenas TV',
      'usb adapters': 'Adaptadores USB',
      'usb hubs': 'Hubs USB',
      'hubs usb': 'Hubs USB',
      'cable usb-c': 'Cables USB-C',
      'car chargers': 'Cargadores para Auto',
      'chargers': 'Cargadores',
      'charging adapters': 'Adaptadores de Carga',
      'lightning cables': 'Cables Lightning',
      'micro-usb cables': 'Cables Micro-USB',
      'multi-purpose cables': 'Cables Multiuso',
      'otg adapters': 'Adaptadores OTG',
      'proprietary cables': 'Cables Propietarios',
      'tips/ends & multi-strips': 'Puntas y Regletas',
      'tv stands': 'Bases para TV',
      'flash drives': 'Memorias USB',
      'external hard drives': 'Discos Duros Externos',
      'external hdds': 'Discos Duros Externos',
      'internal hdds': 'Discos Duros Internos',
      'storage adapters': 'Adaptadores de Almacenamiento',
      'tarjetas de memoria': 'Tarjetas de Memoria',
      'external optical drives': 'Unidades Ópticas Externas',
      'adaptadores de audio': 'Adaptadores de Audio',
      'audio adapters': 'Adaptadores de Audio',
      'audífonos': 'Audífonos',
      'audio cables': 'Cables de Audio',
      'bluetooth speakers': 'Bocinas Bluetooth',
      'call center headsets': 'Audífonos Call Center',
      'computer speakers': 'Bocinas para PC',
      'headphones': 'Audífonos',
      'headsets': 'Audífonos con Micrófono',
      'speakers': 'Bocinas',
      'microphones': 'Micrófonos',
      'microphone stands': 'Bases para Micrófono',
      'microphones cordless': 'Micrófonos Inalámbricos',
      'microphones condenser': 'Micrófonos Condenser',
      'microphones dynamis': 'Micrófonos Dinámicos',
      'microphones dynamic': 'Micrófonos Dinámicos',
      'microphones gamer': 'Micrófonos Gamer',
      'microphones lavalier': 'Micrófonos de Solapa',
      'microphones professional': 'Micrófonos Profesionales',
      'portable speakers': 'Bocinas Portátiles',
      'soundcards': 'Tarjetas de Sonido',
      'soundcard': 'Tarjetas de Sonido',
      'sound cards': 'Tarjetas de Sonido',
      'sound card': 'Tarjetas de Sonido',
      'sound bars': 'Barras de Sonido',
      'sound bar': 'Barras de Sonido',
      'soundbars': 'Barras de Sonido',
      'soundbar': 'Barras de Sonido',
      'wired earphones': 'Audífonos con Cable',
      'cameras': 'Cámaras',
      'dvrs & nvrs': 'DVRs y NVRs',
      'fuentes de poder': 'Fuentes de Poder',
      'power supplies': 'Fuentes de Poder',
      'ram': 'Memoria RAM',
      'cooling solutions': 'Soluciones de Enfriamiento',
      'desktop pcs': 'PCs de Escritorio',
      'desktop towers': 'Torres de Escritorio',
      'laptop bags & cases': 'Mochilas y Estuches',
      'laptops': 'Portátiles',
      'all in one': 'Todo en Uno',
      'accessories': 'Accesorios',
      'gamepads': 'Controles',
      'gaming combos': 'Combos Gamer',
      'gaming keyboards': 'Teclados Gamer',
      'gaming mouse': 'Mouse Gamer',
      'mouse gamer': 'Mouse Gamer',
      'sillas': 'Sillas',
      'teclados mecánicos': 'Teclados Mecánicos',
      'cartuchos de tinta': 'Cartuchos',
      'ink cartridges': 'Cartuchos',
      'ink cartridge': 'Cartuchos',
      'cartuchos de tóner': 'Toners',
      'toner cartridges': 'Toners',
      'toner cartridge': 'Toners',
      'imaging units': 'Unidades de Imagen',
      'ink bottles': 'Botellas de Tinta',
      'inkjet print heads': 'Cabezales',
      'label printer ribbons': 'Cintas para Etiquetas',
      'label ribbons': 'Cintas para Etiquetas',
      'labels': 'Etiquetas',
      'maintenance kits - pads': 'Kits de Mantenimiento',
      'pos printers': 'Impresoras POS',
      'printer cables': 'Cables de Impresora',
      'printer chips': 'Chips de Impresora',
      'printer drums': 'Tambores de Impresora',
      'printer ribbons': 'Cintas de Impresora',
      'thermal paper rolls': 'Rollos de Papel Térmico',
      'toner powder': 'Polvo de Tóner',
      'toner refill kits': 'Kits de Recarga',
      'usb extender': 'Extensores USB',
      'scanners': 'Escáneres',
      'inkjet printers': 'Impresoras de Inyección',
      'laser printers': 'Impresoras Láser',
      'power banks': 'Bancos de Energía',
      'printer paper': 'Papel para Impresora',
      'keyboards': 'Teclados',
      'keyboard protectors': 'Protectores de Teclado',
      'keyboards & mice': 'Teclados y Mouse',
      'mouse': 'Mouse',
      'mouse pads': 'Mouse Pads',
      'barcode scanners': 'Lectores de Código',
      'cash drawers': 'Cajas Registradoras',
      'batteries': 'Baterías',
      'laptop adapters': 'Cargadores para Portátiles',
      'monitor adapters': 'Cargadores para Monitores',
      'pos adapters': 'Adaptadores POS',
      'power cords': 'Cables de Corriente',
      'sealed lead acid (sla) batteries': 'Baterías de Plomo',
      'surge protectors': 'Protectores de Sobretensión',
      'universal adapters': 'Cargadores Universales',
      'ups': 'UPS',
      'voltage regulators': 'Reguladores de Voltaje',
      'bluetooth adapter': 'Adaptador Bluetooth',
      'connectors': 'Conectores',
      'ethernet cables': 'Cables Ethernet',
      'fiber optic cables': 'Cables de Fibra Óptica',
      'network adapters': 'Adaptadores de Red',
      'nw ext-hub/splrs': 'Hubs y Splitters',
      'routers': 'Routers',
      'switches': 'Switches',
      'tools': 'Herramientas',
      'wi-fi extenders': 'Extensores WiFi',
      'graphics tablets': 'Tabletas Gráficas',
      'graphics cards': 'Tarjetas Gráficas',
      'monitors': 'Monitores',
      'splitters': 'Divisores',
      'video adapters': 'Adaptadores de Video',
      'video cables': 'Cables de Video'
    };
    
    return translations[normalized] || subcategory;
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
        
        // Crear estructura de categorías con subcategorías
        const categoryMap = {};
        
        data.forEach(product => {
          const category = translateCategory(product.category);
          const subcategory = translateSubcategory(product.category_sub);
          
          if (category && !categoryMap[category]) {
            categoryMap[category] = new Set();
          }
          
          if (category && subcategory) {
            categoryMap[category].add(subcategory);
          }
        });
        
        // Convertir a array y ordenar
        const categoriesArray = Object.keys(categoryMap)
          .sort((a, b) => a.localeCompare(b, 'es'))
          .map(cat => ({
            name: cat,
            subcategories: Array.from(categoryMap[cat]).sort((a, b) => a.localeCompare(b, 'es'))
          }));
        
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName === 'Todas') {
      setSelectedCategory('Todas');
      setSelectedSubcategory(null);
      setExpandedCategory(null);
    } else if (expandedCategory === categoryName) {
      // Si ya está expandida, la colapso
      setExpandedCategory(null);
    } else {
      // Expandir y seleccionar
      setExpandedCategory(categoryName);
      setSelectedCategory(categoryName);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategoryClick = (subcategoryName) => {
    setSelectedSubcategory(subcategoryName);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'Todas') {
      return matchesSearch;
    }
    
    const translatedCategory = translateCategory(product.category);
    const translatedSubcategory = translateSubcategory(product.category_sub);
    
    if (selectedSubcategory) {
      return matchesSearch && translatedCategory === selectedCategory && translatedSubcategory === selectedSubcategory;
    } else {
      return matchesSearch && translatedCategory === selectedCategory;
    }
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
          
          <div className="space-y-3">
            {/* Botón "Todas" */}
            <div>
              <button
                onClick={() => handleCategoryClick('Todas')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === 'Todas'
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Todas
              </button>
            </div>

            {/* Categorías con subcategorías */}
            {categories.map(category => (
              <div key={category.name}>
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={`px-6 py-2 rounded-full font-medium transition-all inline-flex items-center gap-2 ${
                    selectedCategory === category.name && !selectedSubcategory
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {category.name}
                  {expandedCategory === category.name ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {/* Subcategorías desplegables */}
                {expandedCategory === category.name && (
                  <div className="ml-8 mt-2 flex flex-wrap gap-2">
                    {category.subcategories.map(subcategory => (
                      <button
                        key={subcategory}
                        onClick={() => handleSubcategoryClick(subcategory)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedSubcategory === subcategory
                            ? 'bg-blue-400 text-white shadow-md'
                            : 'bg-white/40 text-white hover:bg-white/50'
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-white text-center text-lg">
            Mostrando {filteredProducts.length} de {products.length} productos
            {selectedSubcategory && ` en ${selectedCategory} - ${selectedSubcategory}`}
            {selectedCategory !== 'Todas' && !selectedSubcategory && ` en ${selectedCategory}`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                {product.image_url_png ? (
                  <img 
                    src={product.image_url_png} 
                    alt={product.product_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Package className="w-24 h-24 text-gray-300" />
                )}
              </div>
              
              <div className="p-4">
                <div className="text-xs text-blue-600 font-semibold mb-1">
                  {translateCategory(product.category)}
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
