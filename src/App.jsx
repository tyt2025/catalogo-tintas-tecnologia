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
      'software': 'Software'
    };
    
    if (!category) return '';
    const normalized = category.toLowerCase().trim();
    return translations[normalized] || category;
  };

  const translateSubcategory = (subcategory) => {
    const translations = {
      // Impresión
      'ink cartridges': 'Cartuchos de Tinta',
      'toner cartridges': 'Cartuchos de Tóner',
      'printer accessories': 'Accesorios de Impresora',
      'printing': 'Impresión',
      'toner': 'Tóner',
      'ink': 'Tinta',
      
      // Accesorios
      'accessories': 'Accesorios',
      'mouse': 'Mouse',
      'keyboard': 'Teclado',
      'webcam': 'Cámara Web',
      'headset': 'Audífonos',
      
      // Cables
      'cables': 'Cables',
      'usb cables': 'Cables USB',
      'hdmi cables': 'Cables HDMI',
      'network cables': 'Cables de Red',
      
      // Almacenamiento
      'storage': 'Almacenamiento',
      'hard drives': 'Discos Duros',
      'usb drives': 'Memorias USB',
      'memory cards': 'Tarjetas de Memoria',
      
      // Redes
      'networking': 'Redes',
      'routers': 'Routers',
      'switches': 'Switches',
      'wifi': 'WiFi',
      
      // Audio
      'audio': 'Audio',
      'speakers': 'Bocinas',
      'headphones': 'Audífonos',
      'microphones': 'Micrófonos',
      
      // Energía
      'power': 'Energía',
      'ups': 'UPS',
      'power supplies': 'Fuentes de Poder',
      'batteries': 'Baterías',
      
      // Oficina
      'office': 'Oficina',
      'monitors': 'Monitores',
      'projectors': 'Proyectores',
      
      // Gamer
      'gaming mouse': 'Mouse',
      'gaming keyboard': 'Teclado',
      'gaming headset': 'Audífonos',
      'gaming chair': 'Silla',
      'mousepad': 'Mousepad',
      'controller': 'Control'
    };
    
    if (!subcategory) return '';
    const normalized = subcategory.toLowerCase().trim();
    return translations[normalized] || subcategory;
  };

  // Nueva función para combinar categoría + subcategoría
  const getCategoryLabel = (product) => {
    const category = translateCategory(product.category);
    const subcategory = translateSubcategory(product.subcategory);
    
    if (!category && !subcategory) return 'Sin categoría';
    if (!subcategory) return category;
    if (!category) return subcategory;
    
    return `${category} - ${subcategory}`;
  };
