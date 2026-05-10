import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding Sianne.crochets database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "tops" }, update: {}, create: { name: "Tops & Blouses", slug: "tops", description: "Handcrafted crochet tops and blouses for every occasion", image: "/categories/tops.jpg" } }),
    prisma.category.upsert({ where: { slug: "dresses" }, update: {}, create: { name: "Dresses & Sets", slug: "dresses", description: "Elegant crochet dresses and matching sets", image: "/categories/dresses.jpg" } }),
    prisma.category.upsert({ where: { slug: "bags" }, update: {}, create: { name: "Bags & Totes", slug: "bags", description: "Handwoven crochet bags and totes", image: "/categories/bags.jpg" } }),
    prisma.category.upsert({ where: { slug: "accessories" }, update: {}, create: { name: "Accessories", slug: "accessories", description: "Crochet headbands, jewelry, and more", image: "/categories/accessories.jpg" } }),
    prisma.category.upsert({ where: { slug: "sets" }, update: {}, create: { name: "Co-ord Sets", slug: "sets", description: "Matching crochet co-ordinate sets", image: "/categories/sets.jpg" } }),
    prisma.category.upsert({ where: { slug: "custom" }, update: {}, create: { name: "Custom Orders", slug: "custom", description: "Order a custom handcrafted crochet piece", image: "/categories/custom.jpg" } }),
  ]);

  const [tops, dresses, bags, accessories, sets, custom] = categories;
  console.log("✅ Categories created");

  // Products
  const products = [
    { name: "Boho Crochet Crop Top", slug: "boho-crochet-crop-top", price: 2800, comparePrice: 3500, categoryId: tops.id, stock: 8, isNew: true, isFeatured: true, description: "A stunning bohemian crochet crop top handcrafted from premium cotton yarn. Features an open-weave pattern with delicate detailing, perfect for beach days, festivals, or casual outings.", shortDescription: "Boho open-weave crochet crop top in premium cotton yarn", material: "100% Premium Cotton Yarn", estimatedDelivery: "5-7 business days", tags: ["boho", "crop top", "summer", "cotton"], colors: ["Cream", "Beige", "Brown"], sizes: ["XS", "S", "M", "L", "XL"] },
    { name: "Lace Midi Dress", slug: "lace-midi-dress", price: 5500, comparePrice: null, categoryId: dresses.id, stock: 4, isBestSeller: true, isFeatured: true, description: "An ethereal lace crochet midi dress that embodies effortless elegance. Hand-crocheted with intricate lace stitching, this dress is perfect for special occasions, beach weddings, or sunset dinners.", shortDescription: "Ethereal hand-crocheted lace midi dress", material: "Cotton-Linen Blend Yarn", estimatedDelivery: "7-10 business days", tags: ["lace", "dress", "elegant", "midi"], colors: ["White", "Cream", "Nude"], sizes: ["XS", "S", "M", "L"] },
    { name: "Market Tote Bag", slug: "market-tote-bag", price: 1800, comparePrice: null, categoryId: bags.id, stock: 15, isNew: false, isBestSeller: true, description: "A practical yet stylish crochet market tote bag, handwoven in a classic mesh pattern. Spacious enough for your daily essentials while maintaining its beautiful structure.", shortDescription: "Stylish handwoven crochet market tote bag", material: "Jute & Cotton Blend", estimatedDelivery: "3-5 business days", tags: ["bag", "tote", "market", "everyday"], colors: ["Natural", "Beige", "Tan"], sizes: [] },
    { name: "Sunset Beach Set", slug: "sunset-beach-set", price: 7200, comparePrice: 8500, categoryId: sets.id, stock: 3, isNew: true, isFeatured: true, description: "A breathtaking matching co-ord set featuring a crochet bikini top and high-waisted bottom in warm sunset tones. Ideal for beach holidays, pool parties, or resort wear.", shortDescription: "Matching crochet beach co-ord set", material: "100% Cotton Yarn", estimatedDelivery: "7-10 business days", tags: ["beach", "set", "bikini", "resort"], colors: ["Terracotta", "Sunset Orange", "Cream"], sizes: ["XS", "S", "M", "L"] },
    { name: "Boho Headband", slug: "boho-headband", price: 850, comparePrice: null, categoryId: accessories.id, stock: 25, description: "A handcrafted crochet headband with delicate floral motifs. Perfect for adding a bohemian touch to any outfit.", shortDescription: "Delicate floral crochet headband", material: "Soft Cotton Yarn", estimatedDelivery: "2-3 business days", tags: ["headband", "accessories", "boho", "floral"], colors: ["Cream", "Pink", "Beige", "Brown"], sizes: [] },
    { name: "Open-Back Crochet Top", slug: "open-back-crochet-top", price: 3200, comparePrice: null, categoryId: tops.id, stock: 6, isBestSeller: true, isFeatured: true, description: "A seductive open-back crochet top with intricate knotted detailing at the back. This statement piece pairs beautifully with high-waisted trousers or a maxi skirt.", shortDescription: "Statement open-back crochet top with knotted detail", material: "Mercerized Cotton Yarn", estimatedDelivery: "5-7 business days", tags: ["open back", "statement", "sexy", "elegant"], colors: ["Black", "Cream", "Brown"], sizes: ["XS", "S", "M", "L", "XL"] },
    { name: "Mini Shoulder Bag", slug: "mini-shoulder-bag", price: 2200, comparePrice: 2800, categoryId: bags.id, stock: 10, isNew: true, description: "A chic mini shoulder bag handwoven in a tight crochet pattern with an adjustable leather strap. Perfect for evenings out or adding a handmade touch to your daily look.", shortDescription: "Chic mini crochet shoulder bag with leather strap", material: "Cotton Yarn & Leather Strap", estimatedDelivery: "4-6 business days", tags: ["mini bag", "shoulder bag", "evening", "chic"], colors: ["Beige", "Black", "Tan", "Cream"], sizes: [] },
    { name: "Festival Maxi Dress", slug: "festival-maxi-dress", price: 6800, comparePrice: null, categoryId: dresses.id, stock: 0, isPreOrder: true, isFeatured: true, estimatedDelivery: "10-14 business days", description: "A stunning floor-length crochet maxi dress with fringe detailing and a flowy silhouette. This pre-order piece is crafted to perfection and ideal for festivals, garden parties, or boho weddings.", shortDescription: "Stunning fringe crochet maxi dress — pre-order", material: "100% Cotton Yarn with Fringe", tags: ["maxi", "festival", "fringe", "wedding"], colors: ["Cream", "White", "Sage"], sizes: ["XS", "S", "M", "L"] },
    { name: "Crochet Bucket Hat", slug: "crochet-bucket-hat", price: 1200, comparePrice: null, categoryId: accessories.id, stock: 20, isNew: true, description: "A trendy handcrafted crochet bucket hat in a chunky weave pattern. Protects from the sun while keeping your style game strong.", shortDescription: "Trendy chunky-weave crochet bucket hat", material: "Raffia & Cotton Blend", estimatedDelivery: "2-3 business days", tags: ["hat", "bucket hat", "summer", "accessory"], colors: ["Natural", "Beige", "Black", "Brown"], sizes: [] },
    { name: "Wrap Co-ord Set", slug: "wrap-coord-set", price: 8500, comparePrice: 10000, categoryId: sets.id, stock: 5, isBestSeller: true, isFeatured: true, description: "A sophisticated crochet wrap top and wide-leg trouser set that exudes luxury. The flowing wrap silhouette and premium yarn make this perfect for dinners, events, or date nights.", shortDescription: "Luxury wrap crochet top and trouser co-ord set", material: "Silk-Touch Cotton Yarn", estimatedDelivery: "7-10 business days", tags: ["co-ord", "wrap", "luxury", "event"], colors: ["Cream", "Beige", "Brown", "Black"], sizes: ["XS", "S", "M", "L", "XL"] },
    { name: "Fringe Crossbody Bag", slug: "fringe-crossbody-bag", price: 2600, comparePrice: null, categoryId: bags.id, stock: 8, isNew: true, description: "A statement crossbody bag with playful fringe detailing and a structured base. Handwoven in a tight crochet stitch with a long adjustable strap.", shortDescription: "Statement fringe crochet crossbody bag", material: "Jute & Cotton Yarn", estimatedDelivery: "4-5 business days", tags: ["crossbody", "fringe", "statement", "bag"], colors: ["Natural", "Beige", "Brown"], sizes: [] },
    { name: "Custom Crochet Piece", slug: "custom-crochet-piece", price: 5000, comparePrice: null, categoryId: custom.id, stock: 99, isPreOrder: true, isFeatured: false, description: "Order a completely custom handcrafted crochet piece made specifically to your measurements, color preferences, and design vision. Contact us to discuss your dream piece.", shortDescription: "Fully custom handcrafted crochet piece — made to your specifications", estimatedDelivery: "14-21 business days", tags: ["custom", "bespoke", "made to order"], colors: [], sizes: [] },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, status: "ACTIVE", images: [], careInstructions: "Hand wash in cold water. Lay flat to dry. Do not tumble dry.", weight: 0.3 } as any,
    });
  }
  console.log("✅ Products created");

  // Admin user
  const hashedPw = await bcrypt.hash("Admin@Sianne2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@sianne-crochets.com" },
    update: {},
    create: { name: "Sianne Admin", email: "admin@sianne-crochets.com", password: hashedPw, role: "ADMIN" },
  });
  console.log("✅ Admin user created (admin@sianne-crochets.com / Admin@Sianne2024!)");

  // Test user
  const testPw = await bcrypt.hash("TestUser123!", 12);
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: { name: "Test Customer", email: "test@example.com", password: testPw, role: "USER", phone: "0712345678" },
  });
  console.log("✅ Test user created (test@example.com / TestUser123!)");

  // Coupon
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", description: "10% off your first order", discount: 10, isPercent: true, isActive: true, expiresAt: new Date("2026-12-31") },
  });
  console.log("✅ Coupon created: WELCOME10 (10% off)");

  console.log("\n🌸 Sianne.crochets database seeded successfully!\n");
}

main().catch(console.error).finally(() => prisma.$disconnect());
