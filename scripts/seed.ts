import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Imágenes por categoría ───────────────────────────────────────────────────

const gorrasImages = [
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
  "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
  "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80",
  "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&q=80",
  "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80",
];

const camisetasImages = [
  "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
];

const locionesImages = [
  "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80",
  "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&q=80",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function price(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// ─── Datos de productos ───────────────────────────────────────────────────────

const gorrasData = [
  { name: "Gorra Snapback Clásica", desc: "Gorra snapback con visera plana y ajuste trasero. Bordado en frente. Talla única." },
  { name: "Gorra Dad Hat Vintage", desc: "Estilo dad hat con perfil bajo y cierre de hebilla metálica. Look relajado y atemporal." },
  { name: "Gorra Trucker Mesh", desc: "Panel frontal estructurado con parte trasera de malla. Ventilación óptima para el verano." },
  { name: "Gorra Bucket Hat Urban", desc: "Bucket hat de tela suave con ala ancha. Protección solar con estilo urbano." },
  { name: "Gorra Béisbol Premium", desc: "Gorra de béisbol con cierre velcro y interior acolchado. Tejido de alto rendimiento." },
  { name: "Gorra 5 Panel Minimalista", desc: "Diseño de 5 paneles con corte limpio. Ideal para skating y streetwear." },
  { name: "Gorra Retro Logo", desc: "Gorra con logo vintage bordado en relieve. Tela resistente de algodón pre-lavado." },
  { name: "Gorra Running Performance", desc: "Ligera y transpirable, con banda anti-sudor y visera curva. Perfecta para correr." },
  { name: "Gorra Camuflaje Edition", desc: "Estampado camuflaje con parche lateral. Ajuste strapback. Edición limitada." },
  { name: "Gorra Flat Brim Pro", desc: "Visera plana sin curvar, parche bordado al frente. Cierre strapback ajustable." },
];

const camisetasData = [
  { name: "Camiseta Básica Blanca", desc: "100% algodón peinado. Corte regular, cuello redondo. Esencial en cualquier guardarropa." },
  { name: "Camiseta Oversized Negra", desc: "Corte oversize con hombros caídos. Tela gruesa 280g. Look streetwear moderno." },
  { name: "Camiseta Gráfica Urban Art", desc: "Estampado gráfico original, serigrafía de alta calidad. Edición limitada." },
  { name: "Camiseta Rayas Marineras", desc: "Diseño clásico de rayas horizontales. Algodón jersey suave al tacto." },
  { name: "Camiseta Polo Piqué", desc: "Polo de piqué con cuello y botones. Tejido transpirable y de secado rápido." },
  { name: "Camiseta Tie-Dye Colores", desc: "Teñido anudado artesanal. Cada pieza es única. Colores vibrantes permanentes." },
  { name: "Camiseta Manga Larga Slim", desc: "Manga larga con corte slim. Tela suave con pequeño porcentaje de elastano." },
  { name: "Camiseta Henley Casual", desc: "Cuello henley con 3 botones. Mezcla de algodón y modal para máxima suavidad." },
  { name: "Camiseta Crop Top Sport", desc: "Corte crop para mujer. Tejido técnico de compresión ligera. Ideal para gym." },
  { name: "Camiseta Bordada Premium", desc: "Bordado en pecho con detalle floral. Algodón egipcio de alta calidad." },
  { name: "Camiseta Reciclada Eco", desc: "Fabricada con materiales reciclados certificados. Confort con conciencia ambiental." },
  { name: "Camiseta Vintage Wash", desc: "Tratamiento vintage que da un aspecto desgastado natural. Suave desde el primer uso." },
  { name: "Camiseta Dry Fit Training", desc: "Tecnología Dry Fit que aleja la humedad de la piel. Ideal para entrenamientos intensos." },
  { name: "Camiseta Estampado Tropical", desc: "Estampado de hojas tropicales en colores vivos. Perfecta para el verano." },
  { name: "Camiseta Cuello V Elegante", desc: "Cuello en V profundo con corte estructurado. Mezcla de algodón y viscosa." },
];

const locionesData = [
  { name: "Loción Acqua di Mare", desc: "Fragancia fresca marina con notas de bergamota, cedro y almizcle blanco. 100ml." },
  { name: "Loción Noir Intense", desc: "Fragancia oriental intensa. Notas de oud, vainilla y pachulí. Duración 12h. 100ml." },
  { name: "Loción Floral Bloom", desc: "Bouquet floral de rosas, jazmín y lichi. Ideal para uso diario. 100ml." },
  { name: "Loción Sport Active", desc: "Fragancia fresca y energizante. Notas cítricas de limón, menta y madera. 100ml." },
  { name: "Loción Ámbar Gold", desc: "Fragancia cálida y seductora. Ámbar, sándalo y notas amaderadas. Edición premium. 100ml." },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar BD en orden (respetando foreign keys)
  console.log('Limpiando base de datos...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Base de datos limpia');

  // Usuarios
  console.log('Creando usuarios...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tienda.com' },
    update: {},
    create: {
      email: 'admin@tienda.com',
      password: adminPassword,
      name: 'Admin Tienda',
      phone: '+57 300 000 0001',
      acceptContact: true,
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'usuario@tienda.com' },
    update: {},
    create: {
      email: 'usuario@tienda.com',
      password: userPassword,
      name: 'Usuario Demo',
      phone: '+57 300 000 0002',
      acceptContact: true,
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Admin:', adminUser.email, '| Password: admin123');
  console.log('✅ Usuario:', regularUser.email, '| Password: user123');

  // Categorías
  console.log('Creando categorías...');

  const gorras = await prisma.category.upsert({
    where: { slug: 'gorras' },
    update: { isActive: true },
    create: {
      name: 'Gorras',
      slug: 'gorras',
      description: 'Gorras y sombreros para todos los estilos',
      isActive: true,
    },
  });

  const camisetas = await prisma.category.upsert({
    where: { slug: 'camisetas' },
    update: { isActive: true },
    create: {
      name: 'Camisetas',
      slug: 'camisetas',
      description: 'Camisetas y tops para hombre y mujer',
      isActive: true,
    },
  });

  const lociones = await prisma.category.upsert({
    where: { slug: 'lociones' },
    update: { isActive: true },
    create: {
      name: 'Lociones',
      slug: 'lociones',
      description: 'Perfumes y lociones de alta gama',
      isActive: true,
    },
  });

  console.log('✅ Categorías creadas: Gorras, Camisetas, Lociones (todas activas)');

  // Productos — Gorras (10)
  console.log('Creando gorras...');
  for (let i = 0; i < gorrasData.length; i++) {
    const { name, desc } = gorrasData[i];
    await prisma.product.upsert({
      where: { id: `gorra-${String(i + 1).padStart(3, '0')}` },
      update: {},
      create: {
        id: `gorra-${String(i + 1).padStart(3, '0')}`,
        name,
        description: desc,
        price: price(15, 55),
        stock: rand(10, 80),
        categoryId: gorras.id,
        images: [pick(gorrasImages)],
      },
    });
  }
  console.log(`✅ 10 gorras creadas`);

  // Productos — Camisetas (15)
  console.log('Creando camisetas...');
  for (let i = 0; i < camisetasData.length; i++) {
    const { name, desc } = camisetasData[i];
    await prisma.product.upsert({
      where: { id: `camiseta-${String(i + 1).padStart(3, '0')}` },
      update: {},
      create: {
        id: `camiseta-${String(i + 1).padStart(3, '0')}`,
        name,
        description: desc,
        price: price(18, 65),
        stock: rand(15, 120),
        categoryId: camisetas.id,
        images: [pick(camisetasImages)],
      },
    });
  }
  console.log(`✅ 15 camisetas creadas`);

  // Productos — Lociones (5)
  console.log('Creando lociones...');
  for (let i = 0; i < locionesData.length; i++) {
    const { name, desc } = locionesData[i];
    await prisma.product.upsert({
      where: { id: `locion-${String(i + 1).padStart(3, '0')}` },
      update: {},
      create: {
        id: `locion-${String(i + 1).padStart(3, '0')}`,
        name,
        description: desc,
        price: price(35, 120),
        stock: rand(5, 40),
        categoryId: lociones.id,
        images: [pick(locionesImages)],
      },
    });
  }
  console.log(`✅ 5 lociones creadas`);

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('   • 2 usuarios (admin + customer)');
  console.log('   • 3 categorías activas');
  console.log('   • 30 productos en total (10 gorras + 15 camisetas + 5 lociones)');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
